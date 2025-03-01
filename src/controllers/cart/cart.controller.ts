import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, Request, ParseIntPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { CartService } from 'src/services/cart/cart.service';
import { CartDataDto, UpdateCartDto, CartItemDto } from '../../services/cart/dto/updateCart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserCart(@Request() req): Promise<CartDataDto> {
        const userId = req.user.id;
        return this.cartService.getUserCart(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    async updateUserCart(@Request() req, @Body() updateCartDto: UpdateCartDto): Promise<CartDataDto> {
        const userId = req.user.id;
        return this.cartService.updateUserCart(userId, updateCartDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('item')
    async addItemToCart(@Request() req, @Body() item: CartItemDto): Promise<CartDataDto> {
        const userId = req.user.id;
        return this.cartService.addItemToCart(userId, item);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('item/:produtoId')
    async removeItemFromCart(@Request() req, @Param('produtoId', ParseIntPipe) produtoId: number): Promise<CartDataDto> {
        const userId = req.user.id;
        return this.cartService.removeItemFromCart(userId, produtoId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('item/:produtoId/quantity/:quantity')
    async updateItemQuantity(
        @Request() req, 
        @Param('produtoId', ParseIntPipe) produtoId: number,
        @Param('quantity', ParseIntPipe) quantity: number
    ): Promise<CartDataDto> {
        const userId = req.user.id;
        return this.cartService.updateItemQuantity(userId, produtoId, quantity);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async clearCart(@Request() req): Promise<void> {
        const userId = req.user.id;
        await this.cartService.clearCart(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('total')
    async getCartTotal(@Request() req): Promise<{ total: number }> {
        const userId = req.user.id;
        const total = await this.cartService.getCartTotal(userId);
        return { total };
    }
}
