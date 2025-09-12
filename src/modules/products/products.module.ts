import { Module } from '@nestjs/common';
import { ProductService } from './services/products.service';
import { ProductController } from './controllers/product.controller';
import { ProductsRepository } from './repositories/products.repository';
import { ProductFilterService } from './services/products-filters.service';
import { AnyMarketModule } from '../../shared/anymarket';
import { ProductSlugService } from './services/products-slugs.service';

@Module({
  imports: [AnyMarketModule],
  controllers: [ProductController],
  providers: [ProductService, ProductsRepository, ProductFilterService, ProductSlugService],
  exports: [ProductService],
})
export class ProductsModule {} 