// src/modules/category/services/category.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { ProductFilterDto } from 'src/modules/product-v1/dto/product-filter.dto';
import { ProductService } from 'src/modules/product-v1/services/product.service';
import { CategoryAnymarketRepository } from '../repositories/category-anymarket.repository';
import { generateSlugFromPath } from '../../../common/helpers/category.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    private readonly productService: ProductService,

    private readonly categoryAnyMktRepositiry: CategoryAnymarketRepository
  ) {}

  async findAll() {
    const categories = await this.categoryAnyMktRepositiry.findAll();
    const filteredCategories = this.filterCategoriesWithProducts(categories);
    return this.addSlugsToCategories(filteredCategories);
  }

  /**
   * Filtra categorias recursivamente, mantendo apenas aquelas que têm produtos
   * Verifica primeiro os filhos mais profundos da cadeia
   */
  private filterCategoriesWithProducts(categories: any[]): any[] {
    return categories
      .map(category => this.filterCategoryRecursively(category))
      .filter(category => category !== null);
  }

  /**
   * Filtra uma categoria recursivamente
   * Retorna null se a categoria não deve ser incluída
   */
  private filterCategoryRecursively(category: any): any | null {
    // Se a categoria tem filhos, processa os filhos primeiro
    if (category.children && category.children.length > 0) {
      const filteredChildren = category.children
        .map((child: any) => this.filterCategoryRecursively(child))
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
    return categories.map(category => this.addSlugToCategoryRecursively(category));
  }

  /**
   * Adiciona slug a uma categoria e seus filhos recursivamente
   */
  private addSlugToCategoryRecursively(category: any): any {
    const categoryWithSlug = {
      ...category,
      slug: generateSlugFromPath(category.path)
    };

    // Se a categoria tem filhos, adiciona slug recursivamente
    if (category.children && category.children.length > 0) {
      categoryWithSlug.children = category.children.map((child: any) => 
        this.addSlugToCategoryRecursively(child)
      );
    }

    return categoryWithSlug;
  }

  async findRootCategories() {
    return await this.categoryAnyMktRepositiry.findRootCategories()
  }

  async getAllBrands() {
    const brands = await this.brandRepository.find({
      order: {
        name: 'ASC'
      }
    });

    return {
      data: brands,
      count: brands.length
    };
  }

  async getAllCategories(level?: number) {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('category.brand', 'brand')
      .orderBy('category.name', 'ASC');
    
    if (level) {
      queryBuilder.where('category.level = :level', { level });
    }
    
    const categories = await queryBuilder.getMany();
    
    return {
      data: categories,
      count: categories.length
    };
  }

  async getProdutosTipoLimit(limit: number): Promise<Category[]> {
    const query = this.categoryRepository
        .createQueryBuilder('category')
        .where('category.source_table LIKE :source', { source: '%TIPO%' })
        .orderBy('category.name', 'DESC')
        .limit(limit);

    return await query.getMany();
  }

  async filterProducts(filterDto: ProductFilterDto) {
    return this.productService.findByFilters(filterDto);
  }

  async getCategoryMenu(): Promise<any[]> {
    const brands = await this.brandRepository.find();
    const result = [];

    for (const brand of brands) {
      const categories = await this.categoryRepository.find({
        where: { brand: { id: brand.id } },
        relations: ['parent'],
        order: { level: 'ASC' },
      });

      const parents = categories.filter(c => c.level === 1);
      const children = categories.filter(c => c.level === 2);
      const grandChidren = categories.filter(c => c.level === 3);

      const formattedCategories = parents.map(parent => {
        const childList = children
          .filter(child => child.parent?.id === parent.id)
          .map(child => {
            const grandChildList = grandChidren
              .filter(grandChild => grandChild.parent?.id === child.id)
              .map(grandChild => ({
                id: grandChild.id,
                name: grandChild.name,
                slug: grandChild.slug,
              }));

            return {
              id: child.id,
              name: child.name,
              slug: child.slug,
              children: grandChildList,
            };
          });

        return {
          id: parent.id,
          name: parent.name,
          slug: parent.slug,
          children: childList,
        };
      });

      result.push({
        brand: {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
        },
        categories: formattedCategories,
      });
    }

    return result;
  }
}
