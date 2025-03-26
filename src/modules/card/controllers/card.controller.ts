import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CardService } from '../services/card.service';
import { Card } from '../entities/card.entity';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCardDto: CreateCardDto): Promise<Card> {
    return this.cardService.create(createCardDto);
  }

  @Get()
  async findAll(): Promise<Card[]> {
    return this.cardService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Card> {
    return this.cardService.findOne(+id);
  }

  @Get('profile/:profileId')
  async findByProfileId(@Param('profileId') profileId: number): Promise<Card[]> {
    return this.cardService.findByProfileId(+profileId);
  }

  @Get('profile/:profileId/default')
  async findDefaultByProfileId(@Param('profileId') profileId: number): Promise<Card> {
    return this.cardService.findDefaultByProfileId(+profileId);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto): Promise<Card> {
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.cardService.remove(+id);
  }
} 