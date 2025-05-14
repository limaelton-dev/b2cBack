// src/modules/category/services/category.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async getProdutosTipoLimit(limit: number): Promise<Category[]> {
    const query = this.categoryRepository
        .createQueryBuilder('category')
        .where('category.source_table LIKE :source', { source: '%TIPO%' })
        .orderBy('category.name', 'DESC')
        .limit(limit);

    return await query.getMany();
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
