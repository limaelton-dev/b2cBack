import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsController } from './controllers/carts.controller';
import { CartsService } from './services/carts.service';
import { CartRepository } from './repositories/carts.repository';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductsModule,
  ],
  controllers: [CartsController],
  providers: [CartsService, CartRepository],
  exports: [CartsService],
})
export class CartModule {}
