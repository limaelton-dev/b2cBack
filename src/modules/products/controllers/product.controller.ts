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

  @Get(':id')
  async findOne(@Param('id') id: string | number) {
    if(typeof id === 'number') {
      return this.productService.findOne(+id);
    }
    else {
      return this.productService.find(id);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
} 