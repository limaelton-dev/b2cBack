import { Injectable, NotFoundException, BadRequestException, Logger, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from 'src/models/profile/profile';
import { CreateProfileDto } from './dto/createProfile.dto';
import { Cart } from 'src/models/cart/cart';

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);

    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
    ) {}

    async create(createProfileDto: CreateProfileDto): Promise<Profile> {
        this.logger.log(`Criando novo perfil para o usuário ID: ${createProfileDto.user_id}`);
        
        // Validar o tipo de perfil
        if (createProfileDto.profile_type !== 'PF' && createProfileDto.profile_type !== 'PJ') {
            throw new BadRequestException('O tipo de perfil deve ser PF ou PJ');
        }

        const profile = this.profileRepository.create(createProfileDto);
        const savedProfile = await this.profileRepository.save(profile);
        
        // Criar um carrinho vazio para o novo perfil
        try {
            this.logger.log(`Criando carrinho para o novo perfil ID: ${savedProfile.id}`);
            const cartCreate = this.cartRepository.create({
                profile: savedProfile,
                cart_data: [],
            });
            await this.cartRepository.save(cartCreate);
            this.logger.log(`Carrinho criado com sucesso para o perfil ID: ${savedProfile.id}`);
        } catch (error) {
            this.logger.error(`Erro ao criar carrinho para o perfil: ${error.message}`, error.stack);
            // Não vamos falhar a criação do perfil se o carrinho falhar
        }
        
        return savedProfile;
    }

    async findById(id: number): Promise<Profile> {
        const profile = await this.profileRepository.findOne({ 
            where: { id },
            relations: ['user', 'profilePF', 'profilePJ', 'addresses', 'cards', 'phones', 'orders', 'cart']
        });
        
        if (!profile) {
            throw new NotFoundException(`Perfil com ID ${id} não encontrado`);
        }
        
        return profile;
    }

    async findByUserId(userId: number): Promise<Profile> {
        const profile = await this.profileRepository.findOne({ 
            where: { user_id: userId },
            relations: ['user', 'profilePF', 'profilePJ', 'addresses', 'cards', 'phones', 'orders', 'cart']
        });
        
        if (!profile) {
            throw new NotFoundException(`Perfil para o usuário com ID ${userId} não encontrado`);
        }
        
        return profile;
    }

    async update(userId: number, profileType: string): Promise<Profile> {
        // Validar o tipo de perfil
        if (profileType !== 'PF' && profileType !== 'PJ') {
            throw new BadRequestException('O tipo de perfil deve ser PF ou PJ');
        }

        const profile = await this.findByUserId(userId);
        profile.profile_type = profileType;
        return this.profileRepository.save(profile);
    }

    async getProfileDetails(userId: number): Promise<any> {
        const profile = await this.findByUserId(userId);
        
        // Construir resposta com base no tipo de perfil
        const result = {
            id: profile.id,
            user_id: profile.user_id,
            profile_type: profile.profile_type,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            addresses: profile.addresses || [],
            cards: profile.cards || [],
            phones: profile.phones || [],
            orders: profile.orders || []
        };
        
        if (profile.profile_type === 'PF' && profile.profilePF) {
            Object.assign(result, {
                full_name: profile.profilePF.full_name,
                cpf: profile.profilePF.cpf,
                birth_date: profile.profilePF.birth_date,
                gender: profile.profilePF.gender,
            });
        } else if (profile.profile_type === 'PJ' && profile.profilePJ) {
            Object.assign(result, {
                company_name: profile.profilePJ.company_name,
                trading_name: profile.profilePJ.trading_name,
                cnpj: profile.profilePJ.cnpj,
                state_registration: profile.profilePJ.state_registration,
                municipal_registration: profile.profilePJ.municipal_registration,
            });
        }
        
        return result;
    }
} 