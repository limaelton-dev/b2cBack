import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { CardService } from 'src/services/card/card.service';
import { ProfileService } from 'src/services/profile/profile.service';
import { Card } from 'src/models/card/card';
import { CreateCardDto } from 'src/services/card/dto/createCard.dto';
import { UpdateCardDto } from 'src/services/card/dto/updateCard.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
    constructor(
        private readonly cardService: CardService,
        private readonly profileService: ProfileService
    ) {}

    @Post()
    async create(@Request() req, @Body() createCardDto: CreateCardDto): Promise<Card> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Associar o cartão ao perfil do usuário autenticado
        createCardDto.profile_id = profile.id;
        
        return this.cardService.create(createCardDto);
    }

    @Get()
    async findAll(@Request() req): Promise<Card[]> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        return this.cardService.findAll(profile.id);
    }

    @Get(':id')
    async findOne(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Card> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o cartão
        const card = await this.cardService.findOne(id);
        
        // Verificar se o cartão pertence ao usuário autenticado
        if (card.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para acessar este cartão');
        }
        
        return card;
    }

    @Patch(':id')
    async update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCardDto: UpdateCardDto
    ): Promise<Card> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o cartão
        const card = await this.cardService.findOne(id);
        
        // Verificar se o cartão pertence ao usuário autenticado
        if (card.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para atualizar este cartão');
        }
        
        return this.cardService.update(id, updateCardDto);
    }

    @Delete(':id')
    async remove(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<void> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o cartão
        const card = await this.cardService.findOne(id);
        
        // Verificar se o cartão pertence ao usuário autenticado
        if (card.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para remover este cartão');
        }
        
        return this.cardService.remove(id);
    }

    @Patch(':id/set-default')
    async setDefault(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Card> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o cartão
        const card = await this.cardService.findOne(id);
        
        // Verificar se o cartão pertence ao usuário autenticado
        if (card.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para definir este cartão como padrão');
        }
        
        return this.cardService.setDefault(id);
    }
} 