import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phone } from './entities/phone.entity';
import { PhoneRepository } from './repositories/phone.repository';
import { PhoneService } from './services/phone.service';
import { PhoneController } from './controllers/phone.controller';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Phone]),
    ProfileModule,
  ],
  controllers: [PhoneController],
  providers: [PhoneService, PhoneRepository],
  exports: [PhoneService, PhoneRepository],
})
export class PhoneModule {} 