import { Injectable, ConflictException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserDetailsDto } from '../dto/user-details.dto';
import { ProfileType } from '../../../common/enums/profile-type.enum';
import { plainToClass } from 'class-transformer';
import { UserProfileDto } from '../dto/user-profile.dto';
import { UserDto } from '../dto/user.dto';
import { CreateProfilePfDto } from 'src/modules/profile/dto/create-profile-pf.dto';
import { CreateProfilePjDto } from 'src/modules/profile/dto/create-profile-pj.dto';
import { ProfileService } from 'src/modules/profile/services/profile.service';
import { CreateUserWithProfileDto } from 'src/modules/user/dto/create-user-with-profile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: ProfileService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    const { email } = createUserDto;
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const user = await this.userRepository.create(createUserDto);
    
    if (!('profileType' in createUserDto)) {
      return plainToClass(UserProfileDto, user);
    }
    
    const withProfileDto = createUserDto as CreateUserWithProfileDto;
    
    if (withProfileDto.profileType === ProfileType.PF) {
      await this.profileService.createProfilePf(
        user.id, 
        withProfileDto.profile as CreateProfilePfDto
      );
    } else if (withProfileDto.profileType === ProfileType.PJ) {
      await this.profileService.createProfilePj(
        user.id, 
        withProfileDto.profile as CreateProfilePjDto
      );
    }
    
    return this.findWithProfile(user.id);
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return plainToClass(UserDto, user, { 
      excludeExtraneousValues: false 
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      
      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    await this.userRepository.remove(id);
  }

  async findWithProfile(id: number): Promise<UserProfileDto> {
    const user = await this.userRepository.findWithProfile(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    const userProfile: any = {
      id: user.id,
      email: user.email,
    };
    
    userProfile.profile = {};
    
    if (!user.profile || user.profile.length === 0) {
      return plainToClass(UserProfileDto, userProfile, { 
        excludeExtraneousValues: false 
      });
    }
    
    const profile = user.profile[0];
    userProfile.profile_type = profile.profileType;
    
    if (profile.profileType === ProfileType.PF && profile.profilePf) {
      userProfile.profile = {
        id: profile.id,
        firstName: profile.profilePf.firstName,
        lastName: profile.profilePf.lastName,
        cpf: this.maskCpf(profile.profilePf.cpf),
        birthDate: profile.profilePf.birthDate,
        gender: profile.profilePf.gender,
      };
    }
    
    if (profile.profileType === ProfileType.PJ && profile.profilePj) {
      userProfile.profile = {
        id: profile.id,
        companyName: profile.profilePj.companyName,
        cnpj: this.maskCnpj(profile.profilePj.cnpj),
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
    const user = await this.userRepository.findWithProfileDetails(id);
    
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
    
    if (!user.profile || user.profile.length === 0) {
      return plainToClass(UserDetailsDto, userDetails, { 
        excludeExtraneousValues: false 
      });
    }
    
    const profile = user.profile[0];
    userDetails.profile_type = profile.profileType;
    
    if (profile.profileType === ProfileType.PF && profile.profilePf) {
      userDetails.profile = {
        id: profile.id,
        firstName: profile.profilePf.firstName,
        lastName: profile.profilePf.lastName,
        cpf: this.maskCpf(profile.profilePf.cpf),
        birthDate: profile.profilePf.birthDate,
        gender: profile.profilePf.gender,
      };
    }
    
    if (profile.profileType === ProfileType.PJ && profile.profilePj) {
      userDetails.profile = {
        id: profile.id,
        companyName: profile.profilePj.companyName,
        cnpj: this.maskCnpj(profile.profilePj.cnpj),
        tradingName: profile.profilePj.tradingName,
        stateRegistration: profile.profilePj.stateRegistration,
        municipalRegistration: profile.profilePj.municipalRegistration,
      };
    }
    
    if (profile.address && profile.address.length > 0) {
      userDetails.address = profile.address.map(address => ({
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
    
    if (profile.phone && profile.phone.length > 0) {
      userDetails.phone = profile.phone.map(phone => ({
        id: phone.id,
        ddd: phone.ddd,
        number: phone.number,
        isDefault: phone.isDefault,
        verified: phone.verified,
      }));
    }
    
    if (profile.card && profile.card.length > 0) {
      userDetails.card = profile.card.map(card => ({
        id: card.id,
        lastFourDigits: card.lastFourDigits,
        holderName: card.holderName,
        expirationMonth: card.expirationMonth,
        expirationYear: card.expirationYear,
        isDefault: card.isDefault,
        brand: card.brand,
      }));
    }
    
    return plainToClass(UserDetailsDto, userDetails, { 
      excludeExtraneousValues: false 
    });
  }

  private maskCpf(cpf: string): string {
    if (!cpf || cpf.length < 11) {
      return cpf;
    }
    const cleaned = cpf.replace(/\D/g, '');
    return `***.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-**`;
  }

  private maskCnpj(cnpj: string): string {
    if (!cnpj || cnpj.length < 14) {
      return cnpj;
    }
    const cleaned = cnpj.replace(/\D/g, '');
    return `**.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/****-**`;
  }
}
