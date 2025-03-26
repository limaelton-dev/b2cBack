import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Discount } from '../entities/discount.entity';
import { DiscountProduct } from '../entities/discount-product.entity';
import { DiscountScope } from '../../../common/enums/discount-scope.enum';

@Injectable()
export class DiscountRepository {
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
      relations: ['discountProduct', 'discountProduct.product', 'order', 'orderItems'],
    });
  }

  async findOne(id: number): Promise<Discount> {
    return this.discountRepository.findOne({
      where: { id },
      relations: ['discountProduct', 'discountProduct.product', 'order', 'orderItems'],
    });
  }

  async findByCode(code: string): Promise<Discount> {
    return this.discountRepository.findOne({
      where: { code },
      relations: ['discountProduct', 'discountProduct.product', 'order', 'orderItems'],
    });
  }

  async findActiveDiscount(): Promise<Discount[]> {
    const now = new Date();
    
    return this.discountRepository.find({
      where: {
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      relations: ['discountProduct', 'discountProduct.product', 'order', 'orderItems'],
    });
  }

  async findActiveProductDiscount(productId: number): Promise<Discount[]> {
    const now = new Date();
    
    const discountProduct = await this.discountProductRepository.find({
      where: { productId },
      relations: ['discount'],
    });
    
    const discountIds = discountProduct.map(dp => dp.discountId);
    
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
      relations: ['discountProduct', 'discountProduct.product'],
    });
  }

  async update(id: number, discountData: Partial<Discount>): Promise<Discount> {
    await this.discountRepository.update(id, discountData);
    return this.findOne(id);
  }

  async removeDiscountProduct(id: number): Promise<void> {
    await this.discountProductRepository.delete(id);
  }

  async removeDiscountProductByDiscountId(discountId: number): Promise<void> {
    await this.discountProductRepository.delete({ discountId });
  }

  async remove(id: number): Promise<void> {
    // Primeiro remover as associações com produtos
    await this.removeDiscountProductByDiscountId(id);
    // Depois remover o desconto
    await this.discountRepository.delete(id);
  }
} 