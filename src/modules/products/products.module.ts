import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductsRepository } from './repositories/products.repository';
import { AppConfigModule } from 'src/config/app.config.module';


@Module({
  imports: [HttpModule, AppConfigModule],
  controllers: [ProductController],
  providers: [ProductService, ProductsRepository],
  exports: [ProductService],
})
export class ProductsModule {} 