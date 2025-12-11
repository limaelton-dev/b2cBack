import { Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ShippingModule } from '../shipping/shipping.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { ProfilePf } from '../profile/entities/profile-pf.entity';
import { ProfilePj } from '../profile/entities/profile-pj.entity';
import { Address } from '../address/entities/address.entity';
import { Phone } from '../phone/entities/phone.entity';
import { Card } from '../card/entities/card.entity';

@Module({
  imports: [
    PaymentModule,
    CartModule,
    ProductsModule,
    AppConfigModule,
    ProfileModule,
    ShippingModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    TypeOrmModule.forFeature([User, Profile, ProfilePf, ProfilePj, Address, Phone, Card]),
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