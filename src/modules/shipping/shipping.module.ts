import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShippingController } from './controllers/shipping.controller';
import { ShippingService } from './services/shipping.service';
import { CorreiosProviderService } from './services/providers/correios-provider.service';
import { SimulationProviderService } from './services/providers/simulation-provider.service';
import { ProductV1Module } from '../product-v1/product-v1.module';

/**
 * Módulo para gerenciamento de serviços de frete
 */
@Module({
  imports: [
    ConfigModule,
    ProductV1Module,
  ],
  controllers: [
    ShippingController,
  ],
  providers: [
    ShippingService,
    CorreiosProviderService,
    SimulationProviderService,
  ],
  exports: [
    ShippingService,
  ]
})
export class ShippingModule {} 