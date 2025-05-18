import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { ProfileRepository } from '../repositories/profile.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { Profile } from '../entities/profile.entity';
import { ProfilePf } from '../entities/profile-pf.entity';
import { ProfilePj } from '../entities/profile-pj.entity';
import { ProfileType } from '../../../common/enums/profile-type.enum';
import { CreateProfilePfDto } from '../dto/create-profile-pf.dto';
import { CreateProfilePjDto } from '../dto/create-profile-pj.dto';
import { UpdateProfilePfDto } from '../dto/update-profile-pf.dto';
import { UpdateProfilePjDto } from '../dto/update-profile-pj.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { User } from 'src/modules/user/entities/user.entity';
import { UserProfileDto } from 'src/modules/user/dto/user-profile.dto';
import { UserProfileDetailsDto } from 'src/modules/user/dto/user-profile-details.dto';
import { In } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async createProfilePf(userId: number, createProfilePfDto: CreateProfilePfDto): Promise<ProfilePf> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se CPF já existe
    const existingProfilePf = await this.profileRepository.findByCpf(createProfilePfDto.cpf);
    if (existingProfilePf) {
      throw new ConflictException('CPF já cadastrado');
    }

    // Criar perfil
    const profile = await this.profileRepository.create({
      userId,
      profileType: ProfileType.PF,
    });

    // Criar perfil PF
    const profilePf = await this.profileRepository.createProfilePf({
      profileId: profile.id,
      firstName: createProfilePfDto.firstName,
      lastName: createProfilePfDto.lastName,
      cpf: createProfilePfDto.cpf,
      birthDate: createProfilePfDto.birthDate,
      gender: createProfilePfDto.gender,
    });

    return profilePf;
  }

  async createProfilePj(userId: number, createProfilePjDto: CreateProfilePjDto): Promise<ProfilePj> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se CNPJ já existe
    const existingProfilePj = await this.profileRepository.findByCnpj(createProfilePjDto.cnpj);
    if (existingProfilePj) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    // Criar perfil
    const profile = await this.profileRepository.create({
      userId,
      profileType: ProfileType.PJ,
    });

    // Criar perfil PJ
    const profilePj = await this.profileRepository.createProfilePj({
      profileId: profile.id,
      companyName: createProfilePjDto.companyName,
      cnpj: createProfilePjDto.cnpj,
      tradingName: createProfilePjDto.tradingName,
      stateRegistration: createProfilePjDto.stateRegistration,
      municipalRegistration: createProfilePjDto.municipalRegistration,
    });

    return profilePj;
  }

  async findUserWithProfile(userId: number): Promise<UserProfileDto> {
    return await this.userService.findWithProfile(userId);
  }

  async findUserProfileDetails(userId: number): Promise<UserProfileDetailsDto> {
    return await this.userService.findWithProfileDetails(userId);
  }

  async findAllByUserId(userId: number): Promise<Profile[]> {
    return this.profileRepository.findByUserId(userId);
  }

  async findOne(id: number): Promise<Profile> {
    console.log('ProfileService.findOne:', { id });
    const profile = await this.profileRepository.findOne(id);
    if (!profile) {
      console.error('ProfileService.findOne - Profile not found:', { id });
      throw new NotFoundException('Perfil não encontrado');
    }
    return profile;
  }

  async findProfilePf(profileId: number): Promise<ProfilePf> {
    const profilePf = await this.profileRepository.findProfilePf(profileId);
    if (!profilePf) {
      throw new NotFoundException('Perfil PF não encontrado');
    }
    return profilePf;
  }

  async findProfilePj(profileId: number): Promise<ProfilePj> {
    const profilePj = await this.profileRepository.findProfilePj(profileId);
    if (!profilePj) {
      throw new NotFoundException('Perfil PJ não encontrado');
    }
    return profilePj;
  }

  async updateProfilePf(profileId: number, updateProfilePfDto: UpdateProfilePfDto): Promise<ProfilePf> {
    const profilePf = await this.profileRepository.findProfilePf(profileId);
    if (!profilePf) {
      throw new NotFoundException('Perfil PF não encontrado');
    }

    // Verificar se está atualizando CPF e se já existe
    if (updateProfilePfDto.cpf && updateProfilePfDto.cpf !== profilePf.cpf) {
      const existingProfilePf = await this.profileRepository.findByCpf(updateProfilePfDto.cpf);
      if (existingProfilePf) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    return this.profileRepository.updateProfilePf(profileId, updateProfilePfDto);
  }

  async updateProfilePj(profileId: number, updateProfilePjDto: UpdateProfilePjDto): Promise<ProfilePj> {
    const profilePj = await this.profileRepository.findProfilePj(profileId);
    if (!profilePj) {
      throw new NotFoundException('Perfil PJ não encontrado');
    }

    // Verificar se está atualizando CNPJ e se já existe
    if (updateProfilePjDto.cnpj && updateProfilePjDto.cnpj !== profilePj.cnpj) {
      const existingProfilePj = await this.profileRepository.findByCnpj(updateProfilePjDto.cnpj);
      if (existingProfilePj) {
        throw new ConflictException('CNPJ já cadastrado');
      }
    }

    return this.profileRepository.updateProfilePj(profileId, updateProfilePjDto);
  }

  async remove(id: number): Promise<void> {
    const profile = await this.profileRepository.findOne(id);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }
    
    await this.profileRepository.remove(id);
  }
} 