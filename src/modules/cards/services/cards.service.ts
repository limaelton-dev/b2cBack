import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CardsRepository } from '../repositories/cards.repository';
import { Card } from '../entities/card.entity';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async create(cardData: Partial<Card>): Promise<Card> {
    return this.cardsRepository.create(cardData);
  }

  async findAll(): Promise<Card[]> {
    return this.cardsRepository.findAll();
  }

  async findOne(id: number): Promise<Card> {
    const card = await this.cardsRepository.findOne(id);
    
    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }
    
    return card;
  }

  async findByProfileId(profileId: number): Promise<Card[]> {
    return this.cardsRepository.findByProfileId(profileId);
  }

  async findDefaultByProfileId(profileId: number): Promise<Card> {
    const card = await this.cardsRepository.findDefaultByProfileId(profileId);
    
    if (!card) {
      throw new NotFoundException('Cartão padrão não encontrado para este perfil');
    }
    
    return card;
  }

  async update(id: number, cardData: Partial<Card>): Promise<Card> {
    const card = await this.cardsRepository.findOne(id);
    
    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }
    
    return this.cardsRepository.update(id, cardData);
  }

  async remove(id: number): Promise<void> {
    const card = await this.cardsRepository.findOne(id);
    
    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }
    
    await this.cardsRepository.remove(id);
  }
} 