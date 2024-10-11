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
        const user = await this.userRepository.findOneBy({ id: id });
        const cart = await this.cartRepository.findOne({ where: { user: user } });
        if (!cart) {
            const c = this.cartRepository.create({
                user: user,
                cart_data: updateCartDto.cart_data,
            });
            const response = await this.cartRepository.save(c);
            if(response) {
                return { cart_data: updateCartDto.cart_data }
            }
            else {
                throw new InternalServerErrorException('Erro ao adicionar carrinho');
            }
        }
    
        Object.assign(cart, updateCartDto);
        const savedCart = await this.cartRepository.save(cart);
        return { cart_data: savedCart.cart_data };
      }
}
