import { Module } from '@nestjs/common';
import { MyAccountController } from '../controllers/profile/my-account.controller';
import { ProfileModule } from './profile.module';
import { OrderModule } from './order.module';
import { AddressModule } from './address.module';
import { CardModule } from './card.module';
import { PhoneModule } from './phone.module';
import { AuthModule } from './auth.module';
import { ProfilePFModule } from './profile_pf.module';

@Module({
  imports: [
    ProfileModule,
    OrderModule,
    AddressModule,
    CardModule,
    PhoneModule,
    AuthModule,
    ProfilePFModule
  ],
  controllers: [MyAccountController],
})
export class MyAccountModule {} 