import { Module, OnModuleInit } from '@nestjs/common';
import { CheckoutController } from './controllers/checkout.controller';
import { CheckoutsService } from './services/checkouts.service';
import { CieloService } from './services/cielo.service';
import { PaymentModule } from '../payment/payment.module';
import { CartModule } from '../carts/cart.module';
import { ProductsModule } from '../products/products.module';
import { PaymentGatewayFactory } from './factories/payment-gateway.factory';
import { PaymentGatewayStrategy } from './strategies/payment-gateway.strategy';
import { AppConfigModule } from '../../config/app.config.module';
import { CieloGateway } from './payment-gateway/cielo/cielo.gateway';
import { ProfileModule } from '../profile/profile.module';
import { CieloConfigProvider } from './providers/cielo-config.provider';
import { ICheckoutService } from './interfaces/checkout-service.interface';
import { IPaymentService } from './interfaces/payment-service.interface';
import { ShippingModule } from '../shipping/shipping.module';

@Module({
  imports: [
    PaymentModule,
    CartModule,
    ProductsModule,
    AppConfigModule,
    ProfileModule,
    ShippingModule,
  ],
  controllers: [CheckoutController],
  providers: [
    {
      provide: 'CheckoutService',
      useClass: CheckoutsService
    },
    {
      provide: 'CieloService',
      useClass: CieloService
    },
    PaymentGatewayFactory,
    PaymentGatewayStrategy,
    CieloGateway,
    CieloConfigProvider,
    CheckoutsService,
    CieloService
  ],
  exports: [
    'CheckoutService',
    'CieloService',
    CheckoutsService,
    CieloService
  ],
})
export class CheckoutModule implements OnModuleInit {
  constructor(
    private readonly paymentGatewayFactory: PaymentGatewayFactory,
    private readonly cieloGateway: CieloGateway
  ) {}

  onModuleInit() {
    // Registrar o gateway da CIELO quando o módulo inicializar
    this.paymentGatewayFactory.registerGateway('cielo', this.cieloGateway);
  }
} 