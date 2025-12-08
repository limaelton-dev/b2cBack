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
  async findAll(
    @Query() 
    filters: ProductsFiltersDto
  ) {
    return this.productsService.findAll(filters);
  }
  //adicionar validação se o produto ESTÁ EM ESTOQUE

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) 
    id: number) {
    return this.productsService.findOne(id);
  }
  
  @Get(':id/sku/:skuId')
  async findBySku(
    @Param('id', ParseIntPipe) 
    id: number, 
    @Param('skuId', ParseIntPipe) 
    skuId: number
  ) {
    return this.productsService.findBySkuId(id, skuId);
  }

  @Get('by-ids')
  async findByIds(@Query('ids') ids: string) {
    return this.productsService.findByIds(ids.split(',').map(Number));
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
} 