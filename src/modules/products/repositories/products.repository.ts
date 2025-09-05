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

  async findAll(params: FetchProductsParams): Promise<{
    items: AnyMarketProduct[];
    offset: number;
    limit: number;
    next?: string;
    total?: number;
    raw: any;
  }> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.set('offset', String(params.offset));
      searchParams.set('limit', String(params.limit));

      // Alguns tenants suportam filtro por categoria via querystring.
      // Caso sua conta não suporte, faça o filtro no seu lado ou use mapeamento de SKUs/categorias.
      if (params.categoryId) {
        searchParams.set('categoryId', params.categoryId);
      }

      const endpoint = `${this.default.endpoint}?${searchParams.toString()}`;
      const data = await this.anyMarketApi.get(endpoint);

      // Estruturas podem variar (alguns retornam content/links; outros retornam items + paginação).
      const items: AnyMarketProduct[] =
        data?.content ?? data?.items ?? data?.products ?? data ?? [];

      const next =
        data?.links?.find?.((l: any) => l?.rel === 'next')?.href ??
        data?.next ??
        undefined;

      const total = data?.page?.totalElements ?? data?.total ?? undefined;

      return {
        items,
        offset: params.offset,
        limit: params.limit,
        next,
        total,
        raw: data,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to fetch products from AnyMarket',
        details: error.message || 'Erro desconhecido',
      });
    }
  }

  async findPage(params?: PageParams) {
    const { offset, limit } = normalizePagination({
      page: params?.page,
      size: params?.size,
      rawOffset: params?.offset,
      rawLimit: params?.limit,
    });

    const endpointWithParams = `${this.default.endpoint}?offset=${offset}&limit=${limit}`;

    const [firstPage] = await this.pager.fetchAllItems(endpointWithParams, 0);
    return firstPage;
  }

  async *findAllStream(): AsyncGenerator<any, void, void> {
    const start = `${this.default.endpoint}?offset=${this.default.offset}&limit=${this.default.limit}&active=true`;
    for await(const item of this.pager.iterateItems<any>(start)) yield item
  }

  async findAllAggregated(maxItems?: number): Promise<any[]> {
    const start = `${this.default.endpoint}?offset=${this.default.offset}&limit=${this.default.limit}`;
    return this.pager.fetchAllItems<any>(start, maxItems);
  }

  async findPage2(offset: number, limit: number) {
    const endpoint = `${this.default.endpoint}?offset=${offset}&limit=${limit}&active=true`;
    return this.anyMarketApi.get<any>(endpoint);
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
}