import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscountRepository } from '../repositories/discount.repository';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { Discount } from '../entities/discount.entity';

@Injectable()
export class DiscountService {
  constructor(
    private readonly discountRepository: DiscountRepository,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    return this.discountRepository.create({
      ...createDiscountDto,
      usageCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(): Promise<Discount[]> {
    return this.discountRepository.findAll();
  }

  async findOne(id: number): Promise<Discount> {
    const discount = await this.discountRepository.findOne(id);
    
    if (!discount) {
      throw new NotFoundException(`Desconto com ID ${id} não encontrado`);
    }
    
    return discount;
  }

  async findByCode(code: string): Promise<Discount> {
    const discount = await this.discountRepository.findByCode(code);
    
    if (!discount) {
      throw new NotFoundException(`Desconto com código ${code} não encontrado`);
    }
    
    return discount;
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
    // Verificar se o desconto existe
    await this.findOne(id);
    
    return this.discountRepository.update(id, {
      ...updateDiscountDto,
      updatedAt: new Date(),
    });
  }

  async incrementUsage(id: number): Promise<Discount> {
    const discount = await this.findOne(id);
    
    return this.discountRepository.update(id, {
      usageCount: discount.usageCount + 1,
      updatedAt: new Date(),
    });
  }

  async deactivate(id: number): Promise<Discount> {
    // Verificar se o desconto existe
    await this.findOne(id);
    
    return this.discountRepository.update(id, {
      isActive: false,
      updatedAt: new Date(),
    });
  }

  async remove(id: number): Promise<void> {
    // Verificar se o desconto existe
    await this.findOne(id);
    
    await this.discountRepository.remove(id);
  }
} 