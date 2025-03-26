import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CardRepository } from '../repositories/card.repository';
import { Card } from '../entities/card.entity';

@Injectable()
export class CardService {
  constructor(private readonly cardRepository: CardRepository) {}

  async create(cardData: Partial<Card>): Promise<Card> {
    return this.cardRepository.create(cardData);
  }

  async findAll(): Promise<Card[]> {
    return this.cardRepository.findAll();
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

  async update(id: number, cardData: Partial<Card>): Promise<Card> {
    const card = await this.cardRepository.findOne(id);
    
    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }
    
    return this.cardRepository.update(id, cardData);
  }

  async remove(id: number): Promise<void> {
    const card = await this.cardRepository.findOne(id);
    
    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }
    
    await this.cardRepository.remove(id);
  }
} 