import { Injectable, NotFoundException } from '@nestjs/common';
import { CardRepository } from '../repositories/card.repository';
import { Card } from '../entities/card.entity';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(private readonly cardRepository: CardRepository) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const cardData: Partial<Card> = {
      ...createCardDto,
      holderName: this.maskHolderName(createCardDto.holderName),
    };

    return this.cardRepository.create(cardData);
  }

  async findOne(id: number): Promise<Card> {
    const card = await this.cardRepository.findOne(id);

    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }

    return card;
  }

  async findByProfileId(profileId: number): Promise<Card[]> {
    return this.cardRepository.findByProfileId(profileId);
  }

  async findDefaultByProfileId(profileId: number): Promise<Card> {
    const card = await this.cardRepository.findDefaultByProfileId(profileId);

    if (!card) {
      throw new NotFoundException('Cartão padrão não encontrado para este perfil');
    }

    return card;
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.cardRepository.findOne(id);

    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }

    const updateData: Partial<Card> = { ...updateCardDto };

    if (updateCardDto.holderName) {
      updateData.holderName = this.maskHolderName(updateCardDto.holderName);
    }

    return this.cardRepository.update(id, updateData);
  }

  async remove(id: number): Promise<void> {
    const card = await this.cardRepository.findOne(id);

    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }

    await this.cardRepository.remove(id);
  }

  private maskHolderName(name: string): string {
    const parts = name.trim().split(' ').filter(p => p.length > 0);

    if (parts.length === 0) {
      return '';
    }

    if (parts.length === 1) {
      return parts[0].toUpperCase();
    }

    const firstName = parts[0].toUpperCase();
    const lastInitial = parts[parts.length - 1][0].toUpperCase();

    return `${firstName} ${lastInitial}.`;
  }
}
