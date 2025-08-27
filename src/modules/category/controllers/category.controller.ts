import { Controller, Get, Query, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { ProductFilterDto } from 'src/modules/product-v1/dto/product-filter.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}
    @Get('menu')
    async getCategoryMenu() {
      return this.categoryService.getCategoryMenu();
    }

    @Get('brands')
    async getAllBrands() {
      return this.categoryService.getAllBrands();
    }

    @Get('all')
    async getAllCategories(@Query('level') level?: number) {
      return this.categoryService.getAllCategories(level);
    }

    @Get('products')
    async getProdutosTipoLimit(@Query('limit') limit: number) {
      return this.categoryService.getProdutosTipoLimit(limit);
    }

    @Get('filter')
    @UsePipes(new ValidationPipe({ transform: true }))
    async filterProducts(@Query() filterDto: ProductFilterDto) {
      return this.categoryService.filterProducts(filterDto);
    }

    @Get('search')
    @UsePipes(new ValidationPipe({ transform: true }))
    async searchProducts(
      @Query('query') query: string,
      @Query() filterDto: ProductFilterDto
    ) {
      if (query) {
        // Se a consulta pode ser uma marca, categoria ou nome de produto,
        // atribuímos a todos os campos de pesquisa relevantes
        filterDto.s = query;
        filterDto.brandName = query;
        filterDto.categoryName = query;
      }
      return this.categoryService.filterProducts(filterDto);
    }

    @Get(':slug/products')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getProductsByCategory(
      @Param('slug') slug: string,
      @Query() filterDto: ProductFilterDto
    ) {
      filterDto.categorySlug = slug;
      return this.categoryService.filterProducts(filterDto);
    }

    @Get('brand/:slug/products')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getProductsByBrand(
      @Param('slug') slug: string,
      @Query() filterDto: ProductFilterDto
    ) {
      filterDto.brandSlug = slug;
      return this.categoryService.filterProducts(filterDto);
    }

    @Get('name/:name/products')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getProductsByCategoryName(
      @Param('name') name: string,
      @Query() filterDto: ProductFilterDto
    ) {
      filterDto.categoryName = name;
      return this.categoryService.filterProducts(filterDto);
    }

    @Get('brand/name/:name/products')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getProductsByBrandName(
      @Param('name') name: string,
      @Query() filterDto: ProductFilterDto
    ) {
      filterDto.brandName = name;
      return this.categoryService.filterProducts(filterDto);
    }
}
