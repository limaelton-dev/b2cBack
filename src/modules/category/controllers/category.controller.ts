import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from '../services/category.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}
    @Get('menu')
    async getCategoryMenu() {
      return this.categoryService.getCategoryMenu();
    }

    @Get('products')
    async getProdutosTipoLimit(@Query('limit') limit: number) {
      return this.categoryService.getProdutosTipoLimit(limit);
    }
}
