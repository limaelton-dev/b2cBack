import { Controller, Get, UseGuards, Request, Param, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ProfileService } from '../../services/profile/profile.service';
import { OrderService } from '../../services/order/order.service';
import { AddressService } from '../../services/address/address.service';
import { CardService } from '../../services/card/card.service';
import { PhoneService } from '../../services/phone/phone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('my-account')
@UseGuards(JwtAuthGuard)
export class MyAccountController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly orderService: OrderService,
    private readonly addressService: AddressService,
    private readonly cardService: CardService,
    private readonly phoneService: PhoneService,
  ) {}

  @Get()
  async getMyAccountData(@Request() req) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter dados pessoais
    const personalData = await this.profileService.getProfileDetails(userId);
    
    // Obter endereços
    const addresses = await this.addressService.findAll(profile.id);
    
    // Obter cartões
    const cards = await this.cardService.findAll(profile.id);
    
    // Obter telefones
    const phones = await this.phoneService.findAll(profile.id);
    
    // Obter pedidos
    const orders = await this.orderService.findAll(profile.id);
    
    // Retornar todos os dados em um único objeto
    return {
      personalData,
      addresses,
      cards,
      phones,
      orders,
    };
  }

  @Get('personal-data')
  async getPersonalData(@Request() req) {
    const userId = req.user.id;
    return this.profileService.getProfileDetails(userId);
  }

  @Get('addresses')
  async getAddresses(@Request() req) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    return this.addressService.findAll(profile.id);
  }

  @Get('cards')
  async getCards(@Request() req) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    return this.cardService.findAll(profile.id);
  }

  @Get('phones')
  async getPhones(@Request() req) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    return this.phoneService.findAll(profile.id);
  }

  @Get('orders')
  async getOrders(@Request() req) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    return this.orderService.findAll(profile.id);
  }

  @Get('orders/:id')
  async getOrderDetails(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter o pedido
    const order = await this.orderService.findOne(id);
    
    // Verificar se o pedido pertence ao usuário autenticado
    if (order.profile_id !== profile.id) {
      throw new ForbiddenException('Você não tem permissão para acessar este pedido');
    }
    
    return this.orderService.getOrderDetails(id);
  }
} 