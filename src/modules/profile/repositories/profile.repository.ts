import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { ProfilePf } from '../entities/profile-pf.entity';
import { ProfilePj } from '../entities/profile-pj.entity';
import { ProfileType } from '../../../common/enums/profile-type.enum';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    
    @InjectRepository(ProfilePf)
    private readonly profilePfRepository: Repository<ProfilePf>,
    
    @InjectRepository(ProfilePj)
    private readonly profilePjRepository: Repository<ProfilePj>,
  ) {}

  async create(profileData: Partial<Profile>): Promise<Profile> {
    const profile = this.profileRepository.create(profileData);
    return this.profileRepository.save(profile);
  }

  async createProfilePf(profilePfData: Partial<ProfilePf>): Promise<ProfilePf> {
    const profilePf = this.profilePfRepository.create(profilePfData);
    return this.profilePfRepository.save(profilePf);
  }

  async createProfilePj(profilePjData: Partial<ProfilePj>): Promise<ProfilePj> {
    const profilePj = this.profilePjRepository.create(profilePjData);
    return this.profilePjRepository.save(profilePj);
  }

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.find({
      relations: ['user', 'address', 'phone', 'card', 'order', 'profilePf', 'profilePj'],
    });
  }

  async findOne(id: number): Promise<Profile> {
    return this.profileRepository.findOne({
      where: { id },
      relations: ['user', 'address', 'phone', 'card', 'order', 'profilePf', 'profilePj'],
    });
  }

  async findByUserId(userId: number): Promise<Profile[]> {
    return this.profileRepository.find({
      where: { userId },
      relations: ['user', 'address', 'phone', 'card', 'order', 'profilePf', 'profilePj'],
    });
  }

  async findProfilePf(profileId: number): Promise<ProfilePf> {
    return this.profilePfRepository.findOne({
      where: { profileId },
      relations: ['profile'],
    });
  }

  async findProfilePj(profileId: number): Promise<ProfilePj> {
    return this.profilePjRepository.findOne({
      where: { profileId },
      relations: ['profile'],
    });
  }

  async findByCpf(cpf: string): Promise<ProfilePf> {
    return this.profilePfRepository.findOne({
      where: { cpf },
      relations: ['profile'],
    });
  }

  async findByCnpj(cnpj: string): Promise<ProfilePj> {
    return this.profilePjRepository.findOne({
      where: { cnpj },
      relations: ['profile'],
    });
  }

  async update(id: number, profileData: Partial<Profile>): Promise<Profile> {
    await this.profileRepository.update(id, profileData);
    return this.findOne(id);
  }

  async updateProfilePf(profileId: number, profilePfData: Partial<ProfilePf>): Promise<ProfilePf> {
    await this.profilePfRepository.update({ profileId }, profilePfData);
    return this.findProfilePf(profileId);
  }

  async updateProfilePj(profileId: number, profilePjData: Partial<ProfilePj>): Promise<ProfilePj> {
    await this.profilePjRepository.update({ profileId }, profilePjData);
    return this.findProfilePj(profileId);
  }

  async remove(id: number): Promise<void> {
    await this.profileRepository.delete(id);
  }
} 