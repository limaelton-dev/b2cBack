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
import { UserProfileDto } from 'src/modules/user/dto/user-profile.dto';
import { UserProfileDetailsDto } from 'src/modules/user/dto/user-profile-details.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async createProfilePf(userId: number, createProfilePfDto: CreateProfilePfDto): Promise<ProfilePf> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const existingProfilePf = await this.profileRepository.findByCpf(createProfilePfDto.cpf);
    if (existingProfilePf) {
      throw new ConflictException('CPF já cadastrado');
    }

    return this.dataSource.transaction(async (manager) => {
      const profileRepo = manager.getRepository(Profile);
      const profilePfRepo = manager.getRepository(ProfilePf);

      const profile = profileRepo.create({
        userId,
        profileType: ProfileType.PF,
      });
      const savedProfile = await profileRepo.save(profile);

      const profilePf = profilePfRepo.create({
        profileId: savedProfile.id,
        firstName: createProfilePfDto.firstName,
        lastName: createProfilePfDto.lastName,
        cpf: createProfilePfDto.cpf,
        birthDate: createProfilePfDto.birthDate,
        gender: createProfilePfDto.gender,
      });

      return profilePfRepo.save(profilePf);
    });
  }

  async createProfilePj(userId: number, createProfilePjDto: CreateProfilePjDto): Promise<ProfilePj> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const existingProfilePj = await this.profileRepository.findByCnpj(createProfilePjDto.cnpj);
    if (existingProfilePj) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    return this.dataSource.transaction(async (manager) => {
      const profileRepo = manager.getRepository(Profile);
      const profilePjRepo = manager.getRepository(ProfilePj);

      const profile = profileRepo.create({
        userId,
        profileType: ProfileType.PJ,
      });
      const savedProfile = await profileRepo.save(profile);

      const profilePj = profilePjRepo.create({
        profileId: savedProfile.id,
        companyName: createProfilePjDto.companyName,
        cnpj: createProfilePjDto.cnpj,
        tradingName: createProfilePjDto.tradingName,
        stateRegistration: createProfilePjDto.stateRegistration,
        municipalRegistration: createProfilePjDto.municipalRegistration,
      });

      return profilePjRepo.save(profilePj);
    });
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
    const profile = await this.profileRepository.findOne(id);
    
    if (!profile) {
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