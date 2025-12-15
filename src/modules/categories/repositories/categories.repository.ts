import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MarketplaceProductExtractorService, ExtractedCategory } from '../../../shared/anymarket';

const CACHE_KEY_CATEGORIES = 'categories:all';
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

@Injectable()
export class CategoriesRepository {
  constructor(
    private readonly extractor: MarketplaceProductExtractorService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<ExtractedCategory[]> {
    const cached = await this.cacheManager.get<ExtractedCategory[]>(CACHE_KEY_CATEGORIES);
    if (cached) return cached;

    const categories = await this.extractor.extractCategories();
    await this.cacheManager.set(CACHE_KEY_CATEGORIES, categories, TWELVE_HOURS_MS);
    return categories;
  }

  async findRootCategories(): Promise<ExtractedCategory[]> {
    const tree = await this.findAll();
    return tree.map(({ children, ...root }) => root);
  }
}
