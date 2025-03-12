import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../models/user/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from '../profile/profile.service';
import { CreateProfileDto } from '../profile/dto/createProfile.dto';

@Injectable()
export class GoogleAuthService {
  private readonly oAuth2Client: OAuth2Client;
  private readonly logger = new Logger(GoogleAuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly profileService: ProfileService,
  ) {
    this.oAuth2Client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async validateGoogleToken(token: string) {
    try {
      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new UnauthorizedException('Token inválido');
      }

      let user = await this.userRepository.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        // Criar novo usuário
        this.logger.log(`Criando novo usuário com Google: ${payload.email}`);
        user = this.userRepository.create({
          email: payload.email,
          name: payload.given_name || '',
          lastname: payload.family_name || '',
          username: payload.email.split('@')[0],
          // Gerar uma senha aleatória para usuários do Google
          password: Math.random().toString(36).slice(-8),
        });

        user = await this.userRepository.save(user);

        try {
          // Criar perfil base do tipo PF automaticamente
          this.logger.log(`Criando perfil PF para o usuário Google ID: ${user.id}`);
          const createProfileDto: CreateProfileDto = {
            user_id: user.id,
            profile_type: 'PF'
          };
          
          await this.profileService.create(createProfileDto);
          this.logger.log(`Perfil PF criado com sucesso para o usuário Google ID: ${user.id}`);
        } catch (error) {
          this.logger.error(`Erro ao criar perfil para o usuário Google: ${error.message}`, error.stack);
          // Não vamos falhar o login se o perfil falhar
        }
      }

      const jwtPayload = { sub: user.id };
      const accessToken = this.jwtService.sign(jwtPayload);

      return {
        status: 200,
        token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('Erro na autenticação do Google:', error);
      throw new UnauthorizedException('Falha na autenticação com Google');
    }
  }
} 