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
      const user = await this.userService.findOne(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado ou token inválido');
      }

      if (!payload.profileId) {
        const profiles = await this.profileService.findAllByUserId(payload.sub);
        
        if (!profiles || profiles.length === 0) {
          throw new UnauthorizedException('Usuário sem perfil associado');
        }

        const defaultProfile = profiles[0];
        
        return { 
          userId: payload.sub, 
          email: payload.email,
          profileId: defaultProfile.id,
          profileType: defaultProfile.profileType
        };
      }
      
      const profileId = typeof payload.profileId === 'number' 
        ? payload.profileId 
        : parseInt(payload.profileId);
      
      return { 
        userId: payload.sub, 
        email: payload.email,
        profileId,
        profileType: payload.profileType
      };
    } catch {
      throw new UnauthorizedException('Usuário não encontrado ou token inválido');
    }
  }
}
