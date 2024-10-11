import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/models/cart/cart';
import { CartDataDto, UpdateCartDto } from './dto/updateCart.dto'

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
    ) {}

    async getCarrinhoUser(id: number): Promise<CartDataDto> {
        const cart = await this.cartRepository.findOne({ where: { user: { id: id } } });
        return cart.cart_data;
    }

    async updateCarrinhoUser(id: number, updateCartDto: UpdateCartDto): Promise<CartDataDto> {
        const cart = await this.cartRepository.findOne({ where: { id } });
        if (!cart) {
            throw new NotFoundException(`Carrinho com o id "${id}" não encontrado.`);
        }
    
        Object.assign(cart, updateCartDto);
        const savedCart = await this.cartRepository.save(cart);
        return { cart_data: savedCart.cart_data };
      }
}
