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
import { Logger } from '@nestjs/common';

@Controller('product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get('search')
  async search(@Query('query') query: string) {
    return this.productService.search(query);
  }

  @Get('generate-images')
  async generateImagesForAllProducts() {
    this.logger.log('controller generateImagesForAllProducts');
    return this.productService.generateImagesForAllProducts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
} 