import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { PhoneService } from 'src/services/phone/phone.service';
import { ProfileService } from 'src/services/profile/profile.service';
import { Phone } from 'src/models/phone/phone';
import { CreatePhoneDto } from 'src/services/phone/dto/createPhone.dto';
import { UpdatePhoneDto } from 'src/services/phone/dto/updatePhone.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('phone')
@UseGuards(JwtAuthGuard)
export class PhoneController {
    constructor(
        private readonly phoneService: PhoneService,
        private readonly profileService: ProfileService
    ) {}

    @Post()
    async create(@Request() req, @Body() createPhoneDto: CreatePhoneDto): Promise<Phone> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Associar o telefone ao perfil do usuário autenticado
        createPhoneDto.profile_id = profile.id;
        
        return this.phoneService.create(createPhoneDto);
    }

    @Get()
    async findAll(@Request() req): Promise<Phone[]> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        return this.phoneService.findAll(profile.id);
    }

    @Get(':id')
    async findOne(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Phone> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o telefone
        const phone = await this.phoneService.findOne(id);
        
        // Verificar se o telefone pertence ao usuário autenticado
        if (phone.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para acessar este telefone');
        }
        
        return phone;
    }

    @Patch(':id')
    async update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePhoneDto: UpdatePhoneDto
    ): Promise<Phone> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o telefone
        const phone = await this.phoneService.findOne(id);
        
        // Verificar se o telefone pertence ao usuário autenticado
        if (phone.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para atualizar este telefone');
        }
        
        return this.phoneService.update(id, updatePhoneDto);
    }

    @Delete(':id')
    async remove(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<void> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o telefone
        const phone = await this.phoneService.findOne(id);
        
        // Verificar se o telefone pertence ao usuário autenticado
        if (phone.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para remover este telefone');
        }
        
        return this.phoneService.remove(id);
    }

    @Patch(':id/set-primary')
    async setPrimary(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Phone> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o telefone
        const phone = await this.phoneService.findOne(id);
        
        // Verificar se o telefone pertence ao usuário autenticado
        if (phone.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para definir este telefone como primário');
        }
        
        return this.phoneService.setPrimary(id);
    }
} 