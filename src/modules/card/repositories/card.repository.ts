import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../entities/card.entity';

@Injectable()
export class CardRepository {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async create(cardData: Partial<Card>): Promise<Card> {
    const card = this.cardRepository.create(cardData);
    
    if (cardData.isDefault) {
      await this.unsetDefaultCard(cardData.profileId);
    }
    
    return this.cardRepository.save(card);
  }

  async findOne(id: number): Promise<Card> {
    return this.cardRepository.findOne({
      where: { id },
    });
  }

  async findByProfileId(profileId: number): Promise<Card[]> {
    return this.cardRepository.find({
      where: { profileId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findDefaultByProfileId(profileId: number): Promise<Card> {
    return this.cardRepository.findOne({
      where: {
        profileId,
        isDefault: true,
      },
    });
  }

  async findByToken(cardToken: string): Promise<Card> {
    return this.cardRepository.findOne({
      where: { cardToken },
    });
  }

  async update(id: number, cardData: Partial<Card>): Promise<Card> {
    if (cardData.isDefault) {
      const card = await this.findOne(id);
      await this.unsetDefaultCard(card.profileId);
    }
    
    await this.cardRepository.update(id, cardData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const card = await this.findOne(id);
    await this.cardRepository.delete(id);
    
    if (card && card.isDefault) {
      const cards = await this.findByProfileId(card.profileId);
      if (cards.length > 0) {
        await this.setAsDefault(cards[0].id);
      }
    }
  }

  private async unsetDefaultCard(profileId: number): Promise<void> {
    await this.cardRepository.update(
      { profileId, isDefault: true },
      { isDefault: false },
    );
  }

  private async setAsDefault(id: number): Promise<void> {
    await this.cardRepository.update(id, { isDefault: true });
  }
}
