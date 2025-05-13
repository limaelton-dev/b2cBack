import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { CartResponseDto } from '../dto/cart-response.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@GetUser('profileId') profileId: number): Promise<CartResponseDto> {
    return this.cartService.getCartSimplified(profileId);
  }

  @Post('items')
  async addToCart(
    @GetUser('profileId') profileId: number,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(profileId, addToCartDto);
  }

  @Put('items/:id')
  async updateCartItem(
    @GetUser('profileId') profileId: number,
    @Param('id') itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateCartItem(profileId, itemId, updateCartItemDto);
  }

  @Put('items/product/:productId')
  async updateCartItemByProductId(
    @GetUser('profileId') profileId: number,
    @Param('productId') productId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateCartItemByProductId(profileId, productId, updateCartItemDto);
  }

  @Delete('items/:id')
  async removeCartItem(
    @GetUser('profileId') profileId: number,
    @Param('id') itemId: number,
  ): Promise<CartResponseDto> {
    return this.cartService.removeCartItem(profileId, itemId);
  }

  @Delete('items/product/:productId')
  async removeCartItemByProductId(
    @GetUser('profileId') profileId: number,
    @Param('productId') productId: number,
  ): Promise<CartResponseDto> {
    return this.cartService.removeCartItemByProductId(profileId, productId);
  }

  @Delete()
  async clearCart(@GetUser('profileId') profileId: number): Promise<CartResponseDto> {
    await this.cartService.clearCart(profileId);
    return this.cartService.getCartSimplified(profileId);
  }

  @Post('discount')
  async applyDiscount(
    @GetUser('profileId') profileId: number,
    @Body('code') discountCode: string,
  ): Promise<CartResponseDto> {
    return this.cartService.applyDiscount(profileId, discountCode);
  }
} 