import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../user/repositories/user.repository';
import { SignInDto } from '../dto/sign.in.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { CreateUserWithProfileDto } from 'src/modules/user/dto/create-user-with-profile.dto';
import { ProfileService } from 'src/modules/profile/services/profile.service';
import { ProfileType } from 'src/common/enums';
import { CreateProfilePfDto } from 'src/modules/profile/dto/create-profile-pf.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(user.id);
    
    // Verificar se o usuário tem pelo menos um perfil
    if (!profiles || profiles.length === 0) {
      throw new UnauthorizedException('Usuário sem perfil associado');
    }
    
    // Usar o primeiro perfil encontrado como padrão
    const defaultProfile = profiles[0];
    
    // Incluir o profileId no payload do token
    const payload = { 
      email: user.email, 
      sub: user.id, 
      profileId: defaultProfile.id,
      profileType: defaultProfile.profileType
    };
    
    // Para perfil PF, buscar detalhes específicos
    let userProfile = {};
    
    if (defaultProfile.profileType === ProfileType.PF) {
      const profilePf = await this.profileService.findProfilePf(defaultProfile.id);
      
      userProfile = {
        id: user.id,
        email: user.email,
        profile: {
          id: defaultProfile.id,
          firstName: profilePf.firstName,
          lastName: profilePf.lastName,
          cpf: profilePf.cpf,
          birthDate: profilePf.birthDate,
          gender: profilePf.gender
        },
        profileType: defaultProfile.profileType,
        profileId: defaultProfile.id
      };
    } else {
      const profilePj = await this.profileService.findProfilePj(defaultProfile.id);
      
      userProfile = {
        id: user.id,
        email: user.email,
        profile: {
          id: defaultProfile.id,
          companyName: profilePj.companyName,
          cnpj: profilePj.cnpj,
          tradingName: profilePj.tradingName,
          stateRegistration: profilePj.stateRegistration,
          municipalRegistration: profilePj.municipalRegistration
        },
        profileType: defaultProfile.profileType,
        profileId: defaultProfile.id
      };
    }
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userProfile
    };
  }

  async signUp(createUserDto: CreateUserDto | CreateUserWithProfileDto) {
    // Validação adicional para garantir que os campos firstName e lastName estejam presentes quando o perfil for PF
    if ('profileType' in createUserDto && createUserDto.profileType === ProfileType.PF) {
      const profileData = createUserDto.profile as CreateProfilePfDto;
      
      if (!profileData.firstName || !profileData.lastName) {
        throw new BadRequestException('Os campos firstName e lastName são obrigatórios para perfil PF');
      }
    }
    
    const user = await this.userService.create(createUserDto);
    
    // Buscar perfis do usuário recém-criado
    const profiles = await this.profileService.findAllByUserId(user.id);
    
    // Se não houver perfil, retorna apenas o token com userId
    if (!profiles || profiles.length === 0) {
      const payload = { email: user.email, sub: user.id };
      
      return {
        access_token: this.jwtService.sign(payload),
        user,
      };
    }
    
    // Usar o primeiro perfil encontrado como padrão
    const defaultProfile = profiles[0];
    
    // Incluir o profileId no payload do token
    const payload = { 
      email: user.email, 
      sub: user.id, 
      profileId: defaultProfile.id,
      profileType: defaultProfile.profileType
    };
    
    // Para perfil PF, buscar detalhes específicos
    let userProfile = {};
    
    if (defaultProfile.profileType === ProfileType.PF) {
      const profilePf = await this.profileService.findProfilePf(defaultProfile.id);
      
      userProfile = {
        id: user.id,
        email: user.email,
        profile: {
          id: defaultProfile.id,
          firstName: profilePf.firstName,
          lastName: profilePf.lastName,
          cpf: profilePf.cpf,
          birthDate: profilePf.birthDate,
          gender: profilePf.gender
        },
        profileType: defaultProfile.profileType,
        profileId: defaultProfile.id
      };
    } else {
      const profilePj = await this.profileService.findProfilePj(defaultProfile.id);
      
      userProfile = {
        id: user.id,
        email: user.email,
        profile: {
          id: defaultProfile.id,
          companyName: profilePj.companyName,
          cnpj: profilePj.cnpj,
          tradingName: profilePj.tradingName,
          stateRegistration: profilePj.stateRegistration,
          municipalRegistration: profilePj.municipalRegistration
        },
        profileType: defaultProfile.profileType,
        profileId: defaultProfile.id
      };
    }
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userProfile
    };
  }
} 