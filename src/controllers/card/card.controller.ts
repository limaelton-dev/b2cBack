import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CardService } from 'src/services/card/card.service';
import { Card } from 'src/models/card/card';
import { CreateCardDto } from 'src/services/card/dto/createCard.dto';
import { UpdateCardDto } from 'src/services/card/dto/updateCard.dto';

@Controller('card')
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @Post()
    async create(@Body() createCardDto: CreateCardDto): Promise<Card> {
        return this.cardService.create(createCardDto);
    }

    @Get('profile/:profileId')
    async findAll(@Param('profileId', ParseIntPipe) profileId: number): Promise<Card[]> {
        return this.cardService.findAll(profileId);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Card> {
        return this.cardService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCardDto: UpdateCardDto
    ): Promise<Card> {
        return this.cardService.update(id, updateCardDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.cardService.remove(id);
    }

    @Patch(':id/set-default')
    async setDefault(@Param('id', ParseIntPipe) id: number): Promise<Card> {
        return this.cardService.setDefault(id);
    }
} 