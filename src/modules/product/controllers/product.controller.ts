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
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { Brand } from 'src/modules/category/entities/brand.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @Get('search')
  async search(@Query('query') query: string) {
    return this.productService.search(query);
  }

  @Get('generate-images')
  @UseGuards(JwtAuthGuard)
  async generateImagesForAllProducts() {
    return this.productService.generateImagesForAllProducts();
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
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Get('fabricator')
  async getProdutoFabricanteLimit(@Query('limit') limit: number): Promise<Brand[]> {
    return this.productService.getProdutosFabricanteLimit(limit);
  }
} 