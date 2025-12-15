import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { generateSlugFromPath } from '../../../common/helpers/categories.util';
import { ExtractedCategory } from '../../../shared/anymarket';

export interface CategoryWithSlug extends ExtractedCategory {
  slug: string;
  children?: CategoryWithSlug[];
}

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findAll(): Promise<CategoryWithSlug[]> {
    const categories = await this.categoriesRepository.findAll();
    return this.addSlugsToCategories(categories);
  }

  async findRootCategories(): Promise<CategoryWithSlug[]> {
    const categories = await this.categoriesRepository.findRootCategories();
    return this.addSlugsToCategories(categories);
  }

  private addSlugsToCategories(categories: ExtractedCategory[]): CategoryWithSlug[] {
    return categories.map(category => this.addSlugRecursively(category));
  }

  private addSlugRecursively(category: ExtractedCategory): CategoryWithSlug {
    return {
      ...category,
      slug: generateSlugFromPath(category.path),
      children: category.children?.map(child => this.addSlugRecursively(child)),
    };
  }
}
