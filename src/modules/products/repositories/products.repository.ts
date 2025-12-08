import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AnyMarketProduct } from '../interfaces/anymarket-product.interface';
import { AnyMarketApiProvider } from '../../../shared/anymarket';
import { normalizePagination } from 'src/shared/anymarket/util/util';
import { PaginationHelperService } from 'src/shared/anymarket/pagination/pagination-helper.service';

type FetchProductsParams = { offset: number; limit: number; categoryId?: string };

type PageParams = { page?: number; size?: number; offset?: number; limit?: number }

@Injectable()
export class ProductsRepository {
  private readonly default: {
    endpoint: string;
    offset: number;
    limit: number;
  } = {
    endpoint: '/products',
    offset: 0,
    limit: 50,
  };
  constructor(
    private readonly anyMarketApi: AnyMarketApiProvider,
    private readonly pager: PaginationHelperService
  ) {}

  async *findAllStream(): AsyncGenerator<any, void, void> {
    const start = `${this.default.endpoint}?offset=${this.default.offset}&limit=${this.default.limit}&active=true`;
    for await(const item of this.pager.iterateItems<any>(start)) yield item
  }

  async findAllAggregated(maxItems?: number): Promise<any[]> {
    const start = `${this.default.endpoint}?offset=${this.default.offset}&limit=${this.default.limit}`;
    return this.pager.fetchAllItems<any>(start, maxItems);
  }

  async findOne(id: number): Promise<any> {
    try {
      const endpoint = `${this.default.endpoint}/${id}`;
      return this.anyMarketApi.get<any>(endpoint);
    } catch (error) {
      return null;
    }
  }

  async findByIds(ids: number[]): Promise<any[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    try {
      const promises = ids.map(id => this.findOne(id));
      const results = await Promise.allSettled(promises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<any> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to fetch products by IDs from AnyMarket',
        details: error.message || 'Erro desconhecido',
      });
    }
  }

  async findBySkuId(id: number, skuId: number): Promise<any> {
    const endpoint = `${this.default.endpoint}/${id}/skus/${skuId}`;
    return this.anyMarketApi.get<any>(endpoint);
  }
}