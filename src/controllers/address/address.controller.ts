import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AddressService } from 'src/services/address/address.service';
import { ProfileService } from 'src/services/profile/profile.service';
import { Address } from 'src/models/address/address';
import { CreateAddressDto } from 'src/services/address/dto/createAddress.dto';
import { UpdateAddressDto } from 'src/services/address/dto/updateAddress.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('address')
@UseGuards(JwtAuthGuard)
export class AddressController {
    constructor(
        private readonly addressService: AddressService,
        private readonly profileService: ProfileService
    ) {}

    @Post()
    async create(@Request() req, @Body() createAddressDto: CreateAddressDto): Promise<Address> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Associar o endereço ao perfil do usuário autenticado
        createAddressDto.profile_id = profile.id;
        
        return this.addressService.create(createAddressDto);
    }

    @Get()
    async findAll(@Request() req): Promise<Address[]> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        return this.addressService.findAll(profile.id);
    }

    @Get(':id')
    async findOne(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Address> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o endereço
        const address = await this.addressService.findOne(id);
        
        // Verificar se o endereço pertence ao usuário autenticado
        if (address.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para acessar este endereço');
        }
        
        return address;
    }

    @Patch(':id')
    async update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAddressDto: UpdateAddressDto
    ): Promise<Address> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o endereço
        const address = await this.addressService.findOne(id);
        
        // Verificar se o endereço pertence ao usuário autenticado
        if (address.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para atualizar este endereço');
        }
        
        return this.addressService.update(id, updateAddressDto);
    }

    @Delete(':id')
    async remove(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<void> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o endereço
        const address = await this.addressService.findOne(id);
        
        // Verificar se o endereço pertence ao usuário autenticado
        if (address.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para remover este endereço');
        }
        
        return this.addressService.remove(id);
    }

    @Patch(':id/set-default')
    async setDefault(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Address> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o endereço
        const address = await this.addressService.findOne(id);
        
        // Verificar se o endereço pertence ao usuário autenticado
        if (address.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para definir este endereço como padrão');
        }
        
        return this.addressService.setDefault(id);
    }
} 