import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { ProductService } from '../../product/services/product.service';
import { DiscountService } from '../../discount/services/discount.service';
import { CartRepository } from '../repositories/cart.repository';
import { CartItemRepository } from '../repositories/cart-item.repository';
import { CartResponseDto, CartItemResponseDto } from '../dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(
    private cartRepository: CartRepository,
    private cartItemRepository: CartItemRepository,
    private productService: ProductService,
    private discountService: DiscountService,
  ) {}

  async getCart(profileId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOneByProfileId(profileId);

    if (!cart) {
      cart = await this.createCart(profileId);
    }

    return cart;
  }

  // Método para buscar carrinho pelo ID
  async getCartById(cartId: number): Promise<Cart> {
    console.log('CartService.getCartById:', { cartId });
    const cart = await this.cartRepository.findOne(cartId);
    if (!cart) {
      throw new NotFoundException(`Carrinho com ID ${cartId} não encontrado`);
    }
    return cart;
  }

  // Método compatível com a nova interface do checkout
  async findByProfileId(profileId: number): Promise<Cart> {
    console.log('CartService.findByProfileId:', { profileId });
    return this.cartRepository.findOneByProfileId(profileId);
  }

  // Método compatível com a nova interface do checkout
  async create(profileId: number): Promise<Cart> {
    console.log('CartService.create:', { profileId });
    return this.createCart(profileId);
  }

  async getCartSimplified(profileId: number): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    return this.mapToCartResponse(cart);
  }

  private mapToCartResponse(cart: Cart): CartResponseDto {
    const responseDto = new CartResponseDto();
    responseDto.id = cart.id;
    responseDto.subtotal = cart.subtotal;
    responseDto.total = cart.total;
    responseDto.items = cart.items.map(item => {
      const itemDto = new CartItemResponseDto();
      itemDto.id = item.id;
      itemDto.productId = item.productId;
      itemDto.quantity = item.quantity;
      return itemDto;
    });
    return responseDto;
  }

  private async createCart(profileId: number): Promise<Cart> {
    console.log('CartService.createCart:', { profileId });
    return this.cartRepository.create({
      profileId,
      subtotal: 0,
      total: 0,
    });
  }

  async addToCart(profileId: number, addToCartDto: AddToCartDto): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    const product = await this.productService.findOne(addToCartDto.productId);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    let cartItem = cart.items.find(item => item.productId === product.id);

    if (cartItem) {
      cartItem.quantity += addToCartDto.quantity;
      cartItem.totalPrice = Number((cartItem.quantity * Number(cartItem.unitPrice)).toFixed(2));
    } else {
      const unitPrice = Number(product.price);
      const totalPrice = Number((addToCartDto.quantity * unitPrice).toFixed(2));
      
      cartItem = await this.cartItemRepository.create({
        cartId: cart.id,
        productId: product.id,
        quantity: addToCartDto.quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
      });
      cart.items.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);
    await this.updateCartTotals(cart);

    return this.getCartSimplified(profileId);
  }

  async updateCartItem(
    profileId: number,
    itemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    const cartItem = cart.items.find(item => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    // Certifica-se de que o preço total é um número formatado corretamente
    cartItem.totalPrice = Number((cartItem.quantity * Number(cartItem.unitPrice)).toFixed(2));

    await this.cartItemRepository.save(cartItem);
    await this.updateCartTotals(cart);

    return this.getCartSimplified(profileId);
  }

  async removeCartItem(
    profileId: number,
    itemId: number,
  ): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    
    // Encontra o item no carrinho
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }
    
    // Remove o item da lista antes de chamar o repositório
    const cartItem = cart.items[itemIndex];
    cart.items.splice(itemIndex, 1);
    
    // Remove do banco de dados
    await this.cartItemRepository.remove(cartItem);
    
    // Atualiza os totais do carrinho
    await this.updateCartTotals(cart);
    
    // Obtém o carrinho atualizado diretamente da instância atual
    // em vez de fazer uma nova consulta ao banco de dados
    return this.mapToCartResponse(cart);
  }

  async applyDiscount(
    profileId: number,
    discountCode: string,
  ): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    const discount = await this.discountService.findByCode(discountCode);

    if (!discount) {
      throw new NotFoundException('Cupom de desconto não encontrado');
    }

    cart.discountId = discount.id;
    await this.updateCartTotals(cart);

    return this.getCartSimplified(profileId);
  }

  private async updateCartTotals(cart: Cart): Promise<void> {
    const subtotal = Number(
      cart.items.reduce((sum, item) => sum + Number(item.totalPrice), 0).toFixed(2)
    );
    
    cart.subtotal = subtotal;

    if (cart.discountId) {
      const discount = await this.discountService.findOne(cart.discountId);
      if (discount) {
        cart.total = Number(
          (await this.calculateDiscountedTotal(subtotal, discount)).toFixed(2)
        );
      } else {
        cart.total = subtotal;
      }
    } else {
      cart.total = subtotal;
    }

    await this.cartRepository.save(cart);
  }

  private async calculateDiscountedTotal(
    subtotal: number,
    discount: any,
  ): Promise<number> {
    let result = 0;
    switch (discount.unit) {
      case 'percentage':
        result = subtotal * (1 - discount.percentage / 100);
        break;
      case 'fixed':
        result = Math.max(0, subtotal - discount.fixedAmount);
        break;
      case 'free_shipping':
        result = subtotal;
        break;
      default:
        result = subtotal;
    }
    // Retorna o valor formatado para 2 casas decimais
    return Number(result.toFixed(2));
  }

  async clearCart(profileId: number): Promise<void> {
    let cart: Cart;

    cart = await this.getCart(profileId);

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    await this.cartItemRepository.deleteByCartId(cart.id);
    
    cart.items = [];
    cart.subtotal = 0;
    cart.total = 0;

    await this.cartRepository.save(cart);
  }

  async updateCartItemByProductId(
    profileId: number,
    productId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    const cartItem = cart.items.find(item => item.productId === productId);

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    // Certifica-se de que o preço total é um número formatado corretamente
    cartItem.totalPrice = Number((cartItem.quantity * Number(cartItem.unitPrice)).toFixed(2));

    await this.cartItemRepository.save(cartItem);
    await this.updateCartTotals(cart);

    return this.getCartSimplified(profileId);
  }

  async removeCartItemByProductId(
    profileId: number,
    productId: number,
  ): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    
    // Encontra o item no carrinho pelo ID do produto
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }
    
    // Remove o item da lista antes de chamar o repositório
    const cartItem = cart.items[itemIndex];
    cart.items.splice(itemIndex, 1);
    
    // Remove do banco de dados
    await this.cartItemRepository.remove(cartItem);
    
    // Atualiza os totais do carrinho
    await this.updateCartTotals(cart);
    
    // Obtém o carrinho atualizado diretamente da instância atual
    return this.mapToCartResponse(cart);
  }
} 