import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserDetailsDto } from '../dto/user-details.dto';
import { ProfileType } from '../../../common/enums/profile-type.enum';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    return this.usersRepository.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    return user;
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

  async findUserDetails(id: number): Promise<UserDetailsDto> {
    const user = await this.usersRepository.findWithDetails(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    const userDetails: any = {
      id: user.id,
      email: user.email,
    };
    
    if (user.profiles && user.profiles.length > 0) {
      const profile = user.profiles[0]; // Pega o primeiro perfil
      
      userDetails.profile_type = profile.profileType;
      
      // Preencher dados específicos do tipo de perfil
      if (profile.profileType === ProfileType.PF && profile.profilePf) {
        userDetails.profile = {
          id: profile.id,
          fullName: profile.profilePf.fullName,
          cpf: profile.profilePf.cpf,
          birthDate: profile.profilePf.birthDate,
          gender: profile.profilePf.gender,
        };
      } else if (profile.profileType === ProfileType.PJ && profile.profilePj) {
        userDetails.profile = {
          id: profile.id,
          companyName: profile.profilePj.companyName,
          cnpj: profile.profilePj.cnpj,
          tradingName: profile.profilePj.tradingName,
          stateRegistration: profile.profilePj.stateRegistration,
          municipalRegistration: profile.profilePj.municipalRegistration,
        };
      }
      
      // Mapear endereços
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
      
      // Mapear telefones
      if (profile.phones && profile.phones.length > 0) {
        userDetails.phone = profile.phones.map(phone => ({
          id: phone.id,
          ddd: phone.ddd,
          number: phone.number,
          isDefault: phone.isDefault,
          verified: phone.verified,
        }));
      }
      
      // Mapear cartões
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
    }
    
    return plainToClass(UserDetailsDto, userDetails, { 
      excludeExtraneousValues: false 
    });
  }
} 