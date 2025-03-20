import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ProfilesRepository } from '../repositories/profiles.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { Profile } from '../entities/profile.entity';
import { ProfilePf } from '../entities/profile-pf.entity';
import { ProfilePj } from '../entities/profile-pj.entity';
import { ProfileType } from '../../../common/enums/profile-type.enum';
import { CreateProfilePfDto } from '../dto/create-profile-pf.dto';
import { CreateProfilePjDto } from '../dto/create-profile-pj.dto';
import { UpdateProfilePfDto } from '../dto/update-profile-pf.dto';
import { UpdateProfilePjDto } from '../dto/update-profile-pj.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createProfilePf(userId: number, createProfilePfDto: CreateProfilePfDto): Promise<ProfilePf> {
    // Verificar se o usuário existe
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se CPF já existe
    const existingProfilePf = await this.profilesRepository.findByCpf(createProfilePfDto.cpf);
    if (existingProfilePf) {
      throw new ConflictException('CPF já cadastrado');
    }

    // Criar perfil
    const profile = await this.profilesRepository.create({
      userId,
      profileType: ProfileType.PF,
    });

    // Criar perfil PF
    const profilePf = await this.profilesRepository.createProfilePf({
      profileId: profile.id,
      fullName: createProfilePfDto.fullName,
      cpf: createProfilePfDto.cpf,
      birthDate: createProfilePfDto.birthDate,
      gender: createProfilePfDto.gender,
    });

    return profilePf;
  }

  async createProfilePj(userId: number, createProfilePjDto: CreateProfilePjDto): Promise<ProfilePj> {
    // Verificar se o usuário existe
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se CNPJ já existe
    const existingProfilePj = await this.profilesRepository.findByCnpj(createProfilePjDto.cnpj);
    if (existingProfilePj) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    // Criar perfil
    const profile = await this.profilesRepository.create({
      userId,
      profileType: ProfileType.PJ,
    });

    // Criar perfil PJ
    const profilePj = await this.profilesRepository.createProfilePj({
      profileId: profile.id,
      companyName: createProfilePjDto.companyName,
      cnpj: createProfilePjDto.cnpj,
      tradingName: createProfilePjDto.tradingName,
      stateRegistration: createProfilePjDto.stateRegistration,
      municipalRegistration: createProfilePjDto.municipalRegistration,
    });

    return profilePj;
  }

  async findAllByUserId(userId: number): Promise<Profile[]> {
    return this.profilesRepository.findByUserId(userId);
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profilesRepository.findOne(id);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }
    return profile;
  }

  async findProfilePf(profileId: number): Promise<ProfilePf> {
    const profilePf = await this.profilesRepository.findProfilePf(profileId);
    if (!profilePf) {
      throw new NotFoundException('Perfil PF não encontrado');
    }
    return profilePf;
  }

  async findProfilePj(profileId: number): Promise<ProfilePj> {
    const profilePj = await this.profilesRepository.findProfilePj(profileId);
    if (!profilePj) {
      throw new NotFoundException('Perfil PJ não encontrado');
    }
    return profilePj;
  }

  async updateProfilePf(profileId: number, updateProfilePfDto: UpdateProfilePfDto): Promise<ProfilePf> {
    const profilePf = await this.profilesRepository.findProfilePf(profileId);
    if (!profilePf) {
      throw new NotFoundException('Perfil PF não encontrado');
    }

    // Verificar se está atualizando CPF e se já existe
    if (updateProfilePfDto.cpf && updateProfilePfDto.cpf !== profilePf.cpf) {
      const existingProfilePf = await this.profilesRepository.findByCpf(updateProfilePfDto.cpf);
      if (existingProfilePf) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    return this.profilesRepository.updateProfilePf(profileId, updateProfilePfDto);
  }

  async updateProfilePj(profileId: number, updateProfilePjDto: UpdateProfilePjDto): Promise<ProfilePj> {
    const profilePj = await this.profilesRepository.findProfilePj(profileId);
    if (!profilePj) {
      throw new NotFoundException('Perfil PJ não encontrado');
    }

    // Verificar se está atualizando CNPJ e se já existe
    if (updateProfilePjDto.cnpj && updateProfilePjDto.cnpj !== profilePj.cnpj) {
      const existingProfilePj = await this.profilesRepository.findByCnpj(updateProfilePjDto.cnpj);
      if (existingProfilePj) {
        throw new ConflictException('CNPJ já cadastrado');
      }
    }

    return this.profilesRepository.updateProfilePj(profileId, updateProfilePjDto);
  }

  async remove(id: number): Promise<void> {
    const profile = await this.profilesRepository.findOne(id);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }
    
    await this.profilesRepository.remove(id);
  }
} 