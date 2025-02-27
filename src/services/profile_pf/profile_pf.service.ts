import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilePF } from 'src/models/profile_pf/profile_pf';
import { CreateProfilePFDto } from './dto/createProfilePF.dto';
import { UpdateProfilePFDto } from './dto/updateProfilePF.dto';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ProfilePFService {
    constructor(
        @InjectRepository(ProfilePF)
        private readonly profilePFRepository: Repository<ProfilePF>,
        private readonly profileService: ProfileService,
    ) {}

    async create(profileId: number, createProfilePFDto: CreateProfilePFDto): Promise<ProfilePF> {
        // Verificar se o perfil base existe
        await this.profileService.findById(profileId);
        
        const profilePF = this.profilePFRepository.create({
            profile_id: profileId,
            ...createProfilePFDto,
        });
        
        return this.profilePFRepository.save(profilePF);
    }

    async findByProfileId(profileId: number): Promise<ProfilePF> {
        const profilePF = await this.profilePFRepository.findOne({
            where: { profile_id: profileId },
            relations: ['profile'],
        });
        
        if (!profilePF) {
            throw new NotFoundException(`Perfil PF com ID ${profileId} não encontrado`);
        }
        
        return profilePF;
    }

    async update(profileId: number, updateProfilePFDto: UpdateProfilePFDto): Promise<ProfilePF> {
        const profilePF = await this.findByProfileId(profileId);
        
        Object.assign(profilePF, updateProfilePFDto);
        
        return this.profilePFRepository.save(profilePF);
    }
} 