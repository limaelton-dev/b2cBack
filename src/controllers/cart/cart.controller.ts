import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { Cart } from 'src/models/cart/cart';
import { CartService } from 'src/services/cart/cart.service';
import { CartDataDto, UpdateCartDto } from '../../services/cart/dto/updateCart.dto'

@Controller('carrinho')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get(':id')
    async getCarrinhoUser(@Param('id') id: number): Promise<CartDataDto> {
        return this.cartService.getCarrinhoUser(id);
    }

    @Patch(':id')
    async updateCarrinhoUser(@Param('id') id: number, @Body() updateCartDto: UpdateCartDto): Promise<CartDataDto> {
        return this.cartService.updateCarrinhoUser(id, updateCartDto);
    }
}
