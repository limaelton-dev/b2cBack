import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { ProfilesService } from '../../profiles/services/profiles.service';
import { CreateUserWithProfileDto } from '../dto/create-user-with-profile.dto';
import { ProfileType } from '../../../common/enums/profile-type.enum';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserRegistrationService {
  constructor(
    private readonly usersService: UserService,
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * Registra um novo usuário com perfil (PF ou PJ) em uma única operação
   */
  async registerUserWithProfile(createUserWithProfileDto: CreateUserWithProfileDto): Promise<UserDto> {
    const { email, password, profileType, profilePfData, profilePjData } = createUserWithProfileDto;

    // Validar que os dados do perfil correspondem ao tipo de perfil
    this.validateProfileData(profileType, profilePfData, profilePjData);

    // Criar o usuário base
    const user = await this.usersService.create({ email, password });

    try {
      // Criar o perfil específico com base no tipo
      if (profileType === ProfileType.PF && profilePfData) {
        await this.profilesService.createProfilePf(user.id, profilePfData);
      } else if (profileType === ProfileType.PJ && profilePjData) {
        await this.profilesService.createProfilePj(user.id, profilePjData);
      }

      // Retornar o usuário com seus perfis
      return this.usersService.findOne(user.id);
    } catch (error) {
      // Se ocorrer um erro na criação do perfil, tentar remover o usuário para evitar órfãos
      await this.usersService.remove(user.id).catch(() => {
        // Silenciar erro caso a remoção falhe (pode já ter sido removido)
      });
      throw error;
    }
  }

  /**
   * Valida se os dados do perfil correspondem ao tipo de perfil selecionado
   */
  private validateProfileData(
    profileType: ProfileType,
    profilePfData?: any,
    profilePjData?: any,
  ): void {
    if (profileType === ProfileType.PF && !profilePfData) {
      throw new BadRequestException('Dados de perfil PF são obrigatórios para o tipo de perfil PF');
    }

    if (profileType === ProfileType.PJ && !profilePjData) {
      throw new BadRequestException('Dados de perfil PJ são obrigatórios para o tipo de perfil PJ');
    }

    if (profileType === ProfileType.PF && profilePjData) {
      throw new BadRequestException('Tipo de perfil PF não deve incluir dados de perfil PJ');
    }

    if (profileType === ProfileType.PJ && profilePfData) {
      throw new BadRequestException('Tipo de perfil PJ não deve incluir dados de perfil PF');
    }
  }
} 