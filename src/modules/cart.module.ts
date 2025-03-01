import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../models/cart/cart';
import { CartService } from '../services/cart/cart.service';
import { CartController } from '../controllers/cart/cart.controller';
import { User } from '../models/user/user';
import { Produto } from '../models/produto/produto';
import { Profile } from '../models/profile/profile';
import { ProfileService } from '../services/profile/profile.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, User, Produto, Profile])
    ],
    controllers: [CartController],
    providers: [CartService, ProfileService],
    exports: [CartService],
})
export class CartModule {}