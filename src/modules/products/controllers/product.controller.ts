import {
  Controller,
  Body,
  Param,
  Get,
  Query,
  Post,
  ParseIntPipe
} from '@nestjs/common';
import { ProductService } from '../services/products.service';
import { ProductFiltersDto } from '../dto/product-filters.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query() filters: ProductFiltersDto) {
    return this.productService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post('by-ids')
  async findByIds(@Body('ids') ids: number[]) {
    return this.productService.findByIds(ids);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }
} 