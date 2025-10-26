import { Module } from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { ProfileModule } from '../profile/profile.module';
import { ProductsModule } from '../products/products.module';
import { AnyMarketModule } from '../../shared/anymarket/any-market.module';

@Module({
  imports: [
    ProfileModule,
    ProductsModule,
    AnyMarketModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
  exports: [OrdersService, OrderRepository],
})
export class OrdersModule {} 