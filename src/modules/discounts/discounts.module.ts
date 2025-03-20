import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { DiscountProduct } from './entities/discount-product.entity';
import { DiscountsRepository } from './repositories/discounts.repository';
import { DiscountsService } from './services/discounts.service';
import { DiscountsController } from './controllers/discounts.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount, DiscountProduct]),
    ProductsModule,
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService, DiscountsRepository],
  exports: [DiscountsService, DiscountsRepository],
})
export class DiscountsModule {} 