import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../models/order/order';
import { OrderItem } from '../models/order_item/order_item';
import { OrderService } from '../services/order/order.service';
import { OrderController } from '../controllers/order/order.controller';
import { ProfileModule } from './profile.module';
import { AddressModule } from './address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProfileModule,
    AddressModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {} 