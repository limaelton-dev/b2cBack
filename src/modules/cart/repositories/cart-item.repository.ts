import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CartItemRepository {
  constructor(
    @InjectRepository(CartItem)
    private readonly repository: Repository<CartItem>,
  ) {}

  async verifyProduct(productsId: Array<number>, cartId: number): Promise<CartItem | null> {
    return this.repository.findOne({
      where: [{ cartId: cartId },{ productId: In(productsId)}],
      relations: ['items', 'items.product'],
    });
  }

  async findOne(id: number): Promise<CartItem | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async findByCartId(cartId: number): Promise<CartItem[]> {
    return this.repository.find({
      where: { cartId },
      relations: ['product'],
    });
  }

  async save(cartItem: CartItem): Promise<CartItem> {
    return this.repository.save(cartItem);
  }

  async create(data: Partial<CartItem>): Promise<CartItem> {
    const cartItem = this.repository.create(data);
    return this.repository.save(cartItem);
  }

  async remove(cartItem: CartItem): Promise<void> {
    await this.repository.remove(cartItem);
  }

  async deleteByCartId(cartId: number): Promise<void> {
    await this.repository.delete({ cartId });
  }
} 