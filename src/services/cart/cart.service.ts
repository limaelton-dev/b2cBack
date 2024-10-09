import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/models/cart/cart';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
    ) {}

    async getCarrinhoUser(id: number): Promise<Cart> {
        return await this.cartRepository.findOne({ where: { user: { id: id } } });
    }
}
