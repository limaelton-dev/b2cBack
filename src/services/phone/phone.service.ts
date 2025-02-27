import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phone } from 'src/models/phone/phone';
import { CreatePhoneDto } from './dto/createPhone.dto';
import { UpdatePhoneDto } from './dto/updatePhone.dto';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class PhoneService {
    constructor(
        @InjectRepository(Phone)
        private readonly phoneRepository: Repository<Phone>,
        private readonly profileService: ProfileService,
    ) {}

    async create(createPhoneDto: CreatePhoneDto): Promise<Phone> {
        // Verificar se o perfil existe
        await this.profileService.findById(createPhoneDto.profile_id);
        
        // Se o telefone for definido como primário, desmarcar outros telefones primários
        if (createPhoneDto.is_primary) {
            await this.unsetPrimaryPhones(createPhoneDto.profile_id);
        }
        
        const phone = this.phoneRepository.create(createPhoneDto);
        return this.phoneRepository.save(phone);
    }

    async findAll(profileId: number): Promise<Phone[]> {
        return this.phoneRepository.find({
            where: { profile_id: profileId },
            order: { is_primary: 'DESC', created_at: 'DESC' }
        });
    }

    async findOne(id: number): Promise<Phone> {
        const phone = await this.phoneRepository.findOne({
            where: { id },
            relations: ['profile']
        });
        
        if (!phone) {
            throw new NotFoundException(`Telefone com ID ${id} não encontrado`);
        }
        
        return phone;
    }

    async update(id: number, updatePhoneDto: UpdatePhoneDto): Promise<Phone> {
        const phone = await this.findOne(id);
        
        // Se o telefone for definido como primário, desmarcar outros telefones primários
        if (updatePhoneDto.is_primary) {
            await this.unsetPrimaryPhones(phone.profile_id);
        }
        
        Object.assign(phone, updatePhoneDto);
        
        return this.phoneRepository.save(phone);
    }

    async remove(id: number): Promise<void> {
        const phone = await this.findOne(id);
        await this.phoneRepository.remove(phone);
    }

    async setPrimary(id: number): Promise<Phone> {
        const phone = await this.findOne(id);
        
        // Desmarcar outros telefones primários
        await this.unsetPrimaryPhones(phone.profile_id);
        
        // Marcar este telefone como primário
        phone.is_primary = true;
        
        return this.phoneRepository.save(phone);
    }

    private async unsetPrimaryPhones(profileId: number): Promise<void> {
        await this.phoneRepository.update(
            { profile_id: profileId, is_primary: true },
            { is_primary: false }
        );
    }
} 