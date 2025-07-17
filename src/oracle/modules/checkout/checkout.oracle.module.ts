import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutOracleRepository } from './repositories/checkout.oracle.repository';
import { CheckoutOracleService } from './services/checkout.oracle.service';
import { Checkout2OracleController } from './controllers/checkout2.oracle.controller';
import { CheckoutOracleController } from './controllers/checkout.oracle.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
        [],
        'oracle'
    ),
  ],
  controllers: [Checkout2OracleController, CheckoutOracleController],
  providers: [
    CheckoutOracleRepository,
    CheckoutOracleService,
  ],
  exports: [
    CheckoutOracleService,
    CheckoutOracleRepository,
  ],
})
export class CheckoutOracleModule {} 