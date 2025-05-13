import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [products, total] = await this.productRepository.findAndCount({
      relations: ['discountProduct', 'images'],
      skip,
      take: limit,
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  async find(ids: string | number) {
    if (typeof ids === 'number' || (!ids.includes(',') && !isNaN(Number(ids)))) {
      const product = await this.productRepository.find({
        where: { id: Number(ids) },
        relations: ['categoryLevel1', 'categoryLevel2', 'images', 'brand'],
      });
      return product;
    } else {
      if(ids.includes(',')) {
        const prods = ids.split(',').map(Number);
        return await this.productRepository.find({
            where: {id: In(prods)},
            relations: ['categoryLevel1', 'categoryLevel2', 'images']
        });
      }
      else {
        const product = await this.productRepository.find({
            where: { slug: ids },
            relations: ['categoryLevel1', 'categoryLevel2', 'images', 'brand'],
        });
        return product;
      }
    }
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['orderItems', 'discountProduct', 'categoryLevel1', 'brand', 'images'],
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
      console.log('[UPSERT] Atualizando produto existente com ID:', existing.id);
      console.log('[UPSERT] Dados atualizados:', data);
    } else {
      console.log('[UPSERT] Criando novo produto com dados:', data);
    }

    const newProduct = this.productRepository.create(data);
    console.log('[UPSERT] Salvando entidade:', newProduct);
    return this.productRepository.save(newProduct);
  }

  /**
   * Retorna o repositório interno do TypeORM para operações especiais
   * @returns O repositório TypeORM
   */
  getRepository(): Repository<Product> {
    return this.productRepository;
  }
} 