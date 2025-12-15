import { Injectable } from '@nestjs/common';
import { MarketplaceProductExtractorService, ExtractedCategory } from '../../../shared/anymarket';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly extractor: MarketplaceProductExtractorService) {}

  async findAll(): Promise<ExtractedCategory[]> {
    return this.extractor.extractCategories();
  }

  async findRootCategories(): Promise<ExtractedCategory[]> {
    const tree = await this.findAll();
    return tree.map(({ children, ...root }) => root);
  }
}
