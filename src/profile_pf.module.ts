import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePF } from './models/profile_pf/profile_pf';
import { ProfilePFService } from './services/profile_pf/profile_pf.service';
import { ProfilePFController } from './controllers/profile_pf/profile_pf.controller';
import { ProfileModule } from './profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfilePF]),
    ProfileModule
  ],
  controllers: [ProfilePFController],
  providers: [ProfilePFService],
  exports: [ProfilePFService],
})
export class ProfilePFModule {} 