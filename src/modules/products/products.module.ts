import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductsRepository } from './repositories/products.repository';
import { AnyMarketModule } from '../../shared/anymarket';

@Module({
  imports: [AnyMarketModule],
  controllers: [ProductController],
  providers: [ProductService, ProductsRepository],
  exports: [ProductService],
})
export class ProductsModule {} 