import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../models/cart/cart';
import { CartService } from '../services/cart/cart.service';
import { CartController } from '../controllers/cart/cart.controller';
import { User } from '../models/user/user';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, User])
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule {}