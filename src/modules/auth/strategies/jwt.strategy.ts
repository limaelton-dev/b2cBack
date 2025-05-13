import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { ProfileService } from '../../profile/services/profile.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      console.log('JWT Payload:', payload);
      console.log('Payload types:', {
        sub: typeof payload.sub,
        profileId: typeof payload.profileId,
        profileIdValue: payload.profileId,
        parsedProfileId: parseInt(payload.profileId)
      });
      
      // Verificar se o usuário existe
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado ou token inválido');
      }

      // Se o token não tiver profileId, busca do banco de dados
      if (!payload.profileId) {
        console.log('ProfileId não encontrado no token, buscando no banco de dados');
        // Buscar perfis do usuário
        const profiles = await this.profileService.findAllByUserId(payload.sub);
        
        // Verificar se o usuário tem pelo menos um perfil
        if (!profiles || profiles.length === 0) {
          throw new UnauthorizedException('Usuário sem perfil associado');
        }

        // Usar o primeiro perfil encontrado
        const defaultProfile = profiles[0];
        
        const result = { 
          userId: payload.sub, 
          email: payload.email,
          profileId: defaultProfile.id,
          profileType: defaultProfile.profileType
        };
        
        console.log('Utilizando perfil do banco de dados:', result);
        return result;
      }
      
      // Usar o profileId e profileType que vieram do token
      // Garantindo que o profileId seja um número
      const profileId = typeof payload.profileId === 'number' 
        ? payload.profileId 
        : parseInt(payload.profileId);
      
      const result = { 
        userId: payload.sub, 
        email: payload.email,
        profileId, // Usando o valor convertido
        profileType: payload.profileType
      };
      
      console.log('Utilizando perfil do token:', result);
      return result;
    } catch (error) {
      console.error('Erro na validação do token:', error);
      throw new UnauthorizedException('Usuário não encontrado ou token inválido');
    }
  }
} 