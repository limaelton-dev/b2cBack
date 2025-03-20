import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phone } from '../entities/phone.entity';

@Injectable()
export class PhonesRepository {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}

  async create(phoneData: Partial<Phone>): Promise<Phone> {
    const phone = this.phoneRepository.create(phoneData);
    
    if (phoneData.isDefault) {
      await this.unsetDefaultPhones(phoneData.profileId);
    }
    
    return this.phoneRepository.save(phone);
  }

  async findAll(): Promise<Phone[]> {
    return this.phoneRepository.find({
      relations: ['profile'],
    });
  }

  async findOne(id: number): Promise<Phone> {
    return this.phoneRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async findByProfileId(profileId: number): Promise<Phone[]> {
    return this.phoneRepository.find({
      where: { profileId },
      relations: ['profile'],
    });
  }

  async findDefaultByProfileId(profileId: number): Promise<Phone> {
    return this.phoneRepository.findOne({
      where: {
        profileId,
        isDefault: true,
      },
      relations: ['profile'],
    });
  }

  async findByDddAndNumber(ddd: string, number: string): Promise<Phone> {
    return this.phoneRepository.findOne({
      where: { ddd, number },
      relations: ['profile'],
    });
  }

  async update(id: number, phoneData: Partial<Phone>): Promise<Phone> {
    if (phoneData.isDefault) {
      const phone = await this.findOne(id);
      await this.unsetDefaultPhones(phone.profileId);
    }
    
    await this.phoneRepository.update(id, phoneData);
    return this.findOne(id);
  }

  async setVerified(id: number, verified: boolean = true): Promise<Phone> {
    await this.phoneRepository.update(id, { verified });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const phone = await this.findOne(id);
    await this.phoneRepository.delete(id);
    
    if (phone && phone.isDefault) {
      const phones = await this.findByProfileId(phone.profileId);
      if (phones.length > 0) {
        await this.setAsDefault(phones[0].id);
      }
    }
  }

  private async unsetDefaultPhones(profileId: number): Promise<void> {
    await this.phoneRepository.update(
      { profileId, isDefault: true },
      { isDefault: false },
    );
  }

  private async setAsDefault(id: number): Promise<void> {
    await this.phoneRepository.update(id, { isDefault: true });
  }
} 