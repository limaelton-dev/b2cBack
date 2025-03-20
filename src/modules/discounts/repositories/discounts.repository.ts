import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Discount } from '../entities/discount.entity';
import { DiscountProduct } from '../entities/discount-product.entity';
import { DiscountScope } from '../../../common/enums/discount-scope.enum';

@Injectable()
export class DiscountsRepository {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    
    @InjectRepository(DiscountProduct)
    private readonly discountProductRepository: Repository<DiscountProduct>,
  ) {}

  async create(discountData: Partial<Discount>): Promise<Discount> {
    const discount = this.discountRepository.create(discountData);
    return this.discountRepository.save(discount);
  }

  async createDiscountProduct(discountProductData: Partial<DiscountProduct>): Promise<DiscountProduct> {
    const discountProduct = this.discountProductRepository.create(discountProductData);
    return this.discountProductRepository.save(discountProduct);
  }

  async findAll(): Promise<Discount[]> {
    return this.discountRepository.find({
      relations: ['discountProducts', 'discountProducts.product', 'orders', 'orderItems'],
    });
  }

  async findOne(id: number): Promise<Discount> {
    return this.discountRepository.findOne({
      where: { id },
      relations: ['discountProducts', 'discountProducts.product', 'orders', 'orderItems'],
    });
  }

  async findByCode(code: string): Promise<Discount> {
    return this.discountRepository.findOne({
      where: { code },
      relations: ['discountProducts', 'discountProducts.product', 'orders', 'orderItems'],
    });
  }

  async findActiveDiscounts(): Promise<Discount[]> {
    const now = new Date();
    
    return this.discountRepository.find({
      where: {
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      relations: ['discountProducts', 'discountProducts.product', 'orders', 'orderItems'],
    });
  }

  async findActiveProductDiscounts(productId: number): Promise<Discount[]> {
    const now = new Date();
    
    const discountProducts = await this.discountProductRepository.find({
      where: { productId },
      relations: ['discount'],
    });
    
    const discountIds = discountProducts.map(dp => dp.discountId);
    
    if (discountIds.length === 0) {
      return [];
    }
    
    return this.discountRepository.find({
      where: {
        id: In(discountIds),
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
        scope: DiscountScope.PRODUCT,
      },
      relations: ['discountProducts', 'discountProducts.product'],
    });
  }

  async update(id: number, discountData: Partial<Discount>): Promise<Discount> {
    await this.discountRepository.update(id, discountData);
    return this.findOne(id);
  }

  async removeDiscountProduct(id: number): Promise<void> {
    await this.discountProductRepository.delete(id);
  }

  async removeDiscountProductsByDiscountId(discountId: number): Promise<void> {
    await this.discountProductRepository.delete({ discountId });
  }

  async remove(id: number): Promise<void> {
    // Primeiro remover as associações com produtos
    await this.removeDiscountProductsByDiscountId(id);
    // Depois remover o desconto
    await this.discountRepository.delete(id);
  }
} 