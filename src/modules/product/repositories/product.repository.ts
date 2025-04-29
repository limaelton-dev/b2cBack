import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['orderItems', 'discountProduct'],
    });
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['orderItems', 'discountProduct'],
    });
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return this.productRepository.find({
      where: { id: In(ids) },
      relations: ['orderItems', 'discountProduct'],
    });
  }

  async search(query: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('LOWER(product.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(product.description) LIKE LOWER(:query)', { query: `%${query}%` })
      .leftJoinAndSelect('product.orderItems', 'orderItems')
      .leftJoinAndSelect('product.discountProduct', 'discountProduct')
      .getMany();
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, productData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async upsert(data: CreateProductDto): Promise<Product> {
    const existing = await this.productRepository.findOne({
      where: { reference: data.reference }
    });

    if (existing) {
      Object.assign(existing, data);
      return this.productRepository.save(existing);
    }

    const newProduct = this.productRepository.create(data);
    return this.productRepository.save(newProduct);
  }
} 