import { CartService } from 'src/services/cart/cart.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProdutoController } from './controllers/produto/produto.controller';
import { ProdutoService } from './services/produto/produto.service';
import { User } from 'src/models/user/user';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { CartController } from './controllers/cart/cart.controller';
import { Cart } from 'src/models/cart/cart';
import { Produto } from './models/produto/produto';
import { ProdutoCusto } from './models/produto/produtocusto';
import { ProdutoDimensao } from './models/produto/produtodimensao';
import { ProdutoEmbalagemDimensao } from './models/produto/produtoembalagemdimensao';
import { ProdutoFabricante } from './models/produto/produtofabricante';
import { ProdutoFamilia } from './models/produto/produtofamilia';
import { ProdutoGrupo } from './models/produto/produtogrupo';
import { ProdutoImagens } from './models/produto/produtoimagens';
import { ProdutoModelo } from './models/produto/produtomodelo';
import { ProdutoPartNumber } from './models/produto/produtopartnumber';
import { ProdutoSubgrupo } from './models/produto/produtosubgrupo';
import { ProdutoTipo } from './models/produto/produtotipo';
import { CartModule } from './modules/cart.module';
import { ProfileModule } from './modules/profile.module';
import { Profile } from './models/profile/profile';
import { ProfilePFModule } from './modules/profile_pf.module';
import { ProfilePJModule } from './modules/profile_pj.module';
import { ProfilePF } from './models/profile_pf/profile_pf';
import { ProfilePJ } from './models/profile_pj/profile_pj';
import { AddressModule } from './modules/address.module';
import { CardModule } from './modules/card.module';
import { Address } from './models/address/address';
import { Card } from './models/card/card';
import { PhoneModule } from './modules/phone.module';
import { Phone } from './models/phone/phone';
import { OrderModule } from './modules/order.module';
import { Order } from './models/order/order';
import { OrderItem } from './models/order_item/order_item';
import { AuthModule } from './modules/auth.module';
import { MyAccountModule } from './modules/my-account.module';
import { JwtModule } from '@nestjs/jwt';

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
        entities: [
          Produto,
          ProdutoCusto,
          ProdutoDimensao,
          ProdutoEmbalagemDimensao,
          ProdutoFabricante,
          ProdutoFamilia,
          ProdutoGrupo,
          ProdutoImagens,
          ProdutoModelo,
          ProdutoPartNumber,
          ProdutoSubgrupo,
          ProdutoTipo,
          User,
          Profile,
          ProfilePF,
          ProfilePJ,
          Address,
          Card,
          Phone,
          Order,
          OrderItem,
          Cart
        ],
        synchronize: false,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
        entities: [Produto, User, Cart, Profile, ProfilePF, ProfilePJ, Address, Card, Phone, Order, OrderItem],
        synchronize: false,
      }),
    }),
    CartModule,
    ProfileModule,
    ProfilePFModule,
    ProfilePJModule,
    AddressModule,
    CardModule,
    PhoneModule,
    OrderModule,
    AuthModule,
    MyAccountModule,
    TypeOrmModule.forFeature([Produto, User])
  ],
  controllers: [AppController, ProdutoController, UserController],
  providers: [AppService, ProdutoService, UserService],
})
export class AppModule {}
