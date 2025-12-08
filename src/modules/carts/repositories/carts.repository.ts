import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { CartItemDto } from '../dto/cart-item.dto';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
  ) {}

  async findWithItems(id: number): Promise<Cart | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async findByProfileId(profileId: number): Promise<Cart | null> {
    return this.repository.findOne({
      where: { profileId },
      relations: ['items'],
    });
  }

  async upsertWithItems(
    profileId: number,
    items: CartItemDto[],
  ): Promise<Cart> {
    return this.repository.manager.transaction(async manager => {
      const cartsRepository = manager.getRepository(Cart);
      const cartItemsRepository = manager.getRepository(CartItem);

      let cart = await cartsRepository.findOne({
        where: { profileId },
      });

      const itemEntities = items.map(item => cartItemsRepository.create(item));

      if (!cart) {
        cart = cartsRepository.create({
          profileId,
          items: itemEntities,
        });

        return cartsRepository.save(cart);
      }

      await manager
        .createQueryBuilder()
        .delete()
        .from(CartItem)
        .where('cart_id = :cartId', { cartId: cart.id })
        .execute();

      cart.items = itemEntities;

      return cartsRepository.save(cart);
    });
  }

  async create(profileId: number): Promise<Cart> {
    const cart = this.repository.create({
      profileId,
      items: [],
    });

    return this.repository.save(cart);
  }

  async save(cart: Cart): Promise<Cart> {
    return this.repository.save(cart);
  }

  async createItem(input: CartItemDto): Promise<CartItem> {
    return this.cartItemsRepository.create(input);
  }

  async removeItem(cartId: number, itemId: number): Promise<void> {
    await this.repository.manager
      .createQueryBuilder()
      .delete()
      .from(CartItem)
      .where('id = :itemId AND cart_id = :cartId', { itemId, cartId })
      .execute();
  }

  async clearItems(cartId: number): Promise<void> {
    await this.repository.manager
      .createQueryBuilder()
      .delete()
      .from(CartItem)
      .where('cart_id = :cartId', { cartId })
      .execute();
  }
}
