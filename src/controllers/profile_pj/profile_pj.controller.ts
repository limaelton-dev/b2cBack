import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProfilePJService } from 'src/services/profile_pj/profile_pj.service';
import { ProfilePJ } from 'src/models/profile_pj/profile_pj';
import { CreateProfilePJDto } from 'src/services/profile_pj/dto/createProfilePJ.dto';
import { UpdateProfilePJDto } from 'src/services/profile_pj/dto/updateProfilePJ.dto';

@Controller('profile-pj')
export class ProfilePJController {
    constructor(private readonly profilePJService: ProfilePJService) {}

    @Post(':profileId')
    async createProfilePJ(
        @Param('profileId', ParseIntPipe) profileId: number,
        @Body() createProfilePJDto: CreateProfilePJDto
    ): Promise<ProfilePJ> {
        return this.profilePJService.create(profileId, createProfilePJDto);
    }

    @Get(':profileId')
    async getProfilePJ(@Param('profileId', ParseIntPipe) profileId: number): Promise<ProfilePJ> {
        return this.profilePJService.findByProfileId(profileId);
    }

    @Patch(':profileId')
    async updateProfilePJ(
        @Param('profileId', ParseIntPipe) profileId: number,
        @Body() updateProfilePJDto: UpdateProfilePJDto
    ): Promise<ProfilePJ> {
        return this.profilePJService.update(profileId, updateProfilePJDto);
    }
} 