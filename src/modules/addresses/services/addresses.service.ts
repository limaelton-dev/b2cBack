import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressesRepository } from '../repositories/addresses.repository';
import { ProfilesRepository } from '../../profiles/repositories/profiles.repository';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(
    private readonly addressesRepository: AddressesRepository,
    private readonly profilesRepository: ProfilesRepository,
  ) {}

  async create(profileId: number, createAddressDto: CreateAddressDto): Promise<Address> {
    // Verificar se o perfil existe
    const profile = await this.profilesRepository.findOne(profileId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    // Criar endereço
    return this.addressesRepository.create({
      profileId,
      street: createAddressDto.street,
      number: createAddressDto.number,
      complement: createAddressDto.complement,
      neighborhood: createAddressDto.neighborhood,
      city: createAddressDto.city,
      state: createAddressDto.state,
      zipCode: createAddressDto.zipCode,
      isDefault: createAddressDto.isDefault || false,
    });
  }

  async findAll(profileId: number): Promise<Address[]> {
    // Verificar se o perfil existe
    const profile = await this.profilesRepository.findOne(profileId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return this.addressesRepository.findByProfileId(profileId);
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressesRepository.findOne(id);
    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }
    return address;
  }

  async findDefault(profileId: number): Promise<Address> {
    // Verificar se o perfil existe
    const profile = await this.profilesRepository.findOne(profileId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const address = await this.addressesRepository.findDefaultByProfileId(profileId);
    if (!address) {
      throw new NotFoundException('Endereço padrão não encontrado');
    }
    
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressesRepository.findOne(id);
    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    return this.addressesRepository.update(id, updateAddressDto);
  }

  async remove(id: number): Promise<void> {
    const address = await this.addressesRepository.findOne(id);
    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    await this.addressesRepository.remove(id);
  }
} 