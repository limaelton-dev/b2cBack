import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProfilePf } from '../profile/entities/profile-pf.entity';
import { UsersAvailabilityController } from './controllers/user-availability.controller';
import { UsersAvailabilityService } from './services/users-availability.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfilePf])],
  controllers: [UsersAvailabilityController],
  providers: [UsersAvailabilityService],
})
export class UsersAvailabilityModule {}

