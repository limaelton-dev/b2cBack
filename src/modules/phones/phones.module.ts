import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phone } from './entities/phone.entity';
import { PhonesRepository } from './repositories/phones.repository';
import { PhonesService } from './services/phones.service';
import { PhonesController } from './controllers/phones.controller';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Phone]),
    ProfilesModule,
  ],
  controllers: [PhonesController],
  providers: [PhonesService, PhonesRepository],
  exports: [PhonesService, PhonesRepository],
})
export class PhonesModule {} 