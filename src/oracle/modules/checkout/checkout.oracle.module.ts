import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutOracleRepository } from './repositories/checkout.oracle.repository';
import { CheckoutOracleService } from './services/checkout.oracle.service';
import { CheckoutOracleController } from './controllers/checkout.oracle.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
        [],
        'oracle'
    ),
  ],
  controllers: [CheckoutOracleController],
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