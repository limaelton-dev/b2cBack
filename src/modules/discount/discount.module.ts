import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { DiscountProduct } from './entities/discount-product.entity';
import { DiscountRepository } from './repositories/discount.repository';
import { DiscountService } from './services/discount.service';
import { DiscountController } from './controllers/discount.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount, DiscountProduct]),
    ProductModule,
  ],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountRepository],
  exports: [DiscountService, DiscountRepository],
})
export class DiscountModule {} 