import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productsRepository.create(createProductDto);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.findAll();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return this.productsRepository.findByIds(ids);
  }

  async search(query: string): Promise<Product[]> {
    return this.productsRepository.search(query);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return this.productsRepository.update(id, updateProductDto);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    await this.productsRepository.remove(id);
  }
} 