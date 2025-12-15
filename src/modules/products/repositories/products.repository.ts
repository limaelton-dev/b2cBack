import { Inject, Injectable } from '@nestjs/common';
import { AnyMarketApiProvider, SkuMarketplaceRepository, SkuMarketplaceData } from '../../../shared/anymarket';
import { PaginationHelperService } from 'src/shared/anymarket/pagination/pagination-helper.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const DEFAULT_TTL_MS = 3600000; // 1hr em milissegundos (cache-manager v5 usa ms)

export function isSkuAvailable(sku: any): boolean {
  if (!sku) return false;
  const stock = sku.amount ?? sku.quantity ?? 0;
  return stock > 0;
}

export function isProductAvailable(product: any): boolean {
  if (!product?.isProductActive) return false;
  return product.skus?.some(isSkuAvailable) ?? false;
}

export function filterAvailableSkus(product: any): any {
  if (!product) return null;
  return {
    ...product,
    skus: product.skus?.filter(isSkuAvailable) ?? [],
  };
}

@Injectable()
export class ProductsRepository {
  private readonly endpoint = '/products';
  private readonly defaultLimit = 50;

  constructor(
    private readonly api: AnyMarketApiProvider,
    private readonly pager: PaginationHelperService,
    private readonly skuMarketplace: SkuMarketplaceRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  /**
   * Stream de produtos disponíveis (ativos + com estoque).
   * Já filtra produtos e SKUs indisponíveis na origem.
   * 
   * @future Adicionar cache Redis aqui
   */
  async *streamAvailable(): AsyncGenerator<any, void, void> {
    const cacheKey = 'products:available';
    const cached = await this.cacheManager.get<any[]>(cacheKey);
    if(Array.isArray(cached) && cached.length) {
      for (const product of cached) {
        yield product;
      }
      return;
    }

    const available: any[] = [];
    const url = `${this.endpoint}?offset=0&limit=${this.defaultLimit}`;
    
    for await (const product of this.pager.iterateItems<any>(url)) {
      if (!isProductAvailable(product)) continue;
      const filtered = filterAvailableSkus(product);
      available.push(filtered);
      yield filtered;
    }

    await this.cacheManager.set(cacheKey, available, DEFAULT_TTL_MS)
  }

  /**
   * Busca produto por ID (direto da API).
   * Retorna null se não encontrado ou inativo.
   * 
   * @future Adicionar cache Redis aqui
   */
  async findById(id: number): Promise<any | null> {
    const cacheKey = `products:${id}`;
    const cached = await this.cacheManager.get<any>(cacheKey);
    if(cached) {
      return cached;
    }

    try {
      const product = await this.api.get<any>(`${this.endpoint}/${id}`);
      if (!isProductAvailable(product)) return null;
      const filtered = filterAvailableSkus(product);
      await this.cacheManager.set(cacheKey, filtered, DEFAULT_TTL_MS);
      return filtered;
    } catch {
      return null;
    }
  }

  /**
   * Busca produtos que contêm SKUs específicos.
   * Otimizado: para de iterar quando encontra todos.
   */
  async findBySkuIds(skuIds: number[]): Promise<any[]> {
    const sorted = [...skuIds].sort((a, b) => a - b);
    const cacheKey = `products:skuIds:${sorted.join(',')}`;
    const cached = await this.cacheManager.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    if (!skuIds?.length) return [];

    const pending = new Set(skuIds);
    const results: any[] = [];

    for await (const product of this.streamAvailable()) {
      const matchingSkuIds = product.skus
        ?.filter((s: any) => pending.has(s.id))
        .map((s: any) => s.id) ?? [];
  
      if (matchingSkuIds.length > 0) {
        results.push(product);
        matchingSkuIds.forEach((id: number) => pending.delete(id));
        if (pending.size === 0) break;
      }
    }

    await this.cacheManager.set(cacheKey, results, DEFAULT_TTL_MS);
    return results;
  }

  async findBySkuIdsWithMarketplace(skuIds: number[]): Promise<any[]> {
    if (!skuIds?.length) return [];

    const products = await this.findBySkuIds(skuIds);
    return this.enrichProductsWithMarketplace(products);
  }

  async enrichProductsWithMarketplace(products: any[]): Promise<any[]> {
    if (!products?.length) return [];

    const allSkuIds = products.flatMap((p) => p.skus?.map((s: any) => s.id) ?? []);
    if (!allSkuIds.length) return [];

    const marketplaceMap = await this.skuMarketplace.findBySkuIds(allSkuIds);

    const enrichedProducts = products
      .map((product) => {
        const enrichedSkus = (product.skus ?? [])
          .map((sku: any) => {
            const mpData = marketplaceMap.get(sku.id);
            const baseStock = sku.amount ?? sku.quantity ?? 0;
            const effectiveStock = mpData?.stock > 0 ? mpData.stock : baseStock;

            if (!mpData || !mpData.isActive) return null;

            return {
              ...sku,
              marketplaceData: mpData,
              marketplacePartnerId: mpData.partnerId,
              originalPrice: mpData.originalPrice,
              finalPrice: mpData.finalPrice,
              hasDiscount: mpData.hasDiscount,
              marketplaceStock: effectiveStock,
            };
          })
          .filter(Boolean);

        if (enrichedSkus.length === 0) return null;

        return { ...product, skus: enrichedSkus };
      })
      .filter(Boolean);

    return enrichedProducts;
  }

  getSkuMarketplaceRepository(): SkuMarketplaceRepository {
    return this.skuMarketplace;
  }

  /**
   * Busca SKU específico por ID.
   * Retorna produto pai + SKU isolado.
   * 
   * @future Adicionar cache Redis aqui
   */
  async findSkuById(skuId: number): Promise<{ product: any; sku: any } | null> {
    const cacheKey = `sku:${skuId}`;
    const cached = await this.cacheManager.get<{ product: any; sku: any }>(cacheKey);
    if (cached) {
      return cached;
    }
  
    for await (const product of this.streamAvailable()) {
      const sku = product.skus?.find((s: any) => s.id === skuId);
      if (sku) {
        const result = { product, sku };
        await this.cacheManager.set(cacheKey, result, DEFAULT_TTL_MS);
        return result;
      }
    }
    return null;
  }
}
