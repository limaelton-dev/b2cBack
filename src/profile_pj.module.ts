import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePJ } from './models/profile_pj/profile_pj';
import { ProfilePJService } from './services/profile_pj/profile_pj.service';
import { ProfilePJController } from './controllers/profile_pj/profile_pj.controller';
import { ProfileModule } from './profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfilePJ]),
    ProfileModule
  ],
  controllers: [ProfilePJController],
  providers: [ProfilePJService],
  exports: [ProfilePJService],
})
export class ProfilePJModule {} 