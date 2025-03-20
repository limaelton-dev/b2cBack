import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressesRepository {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(addressData: Partial<Address>): Promise<Address> {
    const address = this.addressRepository.create(addressData);
    
    if (addressData.isDefault) {
      await this.unsetDefaultAddresses(addressData.profileId);
    }
    
    return this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return this.addressRepository.find({
      relations: ['profile'],
    });
  }

  async findOne(id: number): Promise<Address> {
    return this.addressRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async findByProfileId(profileId: number): Promise<Address[]> {
    return this.addressRepository.find({
      where: { profileId },
      relations: ['profile'],
    });
  }

  async findDefaultByProfileId(profileId: number): Promise<Address> {
    return this.addressRepository.findOne({
      where: {
        profileId,
        isDefault: true,
      },
      relations: ['profile'],
    });
  }

  async update(id: number, addressData: Partial<Address>): Promise<Address> {
    if (addressData.isDefault) {
      const address = await this.findOne(id);
      await this.unsetDefaultAddresses(address.profileId);
    }
    
    await this.addressRepository.update(id, addressData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    await this.addressRepository.delete(id);
    
    if (address && address.isDefault) {
      const addresses = await this.findByProfileId(address.profileId);
      if (addresses.length > 0) {
        await this.setAsDefault(addresses[0].id);
      }
    }
  }

  private async unsetDefaultAddresses(profileId: number): Promise<void> {
    await this.addressRepository.update(
      { profileId, isDefault: true },
      { isDefault: false },
    );
  }

  private async setAsDefault(id: number): Promise<void> {
    await this.addressRepository.update(id, { isDefault: true });
  }
} 