import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PhonesRepository } from '../repositories/phones.repository';
import { Phone } from '../entities/phone.entity';

@Injectable()
export class PhonesService {
  constructor(private readonly phonesRepository: PhonesRepository) {}

  async create(phoneData: Partial<Phone>): Promise<Phone> {
    const { ddd, number } = phoneData;
    const existingPhone = await this.phonesRepository.findByDddAndNumber(ddd, number);
    
    if (existingPhone) {
      throw new ConflictException('Telefone já está cadastrado');
    }
    
    return this.phonesRepository.create(phoneData);
  }

  async findAll(): Promise<Phone[]> {
    return this.phonesRepository.findAll();
  }

  async findOne(id: number): Promise<Phone> {
    const phone = await this.phonesRepository.findOne(id);
    
    if (!phone) {
      throw new NotFoundException('Telefone não encontrado');
    }
    
    return phone;
  }

  async findByProfileId(profileId: number): Promise<Phone[]> {
    return this.phonesRepository.findByProfileId(profileId);
  }

  async findDefaultByProfileId(profileId: number): Promise<Phone> {
    const phone = await this.phonesRepository.findDefaultByProfileId(profileId);
    
    if (!phone) {
      throw new NotFoundException('Telefone padrão não encontrado para este perfil');
    }
    
    return phone;
  }

  async update(id: number, phoneData: Partial<Phone>): Promise<Phone> {
    const phone = await this.phonesRepository.findOne(id);
    
    if (!phone) {
      throw new NotFoundException('Telefone não encontrado');
    }
    
    if (phoneData.ddd && phoneData.number && 
        (phoneData.ddd !== phone.ddd || phoneData.number !== phone.number)) {
      const existingPhone = await this.phonesRepository.findByDddAndNumber(
        phoneData.ddd, phoneData.number
      );
      
      if (existingPhone) {
        throw new ConflictException('Telefone já está cadastrado');
      }
    }
    
    return this.phonesRepository.update(id, phoneData);
  }

  async setVerified(id: number, verified: boolean = true): Promise<Phone> {
    const phone = await this.phonesRepository.findOne(id);
    
    if (!phone) {
      throw new NotFoundException('Telefone não encontrado');
    }
    
    return this.phonesRepository.setVerified(id, verified);
  }

  async remove(id: number): Promise<void> {
    const phone = await this.phonesRepository.findOne(id);
    
    if (!phone) {
      throw new NotFoundException('Telefone não encontrado');
    }
    
    await this.phonesRepository.remove(id);
  }
} 