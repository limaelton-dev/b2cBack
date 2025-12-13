import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from '../repositories/carts.repository';
import { UpsertCartDto } from '../dto/upsert-cart.dto';
import { Cart } from '../entities/cart.entity';
import { CartItemDto } from '../dto/cart-item.dto';
import { CartWithDetailsDto, CartItemWithDetailsDto } from '../dto/cart-with-details.dto';
import { ProductsService } from 'src/modules/products/services/products.service';
import { calculateItemsTotal } from 'src/common/helpers/price.util';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartPreviewDto } from '../dto/cart-preview.dto';

@Injectable()
export class CartsService {
  constructor(
    private readonly cartsRepository: CartRepository,
    private readonly productsService: ProductsService,
  ) {}

  private async buildDetailsFromItems(
    items: Array<{ skuId: number; quantity: number; available: boolean }>,
  ): Promise<CartWithDetailsDto> {
    if (!items.length) {
      return { items: [], subtotal: 0 };
    }

    const skuIds = items.map(item => item.skuId);
    const skuDetailsMap = await this.productsService.findSkusForCart(skuIds);

    const subtotal = calculateItemsTotal(items, skuDetailsMap);

    const detailedItems: CartItemWithDetailsDto[] = items
      .map(item => {
        const sku = skuDetailsMap.get(item.skuId);
        if (!sku) return null;

        const { _rawPrice, ...skuClean } = sku;

        return {
          skuId: item.skuId,
          quantity: item.quantity,
          available: item.available,
          sku: skuClean,
        };
      })
      .filter((item): item is CartItemWithDetailsDto => item !== null);

    return { items: detailedItems, subtotal };
  }

  private async validateOrThrow(items: Array<{ skuId: number; quantity: number }>) {
    const result = await this.productsService.validateSkuAvailability(items);
    if (!result.isValid) {
      throw new BadRequestException(result.invalid.map(i => i.message).join('; '));
    }
    return result;
  }

  private async syncAvailability(cart: Cart): Promise<Cart> {
    if (!cart?.items?.length) return cart;

    const items = cart.items.map(i => ({ skuId: i.skuId, quantity: i.quantity }));
    const result = await this.productsService.validateSkuAvailability(items);

    const unavailableSkuIds = new Set(result.invalid.map(i => i.skuId));
    let hasChanges = false;

    for (const item of cart.items) {
      const shouldBeAvailable = !unavailableSkuIds.has(item.skuId);
      if (item.available !== shouldBeAvailable) {
        await this.cartsRepository.updateItem(item.id, { available: shouldBeAvailable });
        item.available = shouldBeAvailable;
        hasChanges = true;
      }
    }

    return hasChanges ? (await this.cartsRepository.findWithItems(cart.id)) ?? cart : cart;
  }

  async findWithItems(profileId: number): Promise<Cart> {
    const cart = await this.cartsRepository.findByProfileId(profileId);
    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }
    return this.syncAvailability(cart);
  }

  async upsertCart(profileId: number, upsertCartDto: UpsertCartDto): Promise<Cart> {
    const items: CartItemDto[] = upsertCartDto.items ?? [];

    if (!items.length) {
      return this.cartsRepository.upsertWithItems(profileId, []);
    }

    await this.validateOrThrow(items);
    return this.cartsRepository.upsertWithItems(profileId, items);
  }

  async addItem(profileId: number, cartItemDto: CartItemDto): Promise<Cart> {
    const existingCart =
      (await this.cartsRepository.findByProfileId(profileId)) ??
      (await this.cartsRepository.create(profileId));

    const existingItem = existingCart.items?.find(
      item => item.skuId === cartItemDto.skuId,
    );
    const totalQuantity = (existingItem?.quantity ?? 0) + cartItemDto.quantity;

    await this.validateOrThrow([{ skuId: cartItemDto.skuId, quantity: totalQuantity }]);

    if (!existingItem) {
      const cartItem = await this.cartsRepository.createItem(cartItemDto);
      cartItem.cart = existingCart;
      existingCart.items = [...(existingCart.items ?? []), cartItem];
    } else {
      existingItem.quantity = totalQuantity;
    }

    return this.cartsRepository.save(existingCart);
  }

  async updateItem(
    profileId: number,
    itemId: number,
    dto: UpdateCartItemDto,
  ): Promise<Cart> {
    const item = await this.cartsRepository.findItemById(itemId);

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    if (item.cart.profileId !== profileId) {
      throw new BadRequestException('Item não pertence ao seu carrinho');
    }

    if (dto.quantity !== undefined) {
      if (!Number.isInteger(dto.quantity) || dto.quantity <= 0) {
        throw new BadRequestException('Quantidade deve ser um inteiro positivo');
      }
      await this.validateOrThrow([{ skuId: item.skuId, quantity: dto.quantity }]);
    }

    await this.cartsRepository.updateItem(itemId, dto);
    return this.cartsRepository.findWithItems(item.cart.id);
  }

  async removeItem(profileId: number, itemId: number): Promise<Cart> {
    const cart = await this.cartsRepository.findByProfileId(profileId);
    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    if (!cart.items?.some(item => item.id === itemId)) {
      throw new NotFoundException('Item não encontrado no carrinho.');
    }

    await this.cartsRepository.removeItem(cart.id, itemId);

    const updatedCart =
      (await this.cartsRepository.findWithItems(cart.id)) ?? cart;

    return updatedCart;
  }

  async clearCart(profileId: number): Promise<Cart> {
    const cart = await this.cartsRepository.findByProfileId(profileId);

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    await this.cartsRepository.clearItems(cart.id);

    const updatedCart =
      (await this.cartsRepository.findWithItems(cart.id)) ?? cart;

    return updatedCart;
  }
  
  async findWithDetails(profileId: number): Promise<CartWithDetailsDto> {
    let cart = await this.cartsRepository.findByProfileId(profileId);

    if (!cart?.items?.length) {
      return { items: [], subtotal: 0 };
    }

    // Mantém a lógica de sincronizar disponibilidade, pois aqui faz sentido
    cart = await this.syncAvailability(cart);

    const items = cart.items.map(item => ({
      skuId: item.skuId,
      quantity: item.quantity,
      available: item.available,
    }));

    return this.buildDetailsFromItems(items);
  }

  async previewDetailsFromPayload(dto: CartPreviewDto): Promise<CartWithDetailsDto> {
    const baseItems = dto.items ?? [];
  
    if (!baseItems.length) {
      return { items: [], subtotal: 0 };
    }
  
    const validationResult = await this.productsService.validateSkuAvailability(
      baseItems.map(i => ({ skuId: i.skuId, quantity: i.quantity })),
    );
  
    const unavailableSkuIds = new Set(validationResult.invalid.map(i => i.skuId));
  
    const itemsWithAvailability = baseItems.map(item => ({
      skuId: item.skuId,
      quantity: item.quantity,
      available: !unavailableSkuIds.has(item.skuId),
    }));
  
    return this.buildDetailsFromItems(itemsWithAvailability);
  }

}
