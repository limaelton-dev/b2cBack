import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { OrderModule } from '../order/order.module';
import { AppConfigModule } from '../../config/app.config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentMethod]),
    OrderModule,
    AppConfigModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {} 