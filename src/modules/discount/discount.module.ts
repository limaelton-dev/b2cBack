import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { DiscountProduct } from './entities/discount-product.entity';
import { DiscountRepository } from './repositories/discount.repository';
import { DiscountService } from './services/discount.service';
import { DiscountController } from './controllers/discount.controller';
import { ProductV1Module } from '../product-v1/product-v1.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount, DiscountProduct]),
    ProductV1Module,
  ],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountRepository],
  exports: [DiscountService, DiscountRepository],
})
export class DiscountModule {} 