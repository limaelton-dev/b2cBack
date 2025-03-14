import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user/user';
import { AuthService } from 'src/services/auth/auth.service';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { JwtStrategy } from 'src/services/auth/jwt.strategy';
import { UserService } from '../services/user/user.service';
import { CartModule } from '../modules/cart.module';
import { ProfileModule } from '../modules/profile.module';
import { ProfilePFModule } from '../modules/profile_pf.module';
import { GoogleAuthService } from '../services/auth/google-auth.service';
import { GoogleAuthController } from '../controllers/auth/google-auth.controller';
import { Profile } from '../models/profile/profile';
import { Cart } from '../models/cart/cart';
import { ProfileService } from '../services/profile/profile.service';
import { ProfilePJModule } from './profile_pj.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: '1d',
        },
      }),
    }),
    TypeOrmModule.forFeature([User, Profile, Cart]),
    CartModule,
    ProfileModule,
    ProfilePFModule,
    ProfilePJModule
  ],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, JwtStrategy, UserService, GoogleAuthService, ProfileService],
  exports: [JwtStrategy, PassportModule, AuthService, JwtModule, UserService, GoogleAuthService],
})
export class AuthModule {} 