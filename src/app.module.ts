import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { AddressModule } from './modules/address/address.module';
import { PhoneModule } from './modules/phone/phone.module';
import { CardModule } from './modules/card/card.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ConnectionController } from './test/connection/connection.controller';
import { CategoriesModule } from './modules/categories/categories.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { BrandsModule } from './modules/brands/brands.module';

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
    ProductsModule,
    OrdersModule,
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
    CategoriesModule,
    BrandsModule,
  ],
  controllers: [ConnectionController],
})
export class AppModule {}
