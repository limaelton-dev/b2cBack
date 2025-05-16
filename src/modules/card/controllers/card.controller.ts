import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus, 
  UseGuards,
  ForbiddenException 
} from '@nestjs/common';
import { CardService } from '../services/card.service';
import { Card } from '../entities/card.entity';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProfileService } from '../../profile/services/profile.service';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly profileService: ProfileService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser('sub') userId: number,
    @Body() createCardDto: CreateCardDto
  ): Promise<Card> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    // Atualiza o profileId no DTO
    createCardDto.profileId = profile.id;
    
    return this.cardService.create(createCardDto);
  }

  @Get()
  async findAll(
    @GetUser('sub') userId: number
  ): Promise<Card[]> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    return this.cardService.findByProfileId(profile.id);
  }

  @Get('default')
  async findDefault(
    @GetUser('sub') userId: number
  ): Promise<Card> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    return this.cardService.findDefaultByProfileId(profile.id);
  }

  @Get(':id')
  async findOne(
    @GetUser('sub') userId: number,
    @Param('id') id: number
  ): Promise<Card> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    const card = await this.cardService.findOne(+id);
    
    // Verificar se o cartão pertence ao perfil
    if (card.profileId !== profile.id) {
      throw new ForbiddenException('Cartão não pertence a este perfil');
    }
    
    return card;
  }

  @Patch(':id')
  async update(
    @GetUser('sub') userId: number,
    @Param('id') id: number,
    @Body() updateCardDto: UpdateCardDto
  ): Promise<Card> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    const card = await this.cardService.findOne(+id);
    
    // Verificar se o cartão pertence ao perfil
    if (card.profileId !== profile.id) {
      throw new ForbiddenException('Cartão não pertence a este perfil');
    }
    
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @GetUser('sub') userId: number,
    @Param('id') id: number
  ): Promise<void> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    const card = await this.cardService.findOne(+id);
    
    // Verificar se o cartão pertence ao perfil
    if (card.profileId !== profile.id) {
      throw new ForbiddenException('Cartão não pertence a este perfil');
    }
    
    await this.cardService.remove(+id);
  }
} 