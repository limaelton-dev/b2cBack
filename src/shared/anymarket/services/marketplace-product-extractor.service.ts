import { Injectable, Logger } from '@nestjs/common';
import { AnyMarketApiProvider } from '../any-market-api.provider';
import { AnyMarketConfigService } from '../config/any-market.config.service';
import { PaginationHelperService } from '../pagination/pagination-helper.service';
import { isListingActive, SkuMarketplaceListing } from '../interfaces/sku-marketplace.interface';

interface ProductWithMarketplaceData {
  id: number;
  title: string;
  isProductActive: boolean;
  brand?: { id: number; name: string; reducedName?: string; partnerId?: string };
  category?: { id: number; name: string; path: string; partnerId?: string };
  skus?: Array<{ id: number; amount?: number; quantity?: number }>;
}

export interface ExtractedBrand {
  id: number;
  name: string;
  reducedName?: string;
  partnerId?: string;
}

export interface ExtractedCategory {
  id: number;
  name: string;
  path: string;
  partnerId?: string;
  children?: ExtractedCategory[];
}

const CONCURRENCY_LIMIT = 5;
const PRODUCTS_LIMIT = 50;

@Injectable()
export class MarketplaceProductExtractorService {
  private readonly logger = new Logger(MarketplaceProductExtractorService.name);

  constructor(
    private readonly api: AnyMarketApiProvider,
    private readonly config: AnyMarketConfigService,
    private readonly pager: PaginationHelperService,
  ) {}

  async extractBrands(): Promise<ExtractedBrand[]> {
    const brandsMap = new Map<number, ExtractedBrand>();

    for await (const product of this.streamMarketplaceProducts()) {
      if (!product.brand?.id) continue;
      
      if (!brandsMap.has(product.brand.id)) {
        brandsMap.set(product.brand.id, {
          id: product.brand.id,
          name: product.brand.name,
          reducedName: product.brand.reducedName,
          partnerId: product.brand.partnerId,
        });
      }
    }

    return Array.from(brandsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async extractCategories(): Promise<ExtractedCategory[]> {
    const categoriesMap = new Map<string, { id: number; name: string; path: string; partnerId?: string }>();

    for await (const product of this.streamMarketplaceProducts()) {
      if (!product.category?.path) continue;

      const path = product.category.path;
      
      const existing = categoriesMap.get(path);
      if (!existing) {
        categoriesMap.set(path, {
          id: product.category.id,
          name: product.category.name,
          path: product.category.path,
          partnerId: product.category.partnerId,
        });
      } else if (existing.id === 0 && product.category.id) {
        categoriesMap.set(path, {
          id: product.category.id,
          name: product.category.name,
          path: product.category.path,
          partnerId: product.category.partnerId,
        });
      }

      this.extractParentPaths(path).forEach(parentPath => {
        if (!categoriesMap.has(parentPath)) {
          const parts = parentPath.split('/');
          categoriesMap.set(parentPath, {
            id: 0,
            name: parts[parts.length - 1],
            path: parentPath,
          });
        }
      });
    }

    await this.fillMissingCategoryIds(categoriesMap);

    return this.buildCategoryTree(Array.from(categoriesMap.values()));
  }

  private async fillMissingCategoryIds(
    categoriesMap: Map<string, { id: number; name: string; path: string; partnerId?: string }>,
  ): Promise<void> {
    const missingIds = Array.from(categoriesMap.entries()).filter(([, v]) => v.id === 0);
    if (!missingIds.length) return;

    try {
      const allCategories = await this.api.get<any[]>('/categories/fullPath');
      const pathToIdMap = this.buildPathToIdMap(allCategories);

      for (const [path, category] of missingIds) {
        const apiCategory = pathToIdMap.get(path);
        if (apiCategory) {
          categoriesMap.set(path, {
            ...category,
            id: apiCategory.id,
            partnerId: apiCategory.partnerId,
          });
        }
      }
    } catch {
      this.logger.warn('Could not fetch category IDs from API, some categories will have id: 0');
    }
  }

  private buildPathToIdMap(categories: any[], map = new Map<string, { id: number; partnerId?: string }>()): Map<string, { id: number; partnerId?: string }> {
    for (const cat of categories) {
      if (cat.path) {
        map.set(cat.path, { id: cat.id, partnerId: cat.partnerId });
      }
      if (cat.children?.length) {
        this.buildPathToIdMap(cat.children, map);
      }
    }
    return map;
  }

  private async *streamMarketplaceProducts(): AsyncGenerator<ProductWithMarketplaceData, void, void> {
    const marketplace = this.config.getMarketplaceName();
    const skuCache = new Map<number, boolean>();

    for await (const product of this.pager.iterateItems<ProductWithMarketplaceData>(
      `/products?offset=0&limit=${PRODUCTS_LIMIT}`,
    )) {
      if (!product.isProductActive) continue;

      const skuIds = product.skus?.filter(s => (s.amount ?? s.quantity ?? 0) > 0).map(s => s.id) ?? [];
      if (!skuIds.length) continue;

      const hasActiveInMarketplace = await this.hasActiveSkuInMarketplace(skuIds, marketplace, skuCache);
      if (hasActiveInMarketplace) {
        yield product;
      }
    }
  }

  private async hasActiveSkuInMarketplace(
    skuIds: number[],
    marketplace: string,
    cache: Map<number, boolean>,
  ): Promise<boolean> {
    const uncached = skuIds.filter(id => !cache.has(id));

    if (uncached.length > 0) {
      const batches = this.chunkArray(uncached, CONCURRENCY_LIMIT);
      
      for (const batch of batches) {
        await Promise.all(
          batch.map(async (skuId) => {
            const isActive = await this.checkSkuMarketplace(skuId, marketplace);
            cache.set(skuId, isActive);
          }),
        );
      }
    }

    return skuIds.some(id => cache.get(id) === true);
  }

  private async checkSkuMarketplace(skuId: number, marketplace: string): Promise<boolean> {
    try {
      const listings = await this.api.get<SkuMarketplaceListing[]>(`/skus/${skuId}/marketplaces`);
      if (!listings?.length) return false;

      return listings.some(l => l.marketPlace === marketplace && isListingActive(l));
    } catch {
      return false;
    }
  }

  private extractParentPaths(path: string): string[] {
    const parts = path.split('/');
    const paths: string[] = [];
    
    for (let i = 1; i < parts.length; i++) {
      paths.push(parts.slice(0, i).join('/'));
    }
    
    return paths;
  }

  private buildCategoryTree(categories: Array<{ id: number; name: string; path: string; partnerId?: string }>): ExtractedCategory[] {
    const pathMap = new Map<string, ExtractedCategory>();
    
    categories.forEach(cat => {
      pathMap.set(cat.path, { ...cat, children: [] });
    });

    const roots: ExtractedCategory[] = [];

    const sortedPaths = Array.from(pathMap.keys()).sort((a, b) => {
      const depthA = a.split('/').length;
      const depthB = b.split('/').length;
      return depthA - depthB || a.localeCompare(b);
    });

    for (const path of sortedPaths) {
      const category = pathMap.get(path)!;
      const parts = path.split('/');
      
      if (parts.length === 1) {
        roots.push(category);
      } else {
        const parentPath = parts.slice(0, -1).join('/');
        const parent = pathMap.get(parentPath);
        
        if (parent) {
          parent.children = parent.children ?? [];
          parent.children.push(category);
        } else {
          roots.push(category);
        }
      }
    }

    return this.cleanEmptyChildren(roots);
  }

  private cleanEmptyChildren(categories: ExtractedCategory[]): ExtractedCategory[] {
    return categories.map(cat => ({
      ...cat,
      children: cat.children?.length ? this.cleanEmptyChildren(cat.children) : undefined,
    }));
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
