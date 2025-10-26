import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsController } from './controllers/carts.controller';
import { CartsService } from './services/carts.service';
import { CartRepository } from './repositories/carts.repository';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsModule } from '../products/products.module';
import { ShippingModule } from '../shipping/shipping.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductsModule,
    ShippingModule,
    ConfigModule,
  ],
  controllers: [CartsController],
  providers: [CartsService, CartRepository],
  exports: [CartsService],
})
export class CartModule {}