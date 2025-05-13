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
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }
} 