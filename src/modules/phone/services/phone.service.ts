import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PhoneRepository } from '../repositories/phone.repository';
import { Phone } from '../entities/phone.entity';

@Injectable()
export class PhoneService {
  constructor(private readonly phoneRepository: PhoneRepository) {}

  async create(phoneData: Partial<Phone>): Promise<Phone> {
    const { ddd, number } = phoneData;
    const existingPhone = await this.phoneRepository.findByDddAndNumber(ddd, number);
    
    if (existingPhone) {
      throw new ConflictException('Telefone já está cadastrado');
    }
    
    return this.phoneRepository.create(phoneData);
  }

  async findAll(): Promise<Phone[]> {
    return this.phoneRepository.findAll();
  }

  async findOne(id: number): Promise<Phone> {
    const phone = await this.phoneRepository.findOne(id);
    
    if (!phone) {
      throw new NotFoundException('Telefone não encontrado');
    }
    
    return phone;
  }

  async findByProfileId(profileId: number): Promise<Phone[]> {
    return this.phoneRepository.findByProfileId(profileId);
  }

  async findDefaultByProfileId(profileId: number): Promise<Phone> {
    const phone = await this.phoneRepository.findDefaultByProfileId(profileId);
    
    if (!phone) {
      throw new NotFoundException('Telefone padrão não encontrado para este perfil');
    }
    
    return phone;
  }

  async update(id: number, phoneData: Partial<Phone>): Promise<Phone> {
    const phone = await this.phoneRepository.findOne(id);
    
    if (!phone) {
      throw new NotFoundException('Telefone não encontrado');
    }
    
    if (phoneData.ddd && phoneData.number && 
        (phoneData.ddd !== phone.ddd || phoneData.number !== phone.number)) {
      const existingPhone = await this.phoneRepository.findByDddAndNumber(
        phoneData.ddd, phoneData.number
      );
      
      if (existingPhone) {
        throw new ConflictException('Telefone já está cadastrado');
      }
    }
    
    return this.phoneRepository.update(id, phoneData);
  }

  async setVerified(id: number, verified: boolean = true): Promise<Phone> {
    const phone = await this.phoneRepository.findOne(id);
    
    if (!phone) {
      throw new NotFoundException('Telefone não encontrado');
    }
    
    return this.phoneRepository.setVerified(id, verified);
  }

  async remove(id: number): Promise<void> {
    const phone = await this.phoneRepository.findOne(id);
    
    if (!phone) {
      throw new NotFoundException('Telefone não encontrado');
    }
    
    await this.phoneRepository.remove(id);
  }
} 