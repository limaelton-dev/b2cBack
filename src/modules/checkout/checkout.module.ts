import { Module, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutController } from './controllers/checkout.controller';
import { WebhookController } from './controllers/webhook.controller';
import { CheckoutService } from './services/checkout.service';
import { PaymentService } from './services/payment.service';
import { WebhookService } from './services/webhook.service';
import { PaymentGatewayFactory } from './factories/payment-gateway.factory';
import { CieloGateway } from './payment-gateway/cielo/cielo.gateway';
import { MercadoPagoGateway } from './payment-gateway/mercado-pago/mercado-pago.gateway';
import { CieloConfigProvider } from './providers/cielo-config.provider';
import { MercadoPagoConfigProvider } from './providers/mercado-pago-config.provider';
import { User } from '../user/entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { ProfilePf } from '../profile/entities/profile-pf.entity';
import { ProfilePj } from '../profile/entities/profile-pj.entity';
import { Address } from '../address/entities/address.entity';
import { Phone } from '../phone/entities/phone.entity';
import { Card } from '../card/entities/card.entity';
import { Order } from '../orders/entities/order.entity';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { CartModule } from '../carts/cart.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { ShippingModule } from '../shipping/shipping.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    TypeOrmModule.forFeature([User, Profile, ProfilePf, ProfilePj, Address, Phone, Card, Order, PaymentTransaction]),
    CartModule,
    OrdersModule,
    ProductsModule,
    ShippingModule,
  ],
  controllers: [CheckoutController, WebhookController],
  providers: [
    CheckoutService,
    PaymentService,
    WebhookService,
    PaymentGatewayFactory,
    CieloGateway,
    MercadoPagoGateway,
    CieloConfigProvider,
    MercadoPagoConfigProvider,
  ],
  exports: [CheckoutService, PaymentService, WebhookService],
})
export class CheckoutModule implements OnModuleInit {
  private readonly logger = new Logger(CheckoutModule.name);

  constructor(
    private readonly paymentGatewayFactory: PaymentGatewayFactory,
    private readonly cieloGateway: CieloGateway,
    private readonly mercadoPagoGateway: MercadoPagoGateway,
    @Inject('CieloConfig') private readonly cieloConfig: any,
    @Inject('MercadoPagoConfig') private readonly mercadoPagoConfig: any,
  ) {}

  onModuleInit() {
    if (this.cieloConfig) {
      this.paymentGatewayFactory.registerGateway('cielo', this.cieloGateway);
      this.logger.log('Gateway Cielo registrado');
    } else {
      this.logger.warn('Gateway Cielo não configurado (CIELO_MERCHANT_ID/CIELO_MERCHANT_KEY ausentes)');
    }

    if (this.mercadoPagoConfig) {
      this.paymentGatewayFactory.registerGateway('mercadopago', this.mercadoPagoGateway);
      this.logger.log('Gateway Mercado Pago registrado');
    } else {
      this.logger.warn('Gateway Mercado Pago não configurado (MERCADO_PAGO_ACCESS_TOKEN ausente)');
    }

    const availableGateways = this.paymentGatewayFactory.getAvailableGateways();
    if (availableGateways.length > 0) {
      this.logger.log(`Gateways disponíveis: ${availableGateways.join(', ')}`);
    } else {
      this.logger.warn('Nenhum gateway de pagamento configurado');
    }
  }
}
