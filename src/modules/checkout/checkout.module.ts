import { Module, OnModuleInit } from '@nestjs/common';
import { CheckoutController } from './controllers/checkout.controller';
import { CheckoutService } from './services/checkout.service';
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
import { AppConfigService } from '../../config/app.config.service';
import { CieloGateway } from './payment-gateway/cielo.gateway';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    PaymentModule,
    CartModule,
    OrderModule,
    ProductModule,
    AppConfigModule,
    ProfileModule,
  ],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    PaymentGatewayFactory,
    PaymentGatewayStrategy,
    CartValidationService,
    OrderCreationService,
    StockManagementService,
    CieloGateway,
    {
      provide: 'PaymentGatewayConfig',
      useFactory: (configService: AppConfigService) => {
        return {
          apiKey: configService.get('PAYMENT_GATEWAY_API_KEY') || 'cielo_api_key_simulada',
          secretKey: configService.get('PAYMENT_GATEWAY_SECRET_KEY') || 'cielo_secret_key_simulada',
          environment: configService.get('NODE_ENV') === 'production' ? 'production' : 'sandbox',
        };
      },
      inject: [AppConfigService],
    },
  ],
  exports: [CheckoutService],
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