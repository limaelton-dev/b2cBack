import { Controller, Get, UseGuards, Request, Param, ParseIntPipe, ForbiddenException, Patch, Body, Put, Post, Delete, ConflictException } from '@nestjs/common';
import { ProfileService } from '../../services/profile/profile.service';
import { OrderService } from '../../services/order/order.service';
import { AddressService } from '../../services/address/address.service';
import { CardService } from '../../services/card/card.service';
import { PhoneService } from '../../services/phone/phone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfilePFService } from '../../services/profile_pf/profile_pf.service';
import { UpdateProfilePFDto } from '../../services/profile_pf/dto/updateProfilePF.dto';
import { UpdatePhoneDto } from '../../services/phone/dto/updatePhone.dto';
import { CreatePhoneDto } from '../../services/phone/dto/createPhone.dto';
import { UserService } from '../../services/user/user.service';
import { UpdateUserDto } from '../../services/user/dto/updateUser.dto';
import { CreateAddressDto } from '../../services/address/dto/createAddress.dto';
import { UpdateAddressDto } from '../../services/address/dto/updateAddress.dto';
import { CreateCardDto } from '../../services/card/dto/createCard.dto';
import { UpdateCardDto } from '../../services/card/dto/updateCard.dto';

@Controller('my-account')
@UseGuards(JwtAuthGuard)
export class MyAccountController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly orderService: OrderService,
    private readonly addressService: AddressService,
    private readonly cardService: CardService,
    private readonly phoneService: PhoneService,
    private readonly profilePFService: ProfilePFService,
    private readonly userService: UserService,
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

  @Patch('update-profile')
  async updateProfile(@Request() req, @Body() updateProfilePFDto: UpdateProfilePFDto) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Atualiza os dados do perfil PF
    return this.profilePFService.update(profile.id, updateProfilePFDto);
  }

  @Patch('update-phone/:id')
  async updatePhone(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePhoneDto: UpdatePhoneDto
  ) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter o telefone
    const phone = await this.phoneService.findOne(id);
    
    // Verificar se o telefone pertence ao usuário autenticado
    if (phone.profile_id !== profile.id) {
      throw new ForbiddenException('Você não tem permissão para atualizar este telefone');
    }
    
    return this.phoneService.update(id, updatePhoneDto);
  }

  @Post('add-phone')
  async addPhone(@Request() req, @Body() createPhoneDto: CreatePhoneDto) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Associar o telefone ao perfil do usuário autenticado
    createPhoneDto.profile_id = profile.id;
    
    return this.phoneService.create(createPhoneDto);
  }

  @Delete('remove-phone/:id')
  async removePhone(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter o telefone
    const phone = await this.phoneService.findOne(id);
    
    // Verificar se o telefone pertence ao usuário autenticado
    if (phone.profile_id !== profile.id) {
      throw new ForbiddenException('Você não tem permissão para remover este telefone');
    }
    
    return this.phoneService.remove(id);
  }

  @Patch('set-primary-phone/:id')
  async setPrimaryPhone(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter o telefone
    const phone = await this.phoneService.findOne(id);
    
    // Verificar se o telefone pertence ao usuário autenticado
    if (phone.profile_id !== profile.id) {
      throw new ForbiddenException('Você não tem permissão para definir este telefone como primário');
    }
    
    return this.phoneService.setPrimary(id);
  }

  @Patch('update-user')
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Post('add-address')
  async addAddress(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Associar o endereço ao perfil do usuário autenticado
    createAddressDto.profile_id = profile.id;
    
    return this.addressService.create(createAddressDto);
  }

  @Patch('update-address/:id')
  async updateAddress(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto
  ) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter o endereço
    const address = await this.addressService.findOne(id);
    
    // Verificar se o endereço pertence ao usuário autenticado
    if (address.profile_id !== profile.id) {
      throw new ForbiddenException('Você não tem permissão para atualizar este endereço');
    }
    
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete('remove-address/:id')
  async removeAddress(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter o endereço
    const address = await this.addressService.findOne(id);
    
    // Verificar se o endereço pertence ao usuário autenticado
    if (address.profile_id !== profile.id) {
      throw new ForbiddenException('Você não tem permissão para remover este endereço');
    }
    
    try {
      await this.addressService.remove(id);
      return { message: 'Endereço removido com sucesso' };
    } catch (error) {
      if (error instanceof ConflictException) {
        // Retornar o erro de conflito com status 409
        throw error;
      }
      throw error;
    }
  }

  @Patch('set-default-address/:id')
  async setDefaultAddress(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter o endereço
    const address = await this.addressService.findOne(id);
    
    // Verificar se o endereço pertence ao usuário autenticado
    if (address.profile_id !== profile.id) {
      throw new ForbiddenException('Você não tem permissão para definir este endereço como padrão');
    }
    
    return this.addressService.setDefault(id);
  }

  @Post('add-card')
  async addCard(@Request() req, @Body() createCardDto: CreateCardDto) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Associar o cartão ao perfil do usuário autenticado
    createCardDto.profile_id = profile.id;
    
    return this.cardService.create(createCardDto);
  }

  @Patch('update-card/:id')
  async updateCard(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto
  ) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter o cartão
    const card = await this.cardService.findOne(id);
    
    // Verificar se o cartão pertence ao usuário autenticado
    if (card.profile_id !== profile.id) {
      throw new ForbiddenException('Você não tem permissão para atualizar este cartão');
    }
    
    return this.cardService.update(id, updateCardDto);
  }

  @Delete('remove-card/:id')
  async removeCard(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter o cartão
    const card = await this.cardService.findOne(id);
    
    // Verificar se o cartão pertence ao usuário autenticado
    if (card.profile_id !== profile.id) {
      throw new ForbiddenException('Você não tem permissão para remover este cartão');
    }
    
    try {
      await this.cardService.remove(id);
      return { message: 'Cartão removido com sucesso' };
    } catch (error) {
      throw error;
    }
  }

  @Patch('set-default-card/:id')
  async setDefaultCard(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    const profile = await this.profileService.findByUserId(userId);
    
    // Obter o cartão
    const card = await this.cardService.findOne(id);
    
    // Verificar se o cartão pertence ao usuário autenticado
    if (card.profile_id !== profile.id) {
      throw new ForbiddenException('Você não tem permissão para definir este cartão como padrão');
    }
    
    return this.cardService.setDefault(id);
  }
} 