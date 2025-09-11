import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { ListProductsByCategoryQueryDto } from '../dto/list-products-by-category.query.dto';
import { ProductFiltersDto } from '../dto/product-filters.dto';
import { normalizePagination } from '../../../shared/anymarket/util/util';
import { ProductFilterService, Product, ProductFilterInput } from './product-filter.service';
import { ProductSlugService } from './product-slug.service';



@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productFilterService: ProductFilterService,
    private readonly productsSlugService: ProductSlugService,
  ) {}

  /**
   * Busca produtos com filtro obrigatório isProductActive = true
   * Sempre aplica filtros via stream para garantir que apenas produtos ativos sejam retornados
   */
  async findAll(filters: ProductFiltersDto) {
    const { offset, limit } = normalizePagination({ 
      page: filters.page, 
      size: filters.size, 
      rawOffset: filters.offset, 
      rawLimit: filters.limit,
    });

    // Sempre aplicar filtros para garantir isProductActive = true
    const filterInput: ProductFilterInput = {
      term: filters.term,
      categoryIds: filters.categoryIds,
      brandIds: filters.brandIds,
    };

    // Usar stream para processar todas as páginas e aplicar filtros
    const stream = this.productsRepository.findAllStream();
    
    const filtredProducts = await this.productFilterService.takeSliceFromStream(
      stream,
      filterInput,
      offset,
      limit,
      true // computeTotalMatched para paginação correta
    );

    const productsWithSlug = this.productsSlugService.addSlugsToProducts(filtredProducts.items);

    return {
      ...filtredProducts,
      items: productsWithSlug
    };
  }

  /**
   * Busca produtos por categoria (mantendo compatibilidade)
   * Aplica filtro isProductActive = true automaticamente
   */
  async findByCategory(categoryId: string, filters: ListProductsByCategoryQueryDto) {
    // Usar o sistema de filtros para garantir isProductActive = true
    const productFilters: ProductFiltersDto = {
      page: filters.page,
      size: filters.size,
      offset: filters.offset,
      limit: filters.limit,
      categoryIds: [categoryId], // Converter categoryId para array
    };
    
    return this.findAll(productFilters);
  }

  /**
   * Busca um produto específico por ID
   */
  async findOne(id: number) {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return product;
  }

  /**
   * Busca produtos por múltiplos IDs
   */
  async findByIds(ids: number[]) {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.productsRepository.findByIds(ids);
  }

  /**
   * Busca por termo (compatibilidade - redireciona para findByFilters)
   */
  async search(term: string, paginationFilters?: Partial<ProductFiltersDto>) {
    const filters: ProductFiltersDto = {
      ...paginationFilters,
      term,
    };
    return this.findAll(filters);
  }

  async findBySlug(slug: string) {
    const stream = this.productsRepository.findAllStream();
    
    for await (const product of stream) {
      if (!product.isProductActive) continue;
      
      const productWithSlug = this.productsSlugService.addSlugsToProducts([product])[0];
      
      if (productWithSlug.slug === slug) {
        return productWithSlug;
      }
    }
    
    throw new NotFoundException(`Produto com slug '${slug}' não encontrado`);
  }
}