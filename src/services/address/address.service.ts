import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from 'src/models/address/address';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        private readonly profileService: ProfileService,
    ) {}

    async create(createAddressDto: CreateAddressDto): Promise<Address> {
        // Verificar se o perfil existe
        await this.profileService.findById(createAddressDto.profile_id);
        
        // Se o endereço for definido como padrão, desmarcar outros endereços padrão
        if (createAddressDto.is_default) {
            await this.unsetDefaultAddresses(createAddressDto.profile_id);
        }
        
        const address = this.addressRepository.create(createAddressDto);
        return this.addressRepository.save(address);
    }

    async findAll(profileId: number): Promise<Address[]> {
        return this.addressRepository.find({
            where: { profile_id: profileId },
            order: { is_default: 'DESC', created_at: 'DESC' }
        });
    }

    async findOne(id: number): Promise<Address> {
        const address = await this.addressRepository.findOne({
            where: { id },
            relations: ['profile']
        });
        
        if (!address) {
            throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
        }
        
        return address;
    }

    async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
        const address = await this.findOne(id);
        
        // Se o endereço for definido como padrão, desmarcar outros endereços padrão
        if (updateAddressDto.is_default) {
            await this.unsetDefaultAddresses(address.profile_id);
        }
        
        Object.assign(address, updateAddressDto);
        
        return this.addressRepository.save(address);
    }

    async remove(id: number): Promise<void> {
        const address = await this.findOne(id);
        
        try {
            await this.addressRepository.remove(address);
        } catch (error) {
            // Verificar se o erro é de violação de chave estrangeira
            if (error.message && error.message.includes('violates foreign key constraint "fk_order_address"')) {
                throw new ConflictException(
                    'Este endereço não pode ser excluído porque está sendo usado em um ou mais pedidos. ' +
                    'Considere adicionar um novo endereço e definir como padrão em vez de excluir este.'
                );
            }
            
            // Se for outro tipo de erro, repassar
            throw error;
        }
    }

    async setDefault(id: number): Promise<Address> {
        const address = await this.findOne(id);
        
        // Desmarcar outros endereços padrão
        await this.unsetDefaultAddresses(address.profile_id);
        
        // Marcar este endereço como padrão
        address.is_default = true;
        
        return this.addressRepository.save(address);
    }

    private async unsetDefaultAddresses(profileId: number): Promise<void> {
        await this.addressRepository.update(
            { profile_id: profileId, is_default: true },
            { is_default: false }
        );
    }
} 