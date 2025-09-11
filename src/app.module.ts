import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { AddressModule } from './modules/address/address.module';
import { PhoneModule } from './modules/phone/phone.module';
import { CardModule } from './modules/card/card.module';
import { ProductV1Module } from './modules/product-v1/product-v1.module';
import { DiscountModule } from './modules/discount/discount.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ConnectionController } from './test/connection/connection.controller';
// import { OracleModule } from './oracle/oracle.module';
import { CategoryModule } from './modules/category/category.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { ProductsModule } from './modules/products/products.module';
import { BrandModule } from './modules/brands/brand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AddressModule,
    PhoneModule,
    CardModule,
    ProductV1Module,
    DiscountModule,
    OrderModule,
    PaymentModule,
    AuthModule,
    CheckoutModule,
    ShippingModule,
    RouterModule.register([
      {
        path: 'user',
        module: UserModule,
        children: [
          {
            path: 'profile',
            module: ProfileModule,
          },
        ],
      },
    ]),
    CategoryModule,
    BrandModule,
    ProductsModule,
  ],
  controllers: [ConnectionController],
})
export class AppModule {}
