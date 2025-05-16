import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { ProfileService } from '../../profile/services/profile.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('address')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly profileService: ProfileService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser('sub') userId: number,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    return this.addressService.create(profile.id, createAddressDto);
  }

  @Get()
  async findAll(@GetUser('sub') userId: number) {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    return this.addressService.findAll(profile.id);
  }

  @Get('default')
  async findDefault(@GetUser('sub') userId: number) {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    return this.addressService.findDefault(profile.id);
  }

  @Get(':id')
  async findOne(@GetUser('sub') userId: number, @Param('id') id: number) {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    const address = await this.addressService.findOne(+id);
    
    // Verificar se o endereço pertence ao perfil
    if (address.profileId !== profile.id) {
      throw new ForbiddenException('Endereço não pertence a este perfil');
    }
    
    return address;
  }

  @Put(':id')
  async update(
    @GetUser('sub') userId: number,
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    const address = await this.addressService.findOne(+id);
    
    // Verificar se o endereço pertence ao perfil
    if (address.profileId !== profile.id) {
      throw new ForbiddenException('Endereço não pertence a este perfil');
    }
    
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@GetUser('sub') userId: number, @Param('id') id: number) {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    const address = await this.addressService.findOne(+id);
    
    // Verificar se o endereço pertence ao perfil
    if (address.profileId !== profile.id) {
      throw new ForbiddenException('Endereço não pertence a este perfil');
    }
    
    await this.addressService.remove(+id);
  }
} 