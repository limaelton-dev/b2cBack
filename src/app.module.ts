import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
// Remova o ProfileModule daqui se for usá-lo apenas via RouterModule
// import { ProfileModule } from './modules/profile/profile.module';
import { AddressModule } from './modules/address/address.module';
import { PhoneModule } from './modules/phone/phone.module';
import { CardModule } from './modules/card/card.module';
import { ProductModule } from './modules/product/product.module';
import { DiscountModule } from './modules/discount/discount.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './modules/profile/profile.module'; // mantenha a importação para a injeção de dependência

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
    ProductModule,
    DiscountModule,
    OrderModule,
    PaymentModule,
    AuthModule,
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
  ],
})
export class AppModule {}
