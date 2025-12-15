import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MarketplaceProductExtractorService, ExtractedBrand } from 'src/shared/anymarket';

const CACHE_KEY_BRANDS = 'brands:all';
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

@Injectable()
export class BrandsRepository {
  constructor(
    private readonly extractor: MarketplaceProductExtractorService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<ExtractedBrand[]> {
    const cached = await this.cacheManager.get<ExtractedBrand[]>(CACHE_KEY_BRANDS);
    if (cached) return cached;

    const brands = await this.extractor.extractBrands();
    await this.cacheManager.set(CACHE_KEY_BRANDS, brands, TWELVE_HOURS_MS);
    return brands;
  }
}