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

// Import shared modules. These modules expose services used within OrdersService.
import { AnyMarketModule } from '../../shared/anymarket';
import { ProductsModule } from '../products/products.module';
import { CartModule } from '../carts/cart.module';
import { ShippingModule } from '../shipping/shipping.module';

/**
 * OrdersModule wires together all pieces required for the Order domain.  It
 * imports any modules that provide services used by OrdersService (such as
 * ProductsModule and ShippingModule) and exports the core services so that
 * other modules can orchestrate order operations if necessary.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderStatusHistory]),
    AnyMarketModule,
    ProductsModule,
    CartModule,
    ShippingModule,
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