import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) {}

  async findOneByProfileId(profileId: number): Promise<Cart | null> {
    return this.repository.findOne({
      where: { profileId },
      relations: ['items', 'items.product'],
    });
  }

  async save(cart: Cart): Promise<Cart> {
    return this.repository.save(cart);
  }

  async create(data: Partial<Cart>): Promise<Cart> {
    const cart = this.repository.create(data);
    return this.repository.save(cart);
  }
} 