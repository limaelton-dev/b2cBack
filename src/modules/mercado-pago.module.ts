import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MercadoPagoService } from '../services/mercado-pago/mercado-pago.service';
import { MercadoPagoController } from '../controllers/mercado-pago/mercado-pago.controller';
import { OrderModule } from './order.module';

@Module({
  imports: [
    ConfigModule,
    OrderModule
  ],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {} 