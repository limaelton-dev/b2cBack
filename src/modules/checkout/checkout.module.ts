import { Module, OnModuleInit } from '@nestjs/common';
import { CheckoutController } from './controllers/checkout.controller';
import { CheckoutService } from './services/checkout.service';
import { CieloService } from './services/cielo.service';
import { PaymentModule } from '../payment/payment.module';
import { CartModule } from '../cart/cart.module';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { PaymentGatewayFactory } from './factories/payment-gateway.factory';
import { PaymentGatewayStrategy } from './strategies/payment-gateway.strategy';
import { CartValidationService } from './services/cart-validation.service';
import { OrderCreationService } from './services/order-creation.service';
import { StockManagementService } from './services/stock-management.service';
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
    OrderModule,
    ProductModule,
    AppConfigModule,
    ProfileModule,
    ShippingModule,
  ],
  controllers: [CheckoutController],
  providers: [
    {
      provide: 'CheckoutService',
      useClass: CheckoutService
    },
    {
      provide: 'CieloService',
      useClass: CieloService
    },
    PaymentGatewayFactory,
    PaymentGatewayStrategy,
    CartValidationService,
    OrderCreationService,
    StockManagementService,
    CieloGateway,
    CieloConfigProvider,
    CheckoutService,
    CieloService
  ],
  exports: [
    'CheckoutService',
    'CieloService',
    CheckoutService,
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