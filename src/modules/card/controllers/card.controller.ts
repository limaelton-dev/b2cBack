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
  ForbiddenException,
  ParseIntPipe
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
    const profile = await this.getProfileForUser(userId);
    createCardDto.profileId = profile.id;
    return this.cardService.create(createCardDto);
  }

  @Get()
  async findAll(@GetUser('sub') userId: number): Promise<Card[]> {
    const profile = await this.getProfileForUser(userId);
    return this.cardService.findByProfileId(profile.id);
  }

  @Get('default')
  async findDefault(@GetUser('sub') userId: number): Promise<Card> {
    const profile = await this.getProfileForUser(userId);
    return this.cardService.findDefaultByProfileId(profile.id);
  }

  @Get(':id')
  async findOne(
    @GetUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Card> {
    const profile = await this.getProfileForUser(userId);
    const card = await this.cardService.findOne(id);
    this.validateCardOwnership(card, profile.id);
    return card;
  }

  @Patch(':id')
  async update(
    @GetUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto
  ): Promise<Card> {
    const profile = await this.getProfileForUser(userId);
    const card = await this.cardService.findOne(id);
    this.validateCardOwnership(card, profile.id);
    return this.cardService.update(id, updateCardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @GetUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    const profile = await this.getProfileForUser(userId);
    const card = await this.cardService.findOne(id);
    this.validateCardOwnership(card, profile.id);
    await this.cardService.remove(id);
  }

  private async getProfileForUser(userId: number) {
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    return profiles[0];
  }

  private validateCardOwnership(card: Card, profileId: number): void {
    if (card.profileId !== profileId) {
      throw new ForbiddenException('Cartão não pertence a este perfil');
    }
  }
}
