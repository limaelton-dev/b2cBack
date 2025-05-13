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

  async findOne(id: number): Promise<Cart | null> {
    console.log('CartRepository.findOne:', { id });
    return this.repository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
  }

  async findOneByProfileId(profileId: number): Promise<Cart | null> {
    console.log('CartRepository.findOneByProfileId:', { profileId });
    return this.repository.findOne({
      where: { profileId },
      relations: ['items', 'items.product'],
    });
  }

  async save(cart: Cart): Promise<Cart> {
    console.log('CartRepository.save:', { cartId: cart.id, profileId: cart.profileId });
    return this.repository.save(cart);
  }

  async create(data: Partial<Cart>): Promise<Cart> {
    console.log('CartRepository.create:', data);
    const cart = this.repository.create(data);
    try {
      const savedCart = await this.repository.save(cart);
      console.log('CartRepository.create - success:', { cartId: savedCart.id, profileId: savedCart.profileId });
      return savedCart;
    } catch (error) {
      console.error('CartRepository.create - error:', { 
        error: error.message,
        code: error.code,
        detail: error.detail,
        data 
      });
      throw error;
    }
  }
} 