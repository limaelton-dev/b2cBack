import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { ProductService } from '../../product/services/product.service';
import { DiscountService } from '../../discount/services/discount.service';
import { CartRepository } from '../repositories/cart.repository';
import { CartItemRepository } from '../repositories/cart-item.repository';

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

  private async createCart(profileId: number): Promise<Cart> {
    return this.cartRepository.create({
      profileId,
      subtotal: 0,
      total: 0,
    });
  }

  async addToCart(profileId: number, addToCartDto: AddToCartDto): Promise<Cart> {
    const cart = await this.getCart(profileId);
    const product = await this.productService.findOne(addToCartDto.productId);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    let cartItem = cart.items.find(item => item.productId === product.id);

    if (cartItem) {
      cartItem.quantity += addToCartDto.quantity;
      cartItem.totalPrice = cartItem.quantity * cartItem.unitPrice;
    } else {
      cartItem = await this.cartItemRepository.create({
        cartId: cart.id,
        productId: product.id,
        quantity: addToCartDto.quantity,
        unitPrice: product.price,
        totalPrice: product.price * addToCartDto.quantity,
      });
      cart.items.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);
    await this.updateCartTotals(cart);

    return this.getCart(profileId);
  }

  async updateCartItem(
    profileId: number,
    itemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getCart(profileId);
    const cartItem = cart.items.find(item => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    cartItem.totalPrice = cartItem.quantity * cartItem.unitPrice;

    await this.cartItemRepository.save(cartItem);
    await this.updateCartTotals(cart);

    return this.getCart(profileId);
  }

  async removeCartItem(profileId: number, itemId: number): Promise<Cart> {
    const cart = await this.getCart(profileId);
    const cartItem = cart.items.find(item => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    await this.cartItemRepository.remove(cartItem);
    await this.updateCartTotals(cart);

    return this.getCart(profileId);
  }

  async applyDiscount(profileId: number, discountCode: string): Promise<Cart> {
    const cart = await this.getCart(profileId);
    const discount = await this.discountService.findByCode(discountCode);

    if (!discount) {
      throw new NotFoundException('Cupom de desconto não encontrado');
    }

    cart.discountId = discount.id;
    await this.updateCartTotals(cart);

    return this.getCart(profileId);
  }

  private async updateCartTotals(cart: Cart): Promise<void> {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

    if (cart.discountId) {
      const discount = await this.discountService.findOne(cart.discountId);
      if (discount) {
        cart.total = await this.calculateDiscountedTotal(cart.subtotal, discount);
      } else {
        cart.total = cart.subtotal;
      }
    } else {
      cart.total = cart.subtotal;
    }

    await this.cartRepository.save(cart);
  }

  private async calculateDiscountedTotal(
    subtotal: number,
    discount: any,
  ): Promise<number> {
    switch (discount.unit) {
      case 'percentage':
        return subtotal * (1 - discount.value / 100);
      case 'fixed':
        return Math.max(0, subtotal - discount.value);
      case 'free_shipping':
        return subtotal;
      default:
        return subtotal;
    }
  }
} 