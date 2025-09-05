import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { ListProductsByCategoryQueryDto } from '../dto/list-products-by-category.query.dto';
import { ProductFiltersDto } from '../dto/product-filters.dto';
import { normalizePagination } from '../../../shared/anymarket/util/util';
import { ProductFilterService, Product, ProductFilterInput } from './product-filter.service';



@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productFilterService: ProductFilterService,
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
    
    return this.productFilterService.takeSliceFromStream(
      stream,
      filterInput,
      offset,
      limit,
      true // computeTotalMatched para paginação correta
    );
  }

  /**
   * Busca produtos com filtros aplicados (termo, categorias, marcas)
   * Redireciona para findAll que já aplica todos os filtros incluindo isProductActive = true
   */
  async findByFilters(filters: ProductFiltersDto) {
    // findAll agora sempre aplica filtros, incluindo isProductActive = true
    return this.findAll(filters);
  }

  /**
   * Busca produtos por categoria (mantendo compatibilidade)
   */
  async findByCategory(categoryId: string, filters: ListProductsByCategoryQueryDto) {
    const { offset, limit } = normalizePagination({ 
      page: filters.page, 
      size: filters.size, 
      rawOffset: filters.offset, 
      rawLimit: filters.limit,
    });
    return this.productsRepository.findAll({ offset, limit, categoryId });
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
    return this.findByFilters(filters);
  }
}