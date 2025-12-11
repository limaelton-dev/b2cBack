import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ProfilePf } from 'src/modules/profile/entities/profile-pf.entity';

@Injectable()
export class UsersAvailabilityService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ProfilePf)
    private readonly profilePfRepository: Repository<ProfilePf>,
  ) {}

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    return !user;
  }

  async isCpfAvailable(cpf: string): Promise<boolean> {
    const profilePf = await this.profilePfRepository.findOne({
      where: { cpf },
    });
    return !profilePf;
  }
}
