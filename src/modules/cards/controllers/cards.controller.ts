import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CardsService } from '../services/cards.service';
import { Card } from '../entities/card.entity';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCardDto: CreateCardDto): Promise<Card> {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  async findAll(): Promise<Card[]> {
    return this.cardsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Card> {
    return this.cardsService.findOne(+id);
  }

  @Get('profile/:profileId')
  async findByProfileId(@Param('profileId') profileId: number): Promise<Card[]> {
    return this.cardsService.findByProfileId(+profileId);
  }

  @Get('profile/:profileId/default')
  async findDefaultByProfileId(@Param('profileId') profileId: number): Promise<Card> {
    return this.cardsService.findDefaultByProfileId(+profileId);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto): Promise<Card> {
    return this.cardsService.update(+id, updateCardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.cardsService.remove(+id);
  }
} 