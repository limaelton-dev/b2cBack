import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { ProfileService } from '../../profile/services/profile.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Controller('profile/:profileId/address')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly profileService: ProfileService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Param('profileId') profileId: number,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    const profile = await this.profileService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para adicionar endereços a este perfil');
    }
    
    return this.addressService.create(+profileId, createAddressDto);
  }

  @Get()
  async findAll(@Request() req, @Param('profileId') profileId: number) {
    const profile = await this.profileService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar endereços deste perfil');
    }
    
    return this.addressService.findAll(+profileId);
  }

  @Get('default')
  async findDefault(@Request() req, @Param('profileId') profileId: number) {
    const profile = await this.profileService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar endereços deste perfil');
    }
    
    return this.addressService.findDefault(+profileId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('profileId') profileId: number, @Param('id') id: number) {
    const profile = await this.profileService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar endereços deste perfil');
    }
    
    const address = await this.addressService.findOne(+id);
    
    // Verificar se o endereço pertence ao perfil
    if (address.profileId !== +profileId) {
      throw new ForbiddenException('Endereço não pertence a este perfil');
    }
    
    return address;
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('profileId') profileId: number,
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const profile = await this.profileService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar endereços deste perfil');
    }
    
    const address = await this.addressService.findOne(+id);
    
    // Verificar se o endereço pertence ao perfil
    if (address.profileId !== +profileId) {
      throw new ForbiddenException('Endereço não pertence a este perfil');
    }
    
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('profileId') profileId: number, @Param('id') id: number) {
    const profile = await this.profileService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para remover endereços deste perfil');
    }
    
    const address = await this.addressService.findOne(+id);
    
    // Verificar se o endereço pertence ao perfil
    if (address.profileId !== +profileId) {
      throw new ForbiddenException('Endereço não pertence a este perfil');
    }
    
    await this.addressService.remove(+id);
  }
} 