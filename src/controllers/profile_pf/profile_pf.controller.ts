import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProfilePFService } from 'src/services/profile_pf/profile_pf.service';
import { ProfilePF } from 'src/models/profile_pf/profile_pf';
import { CreateProfilePFDto } from 'src/services/profile_pf/dto/createProfilePF.dto';
import { UpdateProfilePFDto } from 'src/services/profile_pf/dto/updateProfilePF.dto';

@Controller('profile-pf')
export class ProfilePFController {
    constructor(private readonly profilePFService: ProfilePFService) {}

    @Post(':profileId')
    async createProfilePF(
        @Param('profileId', ParseIntPipe) profileId: number,
        @Body() createProfilePFDto: CreateProfilePFDto
    ): Promise<ProfilePF> {
        return this.profilePFService.create(profileId, createProfilePFDto);
    }

    @Get(':profileId')
    async getProfilePF(@Param('profileId', ParseIntPipe) profileId: number): Promise<ProfilePF> {
        return this.profilePFService.findByProfileId(profileId);
    }

    @Patch(':profileId')
    async updateProfilePF(
        @Param('profileId', ParseIntPipe) profileId: number,
        @Body() updateProfilePFDto: UpdateProfilePFDto
    ): Promise<ProfilePF> {
        return this.profilePFService.update(profileId, updateProfilePFDto);
    }
} 