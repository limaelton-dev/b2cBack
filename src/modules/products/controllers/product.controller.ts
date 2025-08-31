import {
  Controller,
  Body,
  Param,
  Get,
  Put,
  UseGuards,
  Query
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ListProductsByCategoryQueryDto } from '../dto/list-products-by-category.query.dto';
import { ListProductsQueryDto } from '../dto/list-products.query.dto';


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query() query: ListProductsQueryDto) {
    return this.productService.findAll(query);
  }

  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string, 
    @Query() query: ListProductsByCategoryQueryDto
  ) {
    return this.productService.findByCategory(categoryId, query);
  }

  @Get('search')
  async search(@Query('query') query: string) {
    return this.productService.search(query);
  }
} 