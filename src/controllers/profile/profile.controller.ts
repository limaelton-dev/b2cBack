import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProfileService } from 'src/services/profile/profile.service';
import { Profile } from 'src/models/profile/profile';
import { CreateProfileDto } from 'src/services/profile/dto/createProfile.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Post()
    async createProfile(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
        return this.profileService.create(createProfileDto);
    }

    @Get(':userId')
    async getProfileByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Profile> {
        return this.profileService.findByUserId(userId);
    }

    @Get('details/:userId')
    async getProfileDetails(@Param('userId', ParseIntPipe) userId: number): Promise<any> {
        return this.profileService.getProfileDetails(userId);
    }

    @Patch(':userId')
    async updateProfileType(
        @Param('userId', ParseIntPipe) userId: number,
        @Body('profile_type') profileType: string,
    ): Promise<Profile> {
        return this.profileService.update(userId, profileType);
    }
} 