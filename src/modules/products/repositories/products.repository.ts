import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AnyMarketProduct } from '../interfaces/anymarket-product.interface';
import { AnyMarketApiProvider } from '../../../shared/anymarket';

type FetchProductsParams = { offset: number; limit: number; categoryId?: string };

@Injectable()
export class ProductsRepository {
  constructor(private readonly anyMarketApi: AnyMarketApiProvider) {}

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

      const endpoint = `/products?${searchParams.toString()}`;
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
}