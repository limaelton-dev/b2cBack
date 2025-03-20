import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscountsRepository } from '../repositories/discounts.repository';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { Discount } from '../entities/discount.entity';

@Injectable()
export class DiscountsService {
  constructor(
    private readonly discountsRepository: DiscountsRepository,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    return this.discountsRepository.create({
      ...createDiscountDto,
      usageCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(): Promise<Discount[]> {
    return this.discountsRepository.findAll();
  }

  async findOne(id: number): Promise<Discount> {
    const discount = await this.discountsRepository.findOne(id);
    
    if (!discount) {
      throw new NotFoundException(`Desconto com ID ${id} não encontrado`);
    }
    
    return discount;
  }

  async findByCode(code: string): Promise<Discount> {
    const discount = await this.discountsRepository.findByCode(code);
    
    if (!discount) {
      throw new NotFoundException(`Desconto com código ${code} não encontrado`);
    }
    
    return discount;
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
    // Verificar se o desconto existe
    await this.findOne(id);
    
    return this.discountsRepository.update(id, {
      ...updateDiscountDto,
      updatedAt: new Date(),
    });
  }

  async incrementUsage(id: number): Promise<Discount> {
    const discount = await this.findOne(id);
    
    return this.discountsRepository.update(id, {
      usageCount: discount.usageCount + 1,
      updatedAt: new Date(),
    });
  }

  async deactivate(id: number): Promise<Discount> {
    // Verificar se o desconto existe
    await this.findOne(id);
    
    return this.discountsRepository.update(id, {
      isActive: false,
      updatedAt: new Date(),
    });
  }

  async remove(id: number): Promise<void> {
    // Verificar se o desconto existe
    await this.findOne(id);
    
    await this.discountsRepository.remove(id);
  }
} 