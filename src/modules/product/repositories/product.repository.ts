import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { ProductFilterDto } from '../dto/product-filter.dto';

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

  async findAll(paginationDto: PaginationDto) {
  const { page = 1, limit = 10, s } = paginationDto;
  const skip = (page - 1) * limit;

  const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.discountProduct', 'discountProduct')
      .leftJoinAndSelect('product.images', 'images');

    // Se veio `s`, adiciona o WHERE
    if (s) {
      query.where('product.name ILIKE :search', { search: `%${s}%` });
    }

    // Paginação
    query.skip(skip).take(limit);

    const [products, total] = await query.getManyAndCount();

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
  
  async findByFilters(filterDto: ProductFilterDto) {
    const { 
      page = 1, 
      limit = 12,
      categoryId,
      categorySlug,
      categoryName,
      brandId,
      brandSlug,
      brandName,
      s,
      sortBy = 'id',
      sortDirection = 'ASC'
    } = filterDto;
    
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.discountProduct', 'discountProduct')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.categoryLevel1', 'categoryLevel1')
      .leftJoinAndSelect('product.categoryLevel2', 'categoryLevel2')
      .leftJoinAndSelect('product.categoryLevel3', 'categoryLevel3');
      
    // Filtro por categoria
    if (categoryId) {
      queryBuilder.andWhere(
        '(product.categoryLevel1Id = :categoryId OR product.categoryLevel2Id = :categoryId OR product.categoryLevel3Id = :categoryId)',
        { categoryId }
      );
    }
    
    if (categorySlug) {
      queryBuilder.andWhere(
        '(categoryLevel1.slug = :categorySlug OR categoryLevel2.slug = :categorySlug OR categoryLevel3.slug = :categorySlug)',
        { categorySlug }
      );
    }
    
    if (categoryName) {
      queryBuilder.andWhere(
        '(LOWER(categoryLevel1.name) LIKE LOWER(:categoryName) OR LOWER(categoryLevel2.name) LIKE LOWER(:categoryName) OR LOWER(categoryLevel3.name) LIKE LOWER(:categoryName))',
        { categoryName: `%${categoryName}%` }
      );
    }
    
    // Filtro por marca
    if (brandId) {
      queryBuilder.andWhere('product.brandId = :brandId', { brandId });
    }
    
    if (brandSlug) {
      queryBuilder.andWhere('brand.slug = :brandSlug', { brandSlug });
    }
    
    if (brandName) {
      queryBuilder.andWhere('LOWER(brand.name) LIKE LOWER(:brandName)', { brandName: `%${brandName}%` });
    }
    
    // Filtro por nome do produto
    if (s) {
      queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:productName)', { productName: `%${s}%` });
    }
    
    // Adicionar ordenação
    queryBuilder.orderBy(`product.${sortBy}`, sortDirection);
    
    // Paginação
    queryBuilder.skip(skip);
    queryBuilder.take(limit);
    
    const [products, total] = await queryBuilder.getManyAndCount();
    
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
      relations: ['images', 'discountProduct'],
    });
  }

  async search(query: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('LOWER(product.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(product.description) LIKE LOWER(:query)', { query: `%${query}%` })
      .leftJoinAndSelect('product.images', 'images')
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