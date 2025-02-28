import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phone } from '../models/phone/phone';
import { PhoneService } from '../services/phone/phone.service';
import { PhoneController } from '../controllers/phone/phone.controller';
import { ProfileModule } from './profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Phone]),
    ProfileModule
  ],
  controllers: [PhoneController],
  providers: [PhoneService],
  exports: [PhoneService],
})
export class PhoneModule {} 