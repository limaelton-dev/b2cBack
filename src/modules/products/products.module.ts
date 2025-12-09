import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsFilterService } from './services/products-filters.service';
import { AnyMarketModule } from '../../shared/anymarket';

@Module({
  imports: [AnyMarketModule],
  controllers: [ProductsController],
  providers: [
    ProductsService, 
    ProductsRepository, 
    ProductsFilterService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
