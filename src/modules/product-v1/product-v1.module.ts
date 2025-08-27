import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductImageService } from './services/product.image.service';
import { ProductImage } from './entities/product.image.entity';
import { Brand } from '../category/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, Brand])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductImageService],
  exports: [ProductService, ProductRepository],
})
export class ProductV1Module {} 