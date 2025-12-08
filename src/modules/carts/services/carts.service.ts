import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from '../repositories/carts.repository';
import { UpsertCartDto } from '../dto/upsert-cart.dto';
import { Cart } from '../entities/cart.entity';
import { CartItemDto } from '../dto/cart-item.dto';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);

  constructor(
    private readonly cartsRepository: CartRepository,
    // FUTURO: injetar um ProductCatalogService / AnyMarketService aqui
    // para validar produto, sku e estoque.
  ) {}

  async findWithItems(profileId: number): Promise<Cart> {
    const cart = await this.cartsRepository.findByProfileId(profileId);
    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }
    return cart;
  }

  async upsertCart(
    profileId: number,
    upsertCartDto: UpsertCartDto,
  ): Promise<Cart> {
    const items: CartItemDto[] = upsertCartDto.items ?? [];

    if (!items.length) {
      return this.cartsRepository.upsertWithItems(profileId, []);
    }

    // TODO: validar todos os itens
    // contra o catálogo (AnyMarket):
    // - verificar se productId/skuId existem
    // - verificar se o sku está ativo
    // - verificar se há estoque suficiente
    // Exemplo :
    // await this.productsService.ensureItemsAreAvailable(items);

    return this.cartsRepository.upsertWithItems(profileId, items);
  }

  async addItem(profileId: number, cartItemDto: CartItemDto): Promise<Cart> {
    // TODO: validação de produto (AnyMarket) antes de mexer no carrinho:
    // - garantir que productId/skuId existem e pertencem ao mesmo produto
    // - verificar estoque mínimo para a quantity pedida
    // Exemplo:
    // await this.productsService.ensureItemIsAvailable(cartItemDto);

    const existingCart =
      (await this.cartsRepository.findByProfileId(profileId)) ??
      (await this.cartsRepository.create(profileId));


    const existingItem = existingCart.items?.find(
      item =>
        item.productId === cartItemDto.productId &&
        item.skuId === cartItemDto.skuId,
    );

    if (!existingItem) {
      const cartItem = await this.cartsRepository.createItem(cartItemDto);
      cartItem.cart = existingCart;
      existingCart.items = [...(existingCart.items ?? []), cartItem];
    } else {
      existingItem.quantity += cartItemDto.quantity;
    }

    return this.cartsRepository.save(existingCart);
  }

  async updateItemQuantity(
    profileId: number,
    itemId: number,
    quantity: number,
  ): Promise<Cart> {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantidade deve ser um inteiro positivo.');
    }

    const cart = await this.cartsRepository.findByProfileId(profileId);

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    const cartItem = cart.items?.find(item => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho.');
    }

    // TODO: se você quiser, aqui também pode validar estoque
    // com base no novo quantity antes de aplicar a alteração.

    cartItem.quantity = quantity;
    const updatedCart = await this.cartsRepository.save(cart);

    return updatedCart;
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
}
