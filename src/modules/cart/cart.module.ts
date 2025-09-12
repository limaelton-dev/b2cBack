import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { CartRepository } from './repositories/cart.repository';
import { CartItemRepository } from './repositories/cart-item.repository';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsModule } from '../products/products.module';
import { DiscountModule } from '../discount/discount.module';
import { ShippingModule } from '../shipping/shipping.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductsModule,
    DiscountModule,
    ShippingModule,
    ConfigModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository, CartItemRepository],
  exports: [CartService],
})
export class CartModule {}