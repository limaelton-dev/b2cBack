import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from 'src/models/card/card';
import { CreateCardDto } from './dto/createCard.dto';
import { UpdateCardDto } from './dto/updateCard.dto';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private readonly cardRepository: Repository<Card>,
        private readonly profileService: ProfileService,
    ) {}

    async create(createCardDto: CreateCardDto): Promise<Card> {
        // Verificar se o perfil existe
        await this.profileService.findById(createCardDto.profile_id);
        
        // Se o CVV estiver presente, não validamos os últimos 4 dígitos
        // pois estamos usando o campo last_four_digits para armazenar o CVV
        if (!createCardDto.cvv) {
            // Validar se os últimos 4 dígitos correspondem ao número do cartão
            this.validateLastFourDigits(createCardDto.card_number, createCardDto.last_four_digits);
        }
        
        // Se o cartão for definido como padrão, desmarcar outros cartões padrão
        if (createCardDto.is_default) {
            await this.unsetDefaultCards(createCardDto.profile_id);
        }
        
        const card = this.cardRepository.create(createCardDto);
        return this.cardRepository.save(card);
    }

    async findAll(profileId: number): Promise<Card[]> {
        return this.cardRepository.find({
            where: { profile_id: profileId },
            order: { is_default: 'DESC', created_at: 'DESC' }
        });
    }

    async findOne(id: number): Promise<Card> {
        const card = await this.cardRepository.findOne({
            where: { id },
            relations: ['profile']
        });
        
        if (!card) {
            throw new NotFoundException(`Cartão com ID ${id} não encontrado`);
        }
        
        return card;
    }

    async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
        const card = await this.findOne(id);
        
        // Se o CVV estiver presente, não validamos os últimos 4 dígitos
        // pois estamos usando o campo last_four_digits para armazenar o CVV
        if (!updateCardDto.cvv) {
            // Validar se os últimos 4 dígitos correspondem ao número do cartão, se ambos forem fornecidos
            if (updateCardDto.card_number && updateCardDto.last_four_digits) {
                this.validateLastFourDigits(updateCardDto.card_number, updateCardDto.last_four_digits);
            } else if (updateCardDto.card_number) {
                // Se apenas o número do cartão for atualizado, atualizar os últimos 4 dígitos
                updateCardDto.last_four_digits = updateCardDto.card_number.slice(-4);
            }
        }
        
        // Se o cartão for definido como padrão, desmarcar outros cartões padrão
        if (updateCardDto.is_default) {
            await this.unsetDefaultCards(card.profile_id);
        }
        
        Object.assign(card, updateCardDto);
        
        return this.cardRepository.save(card);
    }

    async remove(id: number): Promise<void> {
        const card = await this.findOne(id);
        await this.cardRepository.remove(card);
    }

    async setDefault(id: number): Promise<Card> {
        const card = await this.findOne(id);
        
        // Desmarcar outros cartões padrão
        await this.unsetDefaultCards(card.profile_id);
        
        // Marcar este cartão como padrão
        card.is_default = true;
        
        return this.cardRepository.save(card);
    }

    private async unsetDefaultCards(profileId: number): Promise<void> {
        await this.cardRepository.update(
            { profile_id: profileId, is_default: true },
            { is_default: false }
        );
    }

    private validateLastFourDigits(cardNumber: string, lastFourDigits: string): void {
        const actualLastFour = cardNumber.slice(-4);
        if (actualLastFour !== lastFourDigits) {
            throw new BadRequestException('Os últimos 4 dígitos não correspondem ao número do cartão');
        }
    }
} 