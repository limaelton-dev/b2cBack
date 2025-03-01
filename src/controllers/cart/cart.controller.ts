import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { CartService } from 'src/services/cart/cart.service';
import { CartDataDto, UpdateCartDto } from '../../services/cart/dto/updateCart.dto'
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
}
