import {
  Controller,
  Body,
  Param,
  Get,
  Query,
  Post,
  ParseIntPipe
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ListProductsByCategoryQueryDto } from '../dto/list-products-by-category.query.dto';
import { ProductFiltersDto } from '../dto/product-filters.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * GET /products - Lista produtos sem filtros (apenas paginação)
   * Query params: page, size, offset, limit
   */
  @Get()
  async findAll(@Query() filters: ProductFiltersDto) {
    return this.productService.findAll(filters);
  }

  /**
   * POST /products/filters - Lista produtos com filtros aplicados
   * Body: { term?, categoryIds?, brandIds?, page?, size?, offset?, limit? }
   */
  @Post('filters')
  async findByFilters(@Body() filters: ProductFiltersDto) {
    return this.productService.findByFilters(filters);
  }

  /**
   * GET /products/filters - Lista produtos com filtros via query params
   * Query params: term, categoryIds (comma-separated), brandIds (comma-separated), page, size, offset, limit
   */
  @Get('filters')
  async findByFiltersQuery(@Query() filters: ProductFiltersDto) {
    return this.productService.findByFilters(filters);
  }

  /**
   * GET /products/:id - Busca produto específico por ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  /**
   * POST /products/by-ids - Busca produtos por múltiplos IDs
   * Body: { ids: number[] }
   */
  @Post('by-ids')
  async findByIds(@Body('ids') ids: number[]) {
    return this.productService.findByIds(ids);
  }

  /**
   * GET /products/search - Busca produtos por termo
   * Query params: query (termo de busca), page, size, offset, limit
   */
  @Get('search')
  async search(
    @Query('query') query: string,
    @Query() paginationFilters: ProductFiltersDto
  ) {
    return this.productService.search(query, paginationFilters);
  }

  /**
   * GET /products/category/:categoryId - Busca produtos por categoria (compatibilidade)
   */
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string, 
    @Query() query: ListProductsByCategoryQueryDto
  ) {
    return this.productService.findByCategory(categoryId, query);
  }
} 