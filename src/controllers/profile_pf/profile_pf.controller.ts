import { Controller, Post, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ProfilePFService } from 'src/services/profile_pf/profile_pf.service';
import { ProfileService } from 'src/services/profile/profile.service';
import { ProfilePF } from 'src/models/profile_pf/profile_pf';
import { CreateProfilePFDto } from 'src/services/profile_pf/dto/createProfilePF.dto';
import { UpdateProfilePFDto } from 'src/services/profile_pf/dto/updateProfilePF.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile-pf')
@UseGuards(JwtAuthGuard)
export class ProfilePFController {
    constructor(
        private readonly profilePFService: ProfilePFService,
        private readonly profileService: ProfileService
    ) {}

    @Post()
    async createProfilePF(
        @Request() req,
        @Body() createProfilePFDto: CreateProfilePFDto
    ): Promise<ProfilePF> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        return this.profilePFService.create(profile.id, createProfilePFDto);
    }

    @Get()
    async getProfilePF(@Request() req): Promise<ProfilePF> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        return this.profilePFService.findByProfileId(profile.id);
    }

    @Patch()
    async updateProfilePF(
        @Request() req,
        @Body() updateProfilePFDto: UpdateProfilePFDto
    ): Promise<ProfilePF> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        return this.profilePFService.update(profile.id, updateProfilePFDto);
    }
} 