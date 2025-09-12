import {
  Controller,
  Body,
  Param,
  Get,
  Query,
  Post,
  ParseIntPipe
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductsFiltersDto } from '../dto/products-filters.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() filters: ProductsFiltersDto) {
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post('by-ids')
  async findByIds(@Body('ids') ids: number[]) {
    return this.productsService.findByIds(ids);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
} 