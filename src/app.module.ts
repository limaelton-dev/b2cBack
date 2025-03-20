import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { PhonesModule } from './modules/phones/phones.module';
import { CardsModule } from './modules/cards/cards.module';
import { ProductsModule } from './modules/products/products.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    ProfilesModule,
    AddressesModule,
    PhonesModule,
    CardsModule,
    ProductsModule,
    DiscountsModule,
    OrdersModule,
    PaymentsModule,
    AuthModule,
  ],
})
export class AppModule {}
