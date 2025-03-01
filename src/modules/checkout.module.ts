import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutController } from 'src/controllers/checkout/checkout.controller';
import { CheckoutValidationService } from 'src/services/checkout/checkout-validation.service';
import { Produto } from 'src/models/produto/produto';
import { Order } from 'src/models/order/order';
import { OrderItem } from 'src/models/order_item/order_item';
import { Cart } from 'src/models/cart/cart';
import { Profile } from 'src/models/profile/profile';
import { Address } from 'src/models/address/address';
import { Card } from 'src/models/card/card';
import { ProdutoService } from 'src/services/produto/produto.service';
import { OrderService } from 'src/services/order/order.service';
import { CartService } from 'src/services/cart/cart.service';
import { ProfileService } from 'src/services/profile/profile.service';
import { AddressService } from 'src/services/address/address.service';
import { CardService } from 'src/services/card/card.service';
import { MercadoPagoService } from 'src/services/mercado-pago/mercado-pago.service';
import { User } from 'src/models/user/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Produto,
      Order,
      OrderItem,
      Cart,
      Profile,
      Address,
      Card,
      User
    ]),
  ],
  controllers: [CheckoutController],
  providers: [
    CheckoutValidationService,
    ProdutoService,
    OrderService,
    CartService,
    ProfileService,
    AddressService,
    CardService,
    MercadoPagoService
  ],
  exports: [CheckoutValidationService],
})
export class CheckoutModule {} 