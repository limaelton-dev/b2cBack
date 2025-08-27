import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { ListProductsQueryDto } from '../dto/list-products.query.dto';
import { ListProductsByCategoryQueryDto } from '../dto/list-products-by-category.query.dto';

interface OffsetLimit {
  offset: number;
  limit: number;
}

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}



  async findAll(query: ListProductsQueryDto) {
    const { offset, limit } = this.toOffsetLimit(query.page, query.size, query.offset, query.limit);
    return this.productsRepository.fetchProducts({offset, limit})
  }

  async findByCategory(categoryId: string, query: ListProductsByCategoryQueryDto) {
    const { offset, limit } = this.toOffsetLimit(query.page, query.size, query.offset, query.limit);
    return this.productsRepository.fetchProducts({ offset, limit, categoryId });
  }

  async find(ids: string | number) {
  }

  async findOne(id: number){
  }

  async findByIds(ids: number[]) {
  }

  async search(query: string) {
  }

  async update(id: number, updateProductDto) {
  }

  async getProdutosFabricanteLimit(limit: number) {
  }

  async remove(id: number): Promise<void> {

  }

  private toOffsetLimit(
    page?: number,
    size?: number,
    rawOffset?: number,
    rawLimit?: number,
  ): OffsetLimit {
    if(typeof page === 'number' && typeof size === 'number') {
      return {
        offset: rawOffset ?? 0, limit: rawLimit ?? 50 }
    }
    if(typeof page === 'number' && typeof size === 'number') {
      const safePage = Math.max(page, 0);
      const safeSize = Math.min(Math.max(size, 1), 200);
      return {
        offset: safePage * safeSize,
        limit: safeSize
      }
    }
    return {
      offset: rawOffset ?? 0,
      limit: rawLimit ?? 50
    }
  }
}