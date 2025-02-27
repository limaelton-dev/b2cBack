import { CartService } from 'src/services/cart/cart.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProdutoController } from './controllers/produto/produto.controller';
import { ProdutoService } from './services/produto/produto.service';
import { Produto } from './models/produto/produto';
import { User } from 'src/models/user/user';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { CartController } from './controllers/cart/cart.controller';
import { Cart } from 'src/models/cart/cart';
import { CartModule } from './cart.module';
import { ProfileModule } from './profile.module';
import { Profile } from './models/profile/profile';
import { ProfilePFModule } from './profile_pf.module';
import { ProfilePJModule } from './profile_pj.module';
import { ProfilePF } from './models/profile_pf/profile_pf';
import { ProfilePJ } from './models/profile_pj/profile_pj';
import { AddressModule } from './address.module';
import { CardModule } from './card.module';
import { Address } from './models/address/address';
import { Card } from './models/card/card';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: '10.0.0.25',
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Produto, User, Cart, Profile, ProfilePF, ProfilePJ, Address, Card],
        synchronize: true,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    CartModule,
    ProfileModule,
    ProfilePFModule,
    ProfilePJModule,
    AddressModule,
    CardModule,
    TypeOrmModule.forFeature([Produto, User])
  ],
  controllers: [AppController, ProdutoController, UserController],
  providers: [AppService, ProdutoService, UserService],
})
export class AppModule {}
