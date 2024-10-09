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
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Produto, User, Cart],
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
    TypeOrmModule.forFeature([Produto, User, Cart])
  ],
  controllers: [AppController, ProdutoController, UserController, CartController],
  providers: [AppService, ProdutoService, UserService, CartService],
})
export class AppModule {}
