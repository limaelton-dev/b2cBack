import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Brand } from './entities/brand.entity';
import { CategoryRepository } from './repositories/category.repository';
import { BrandRepository } from './repositories/brand.repository';
import { ProductV1Module } from '../product-v1/product-v1.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Brand]),
    ProductV1Module,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, BrandRepository],
  exports: [CategoryService, CategoryRepository, BrandRepository],
})
export class CategoryModule {}
