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
import { AddressesService } from '../services/addresses.service';
import { ProfilesService } from '../../profiles/services/profiles.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Controller('profiles/:profileId/addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Param('profileId') profileId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    const profile = await this.profilesService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para adicionar endereços a este perfil');
    }
    
    return this.addressesService.create(+profileId, createAddressDto);
  }

  @Get()
  async findAll(@Request() req, @Param('profileId') profileId: string) {
    const profile = await this.profilesService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar endereços deste perfil');
    }
    
    return this.addressesService.findAll(+profileId);
  }

  @Get('default')
  async findDefault(@Request() req, @Param('profileId') profileId: string) {
    const profile = await this.profilesService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar endereços deste perfil');
    }
    
    return this.addressesService.findDefault(+profileId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('profileId') profileId: string, @Param('id') id: string) {
    const profile = await this.profilesService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar endereços deste perfil');
    }
    
    const address = await this.addressesService.findOne(+id);
    
    // Verificar se o endereço pertence ao perfil
    if (address.profileId !== +profileId) {
      throw new ForbiddenException('Endereço não pertence a este perfil');
    }
    
    return address;
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('profileId') profileId: string,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const profile = await this.profilesService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar endereços deste perfil');
    }
    
    const address = await this.addressesService.findOne(+id);
    
    // Verificar se o endereço pertence ao perfil
    if (address.profileId !== +profileId) {
      throw new ForbiddenException('Endereço não pertence a este perfil');
    }
    
    return this.addressesService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('profileId') profileId: string, @Param('id') id: string) {
    const profile = await this.profilesService.findOne(+profileId);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para remover endereços deste perfil');
    }
    
    const address = await this.addressesService.findOne(+id);
    
    // Verificar se o endereço pertence ao perfil
    if (address.profileId !== +profileId) {
      throw new ForbiddenException('Endereço não pertence a este perfil');
    }
    
    await this.addressesService.remove(+id);
  }
} 