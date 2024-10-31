import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/models/cart/cart';
import { CartDataDto, UpdateCartDto } from './dto/updateCart.dto'
import { User } from 'src/models/user/user';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async getCarrinhoUser(id: number): Promise<CartDataDto> {
        const cart = await this.cartRepository.findOne({ where: { user: { id: id } } });
        if(cart) {
            return cart.cart_data;
        }
        else {
            return { cart_data: [] };
        }
    }

    async updateCarrinhoUser(id: number, updateCartDto: UpdateCartDto): Promise<CartDataDto> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException('Usuário não encontrado.');
    
        const cart = await this.cartRepository.findOne({ where: { user: { id: user.id } } });
        
        if (!cart) {
            const cartCreate = this.cartRepository.create({
                user,
                cart_data: updateCartDto.cart_data,
            });
            const response = await this.cartRepository.save(cartCreate);
            if (response) {
                return { cart_data: response.cart_data };
            } else {
                throw new InternalServerErrorException('Erro ao adicionar carrinho');
            }
        }
    
        await this.cartRepository.update(cart.id, { cart_data: updateCartDto.cart_data });
        return { cart_data: updateCartDto.cart_data };
    }
}
