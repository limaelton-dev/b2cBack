import { Controller, Get, Param, Query } from '@nestjs/common';
import { Cart } from 'src/models/cart/cart';
import { CartService } from 'src/services/cart/cart.service';

@Controller('carrinho')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get(':id')
    async getCarrinhoUser(@Param('id') id: number): Promise<Cart> {
        return this.cartService.getCarrinhoUser(id);
    }
}
