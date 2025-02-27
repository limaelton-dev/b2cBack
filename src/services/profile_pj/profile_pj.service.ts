import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilePJ } from 'src/models/profile_pj/profile_pj';
import { CreateProfilePJDto } from './dto/createProfilePJ.dto';
import { UpdateProfilePJDto } from './dto/updateProfilePJ.dto';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ProfilePJService {
    constructor(
        @InjectRepository(ProfilePJ)
        private readonly profilePJRepository: Repository<ProfilePJ>,
        private readonly profileService: ProfileService,
    ) {}

    async create(profileId: number, createProfilePJDto: CreateProfilePJDto): Promise<ProfilePJ> {
        // Verificar se o perfil base existe
        await this.profileService.findById(profileId);
        
        const profilePJ = this.profilePJRepository.create({
            profile_id: profileId,
            ...createProfilePJDto,
        });
        
        return this.profilePJRepository.save(profilePJ);
    }

    async findByProfileId(profileId: number): Promise<ProfilePJ> {
        const profilePJ = await this.profilePJRepository.findOne({
            where: { profile_id: profileId },
            relations: ['profile'],
        });
        
        if (!profilePJ) {
            throw new NotFoundException(`Perfil PJ com ID ${profileId} não encontrado`);
        }
        
        return profilePJ;
    }

    async update(profileId: number, updateProfilePJDto: UpdateProfilePJDto): Promise<ProfilePJ> {
        const profilePJ = await this.findByProfileId(profileId);
        
        Object.assign(profilePJ, updateProfilePJDto);
        
        return this.profilePJRepository.save(profilePJ);
    }
} 