import { Injectable } from '@nestjs/common';
import { AnyMarketApiProvider, SkuMarketplaceRepository, SkuMarketplaceData } from '../../../shared/anymarket';
import { PaginationHelperService } from 'src/shared/anymarket/pagination/pagination-helper.service';

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
  ) {}

  /**
   * Stream de produtos disponíveis (ativos + com estoque).
   * Já filtra produtos e SKUs indisponíveis na origem.
   * 
   * @future Adicionar cache Redis aqui
   */
  async *streamAvailable(): AsyncGenerator<any, void, void> {
    const url = `${this.endpoint}?offset=0&limit=${this.defaultLimit}`;
    
    for await (const product of this.pager.iterateItems<any>(url)) {
      if (!isProductAvailable(product)) continue;
      yield filterAvailableSkus(product);
    }
  }

  /**
   * Busca produto por ID (direto da API).
   * Retorna null se não encontrado ou inativo.
   * 
   * @future Adicionar cache Redis aqui
   */
  async findById(id: number): Promise<any | null> {
    try {
      const product = await this.api.get<any>(`${this.endpoint}/${id}`);
      if (!isProductAvailable(product)) return null;
      return filterAvailableSkus(product);
    } catch {
      return null;
    }
  }

  /**
   * Busca produtos que contêm SKUs específicos.
   * Otimizado: para de iterar quando encontra todos.
   * 
   * @future Adicionar cache Redis aqui
   */
  async findBySkuIds(skuIds: number[]): Promise<any[]> {
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

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/dbd08ada-682b-46fd-85fa-ae2fab5ba5bf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'products.repository.ts:enrichProductsWithMarketplace',message:'marketplace map',data:{totalSkuIds:allSkuIds.length,foundInMarketplace:marketplaceMap.size,sampleData:allSkuIds.slice(0,3).map(id=>({skuId:id,found:marketplaceMap.has(id),data:marketplaceMap.get(id)}))},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix-v2',hypothesisId:'H1,H4'})}).catch(()=>{});
    // #endregion

    const enrichedProducts = products
      .map((product) => {
        const enrichedSkus = (product.skus ?? [])
          .map((sku: any) => {
            const mpData = marketplaceMap.get(sku.id);
            const baseStock = sku.amount ?? sku.quantity ?? 0;
            const effectiveStock = mpData?.stock > 0 ? mpData.stock : baseStock;

            // #region agent log
            if (!mpData || !mpData.isActive) {
              fetch('http://127.0.0.1:7243/ingest/dbd08ada-682b-46fd-85fa-ae2fab5ba5bf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'products.repository.ts:enrichProductsWithMarketplace',message:'SKU filtered out',data:{skuId:sku.id,reason:!mpData?'NO_MARKETPLACE_DATA':'NOT_ACTIVE',mpData,baseStock},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix-v2',hypothesisId:'H2,H3,H4'})}).catch(()=>{});
            }
            // #endregion

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

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/dbd08ada-682b-46fd-85fa-ae2fab5ba5bf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'products.repository.ts:enrichProductsWithMarketplace',message:'enrichment result',data:{inputProducts:products.length,outputProducts:enrichedProducts.length,sampleEnriched:enrichedProducts.slice(0,2).map(p=>({id:p.id,skus:p.skus?.map((s:any)=>({id:s.id,stock:s.marketplaceStock,price:s.finalPrice}))}))},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix-v2',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion

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
    for await (const product of this.streamAvailable()) {
      const sku = product.skus?.find((s: any) => s.id === skuId);
      if (sku) {
        return { product, sku };
      }
    }
    return null;
  }
}
