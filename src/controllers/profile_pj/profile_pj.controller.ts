import { Controller, Post, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ProfilePJService } from 'src/services/profile_pj/profile_pj.service';
import { ProfileService } from 'src/services/profile/profile.service';
import { ProfilePJ } from 'src/models/profile_pj/profile_pj';
import { CreateProfilePJDto } from 'src/services/profile_pj/dto/createProfilePJ.dto';
import { UpdateProfilePJDto } from 'src/services/profile_pj/dto/updateProfilePJ.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile-pj')
@UseGuards(JwtAuthGuard)
export class ProfilePJController {
    constructor(
        private readonly profilePJService: ProfilePJService,
        private readonly profileService: ProfileService
    ) {}

    @Post()
    async createProfilePJ(
        @Request() req,
        @Body() createProfilePJDto: CreateProfilePJDto
    ): Promise<ProfilePJ> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        return this.profilePJService.create(profile.id, createProfilePJDto);
    }

    @Get()
    async getProfilePJ(@Request() req): Promise<ProfilePJ> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        return this.profilePJService.findByProfileId(profile.id);
    }

    @Patch()
    async updateProfilePJ(
        @Request() req,
        @Body() updateProfilePJDto: UpdateProfilePJDto
    ): Promise<ProfilePJ> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        return this.profilePJService.update(profile.id, updateProfilePJDto);
    }
} 