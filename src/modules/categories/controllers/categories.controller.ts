import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService
  ) {}
  
    @Get()
    async findRootCategories() {
      return this.categoriesService.findRootCategories();
    }

    @Get('tree')
    async findAll() {
      return this.categoriesService.findAll();
    }
}
