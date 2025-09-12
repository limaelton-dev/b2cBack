import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Brand } from './entities/brand.entity';
import { CategoryRepository } from './repositories/category.repository';
import { BrandRepository } from './repositories/brand.repository';
import { ProductsModule } from '../products/products.module';
import { CategoryAnymarketRepository } from './repositories/category-anymarket.repository';
import { AnyMarketModule } from '../../shared/anymarket';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Brand]),
    ProductsModule,
    AnyMarketModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, BrandRepository, CategoryAnymarketRepository],
  exports: [CategoryService ],
})
export class CategoryModule {}
