import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../models/profile/profile';
import { ProfileService } from '../services/profile/profile.service';
import { ProfileController } from '../controllers/profile/profile.controller';
import { Cart } from '../models/cart/cart';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Cart])
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {} 