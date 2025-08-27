import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { AnyMarketProduct } from '../interfaces/anymarket-product.interface';

type FetchProductsParams = { offset: number; limit: number; categoryId?: string };

@Injectable()
export class ProductsRepository {
  private readonly baseUrl = process.env.ANYMARKET_BASE_URL?.replace(/\/$/, '') || 'https://api.anymarket.com.br';
  private readonly apiPrefix = '/v2';

  constructor(private readonly http: HttpService) {}

  async fetchProducts(params: FetchProductsParams): Promise<{
    items: AnyMarketProduct[];
    offset: number;
    limit: number;
    next?: string;
    total?: number;
    raw: any;
  }> {
    try {
      const url = `${this.baseUrl}${this.apiPrefix}/products`;
      const searchParams = new URLSearchParams();
      searchParams.set('offset', String(params.offset));
      searchParams.set('limit', String(params.limit));

      // Alguns tenants suportam filtro por categoria via querystring.
      // Caso sua conta não suporte, faça o filtro no seu lado ou use mapeamento de SKUs/categorias.
      if (params.categoryId) {
        searchParams.set('categoryId', params.categoryId);
      }

      const { data } = await firstValueFrom(
        this.http.get(`${url}?${searchParams.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
            gumgaToken: process.env.ANYMARKET_GUMGA_TOKEN as string,
            platform: process.env.ANYMARKET_PLATFORM as string,
          },
        }),
      );

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
    } catch (err) {
      const e = err as AxiosError;
      throw new InternalServerErrorException({
        message: 'Failed to fetch products from AnyMarket',
        details: e.response?.data ?? e.message,
      });
    }
  }
}