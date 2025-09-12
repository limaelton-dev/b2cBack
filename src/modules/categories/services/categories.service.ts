import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { generateSlugFromPath } from '../../../common/helpers/categories.util';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository
  ) {}

  async findAll() {
    const categories = await this.categoriesRepository.findAll();
    const filteredCategories = this.filterCategoriesWithProducts(categories);
    return this.addSlugsToCategories(filteredCategories);
  }

  /**
   * Filtra categorias recursivamente, mantendo apenas aquelas que têm produtos
   * Verifica primeiro os filhos mais profundos da cadeia
   */
  private filterCategoriesWithProducts(categories: any[]): any[] {
    return categories
      .map(category => this.filterCategoriesRecursively(category))
      .filter(category => category !== null);
  }

  /**
   * Filtra uma categoria recursivamente
   * Retorna null se a categoria não deve ser incluída
   */
  private filterCategoriesRecursively(category: any): any | null {
    // Se a categoria tem filhos, processa os filhos primeiro
    if (category.children && category.children.length > 0) {
      const filteredChildren = category.children
        .map((child: any) => this.filterCategoriesRecursively(child))
        .filter((child: any) => child !== null);

      // Se após filtrar os filhos, não sobrou nenhum filho E a categoria não tem produtos próprios
      if (filteredChildren.length === 0 && (!category.totalProducts || category.totalProducts === 0)) {
        return null; // Remove esta categoria
      }

      // Retorna a categoria com os filhos filtrados
      return {
        ...category,
        children: filteredChildren
      };
    }

    // Se é uma categoria folha (sem filhos), só mantém se tiver produtos
    if (!category.totalProducts || category.totalProducts === 0) {
      return null;
    }

    return category;
  }

  /**
   * Adiciona slugs às categorias recursivamente baseado no path
   */
  private addSlugsToCategories(categories: any[]): any[] {
    return categories.map(category => this.addSlugToCategoriesRecursively(category));
  }

  /**
   * Adiciona slug a uma categoria e seus filhos recursivamente
   */
  private addSlugToCategoriesRecursively(category: any): any {
    const categoryWithSlug = {
      ...category,
      slug: generateSlugFromPath(category.path)
    };

    // Se a categoria tem filhos, adiciona slug recursivamente
    if (category.children && category.children.length > 0) {
      categoryWithSlug.children = category.children.map((child: any) => 
        this.addSlugToCategoriesRecursively(child)
      );
    }

    return categoryWithSlug;
  }

  async findRootCategories() {
    return await this.categoriesRepository.findRootCategories()
  }
}
