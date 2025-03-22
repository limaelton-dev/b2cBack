import { Injectable, ConflictException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserDetailsDto } from '../dto/user-details.dto';
import { ProfileType } from '../../../common/enums/profile-type.enum';
import { plainToClass } from 'class-transformer';
import { UserProfileDto } from '../dto/user-profile.dto';
import { UserDto } from '../dto/user.dto';
import { ProfilePf } from 'src/modules/profiles/entities/profile-pf.entity';
import { ProfilePj } from 'src/modules/profiles/entities/profile-pj.entity';
import { CreateProfilePfDto } from 'src/modules/profiles/dto/create-profile-pf.dto';
import { CreateProfilePjDto } from 'src/modules/profiles/dto/create-profile-pj.dto';
import { ProfilesService } from 'src/modules/profiles/services/profiles.service';
import { CreateUserWithProfileDto } from 'src/modules/users/dto/create-user-with-profile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    const { email } = createUserDto;
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const user = await this.usersRepository.create(createUserDto);
    
    // Se não for criação com perfil, retorna apenas o usuário
    if (!('profileType' in createUserDto)) {
      return plainToClass(UserProfileDto, user);
    }
    
    const withProfileDto = createUserDto as CreateUserWithProfileDto;
    
    // Cria perfil de acordo com o tipo
    if (withProfileDto.profileType === ProfileType.PF) {
      await this.profilesService.createProfilePf(
        user.id, 
        withProfileDto.profile as CreateProfilePfDto
      );
    } else if (withProfileDto.profileType === ProfileType.PJ) {
      await this.profilesService.createProfilePj(
        user.id, 
        withProfileDto.profile as CreateProfilePjDto
      );
    }
    
    // Retorna o usuário com o perfil recém-criado
    return this.findWithProfile(user.id);
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.usersRepository.findOne(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return plainToClass(UserDto, user, { 
      excludeExtraneousValues: false 
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(updateUserDto.email);
      
      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
    }

    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    await this.usersRepository.remove(id);
  }

  async findWithProfile(id: number): Promise<UserProfileDto> {
    const user = await this.usersRepository.findWithProfile(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    const userProfile: any = {
      id: user.id,
      email: user.email,
    };
    
    userProfile.profile = {};
    
    if (!user.profiles || user.profiles.length === 0) {
      return plainToClass(UserProfileDto, userProfile, { 
        excludeExtraneousValues: false 
      });
    }
    
    const profile = user.profiles[0];
    userProfile.profile_type = profile.profileType;
    
    if (profile.profileType === ProfileType.PF && profile.profilePf) {
      userProfile.profile = {
        id: profile.id,
        fullName: profile.profilePf.fullName,
        cpf: profile.profilePf.cpf,
        birthDate: profile.profilePf.birthDate,
        gender: profile.profilePf.gender,
      };
    }
    
    if (profile.profileType === ProfileType.PJ && profile.profilePj) {
      userProfile.profile = {
        id: profile.id,
        companyName: profile.profilePj.companyName,
        cnpj: profile.profilePj.cnpj,
        tradingName: profile.profilePj.tradingName,
        stateRegistration: profile.profilePj.stateRegistration,
        municipalRegistration: profile.profilePj.municipalRegistration,
      };
    }
    
    return plainToClass(UserProfileDto, userProfile, { 
      excludeExtraneousValues: false 
    });
  }

  async findWithProfileDetails(id: number): Promise<UserDetailsDto> {
    const user = await this.usersRepository.findWithProfileDetails(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    const userDetails: any = {
      id: user.id,
      email: user.email,
      address: [],
      phone: [],
      card: [],
      profile: {}
    };
    
    if (!user.profiles || user.profiles.length === 0) {
      return plainToClass(UserDetailsDto, userDetails, { 
        excludeExtraneousValues: false 
      });
    }
    
    const profile = user.profiles[0];
    userDetails.profile_type = profile.profileType;
    
    if (profile.profileType === ProfileType.PF && profile.profilePf) {
      userDetails.profile = {
        id: profile.id,
        fullName: profile.profilePf.fullName,
        cpf: profile.profilePf.cpf,
        birthDate: profile.profilePf.birthDate,
        gender: profile.profilePf.gender,
      };
    }
    
    if (profile.profileType === ProfileType.PJ && profile.profilePj) {
      userDetails.profile = {
        id: profile.id,
        companyName: profile.profilePj.companyName,
        cnpj: profile.profilePj.cnpj,
        tradingName: profile.profilePj.tradingName,
        stateRegistration: profile.profilePj.stateRegistration,
        municipalRegistration: profile.profilePj.municipalRegistration,
      };
    }
    
    if (profile.addresses && profile.addresses.length > 0) {
      userDetails.address = profile.addresses.map(address => ({
        id: address.id,
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
      }));
    }
    
    if (profile.phones && profile.phones.length > 0) {
      userDetails.phone = profile.phones.map(phone => ({
        id: phone.id,
        ddd: phone.ddd,
        number: phone.number,
        isDefault: phone.isDefault,
        verified: phone.verified,
      }));
    }
    
    if (profile.cards && profile.cards.length > 0) {
      userDetails.card = profile.cards.map(card => ({
        id: card.id,
        cardNumber: card.cardNumber,
        holderName: card.holderName,
        expirationDate: card.expirationDate,
        isDefault: card.isDefault,
        brand: card.brand,
      }));
    }
    
    return plainToClass(UserDetailsDto, userDetails, { 
      excludeExtraneousValues: false 
    });
  }

}