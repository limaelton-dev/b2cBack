import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfilePf } from './entities/profile-pf.entity';
import { ProfilePj } from './entities/profile-pj.entity';
import { ProfilesRepository } from './repositories/profiles.repository';
import { ProfilesService } from './services/profiles.service';
import { ProfilesController } from './controllers/profiles.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, ProfilePf, ProfilePj]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilesRepository],
  exports: [ProfilesService, ProfilesRepository],
})
export class ProfilesModule {}