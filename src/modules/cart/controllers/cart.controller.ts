import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@GetUser('profileId') profileId: number) {
    return this.cartService.getCart(profileId);
  }

  @Post('items')
  async addToCart(
    @GetUser('profileId') profileId: number,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(profileId, addToCartDto);
  }

  @Put('items/:id')
  async updateCartItem(
    @GetUser('profileId') profileId: number,
    @Param('id') itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(profileId, itemId, updateCartItemDto);
  }

  @Delete('items/:id')
  async removeCartItem(
    @GetUser('profileId') profileId: number,
    @Param('id') itemId: number,
  ) {
    return this.cartService.removeCartItem(profileId, itemId);
  }

  @Post('discount')
  async applyDiscount(
    @GetUser('profileId') profileId: number,
    @Body('code') discountCode: string,
  ) {
    return this.cartService.applyDiscount(profileId, discountCode);
  }
} 