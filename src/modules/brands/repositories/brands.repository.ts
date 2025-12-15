import { Injectable } from '@nestjs/common';
import { MarketplaceProductExtractorService, ExtractedBrand } from 'src/shared/anymarket';

@Injectable()
export class BrandsRepository {
  constructor(private readonly extractor: MarketplaceProductExtractorService) {}

  async findAll(): Promise<ExtractedBrand[]> {
    return this.extractor.extractBrands();
  }
}