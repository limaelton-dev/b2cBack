import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { Brand } from '../../category/entities/brand.entity';
import { Category } from '../../category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Converter DTO para formato compatível com o repository
    const productData = this.mapDtoToEntity(createProductDto);
    return this.productRepository.create(productData);
  }

  private mapDtoToEntity(dto: CreateProductDto): Partial<Product> {
    const result: any = { ...dto };
    
    // Transformar relações em objetos com apenas o ID
    if (dto.brand) {
      result.brand = { id: dto.brand.id };
    }
    
    if (dto.categoryLevel1) {
      result.categoryLevel1 = { id: dto.categoryLevel1.id };
    }
    
    if (dto.categoryLevel2) {
      result.categoryLevel2 = { id: dto.categoryLevel2.id };
    }
    
    if (dto.categoryLevel3) {
      result.categoryLevel3 = { id: dto.categoryLevel3.id };
    }
    
    return result;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return this.productRepository.findByIds(ids);
  }

  async search(query: string): Promise<Product[]> {
    return this.productRepository.search(query);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    await this.productRepository.remove(id);
  }
} 