import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrdersSyncService } from './services/orders-sync.service';
import { OrdersStatusService } from './services/orders-status.service';

import { OrdersRepository } from './repositories/orders.repository';
import { OrdersAnymarketRepository } from './repositories/orders-anymarket.repository';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { AnyMarketModule } from 'src/shared/anymarket';

// TODO: importar módulo de Cart e Profile quando estiverem prontos
// import { CartModule } from '../cart/cart.module';
// import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderStatusHistory]),
    AnyMarketModule,
    // CartModule,
    // ProfileModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersSyncService,
    OrdersStatusService,
    OrdersRepository,
    OrdersAnymarketRepository,
  ],
  exports: [
    OrdersService,
    OrdersSyncService,
    OrdersStatusService,
    OrdersRepository,
    OrdersAnymarketRepository,
  ],
})
export class OrdersModule {}
