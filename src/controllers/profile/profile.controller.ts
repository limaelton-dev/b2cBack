import { Controller, Post, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from 'src/services/profile/profile.service';
import { Profile } from 'src/models/profile/profile';
import { CreateProfileDto } from 'src/services/profile/dto/createProfile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createProfile(
        @Request() req,
        @Body() createProfileDto: CreateProfileDto
    ): Promise<Profile> {
        createProfileDto.user_id = req.user.id;
        return this.profileService.create(createProfileDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getMyProfile(@Request() req): Promise<Profile> {
        return this.profileService.findByUserId(req.user.id);
    }

    @Get('details')
    @UseGuards(JwtAuthGuard)
    async getMyProfileDetails(@Request() req): Promise<any> {
        return this.profileService.getProfileDetails(req.user.id);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateMyProfileType(
        @Request() req,
        @Body('profile_type') profileType: string,
    ): Promise<Profile> {
        return this.profileService.update(req.user.id, profileType);
    }
} 