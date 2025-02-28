import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../models/address/address';
import { AddressService } from '../services/address/address.service';
import { AddressController } from '../controllers/address/address.controller';
import { ProfileModule } from './profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    ProfileModule
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {} 