import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShippingController } from './controllers/shipping.controller';
import { ShippingService } from './services/shipping.service';
import { AnyMarketProviderService } from './services/providers/anymarket-provider.service';
import { AnyMarketModule } from '../../shared/anymarket/any-market.module';

@Module({
  imports: [
    ConfigModule,
    AnyMarketModule,
  ],
  controllers: [
    ShippingController,
  ],
  providers: [
    ShippingService,
    AnyMarketProviderService,
  ],
  exports: [
    ShippingService,
  ],
})
export class ShippingModule {}
