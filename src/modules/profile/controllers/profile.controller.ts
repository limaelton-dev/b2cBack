import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProfilePfDto } from '../dto/create-profile-pf.dto';
import { CreateProfilePjDto } from '../dto/create-profile-pj.dto';
import { UpdateProfilePfDto } from '../dto/update-profile-pf.dto';
import { UpdateProfilePjDto } from '../dto/update-profile-pj.dto';
import { UserProfileDetailsDto } from 'src/modules/user/dto/user-profile-details.dto';
import { UserProfileDto } from 'src/modules/user/dto/user-profile.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('pf')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: false,
    skipMissingProperties: true,
    disableErrorMessages: false,
    transformOptions: { enableImplicitConversion: true }
  }))
  async createProfilePf(
    @GetUser('userId') userId: number,
    @Body() createProfilePfDto: CreateProfilePfDto,
  ) {
    try {
      return this.profileService.createProfilePf(userId, createProfilePfDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      
      throw error;
    }
  }

  @Post('pj')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createProfilePj(
    @GetUser('userId') userId: number,
    @Body() createProfilePjDto: CreateProfilePjDto,
  ) {
    try {
      return this.profileService.createProfilePj(userId, createProfilePjDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      
      throw error;
    }
  }

  @Get()
  async findUserWithProfile(@GetUser('userId') userId: number): Promise<UserProfileDto> {
    return this.profileService.findUserWithProfile(userId);
  }

  @Get('details')
  async findUserWithProfileDetails(
    @GetUser('userId') userId: number,
  ): Promise<UserProfileDetailsDto> {
    return this.profileService.findUserProfileDetails(userId);
  }

  @Get(':id')
  async findOne(
    @GetUser('userId') userId: number,
    @Param('id') id: number,
  ) {
    const profile = await this.profileService.findOne(id);
    
    if (profile.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este perfil');
    }
    
    return profile;
  }

  @Get(':id/pf')
  async findProfilePf(
    @GetUser('userId') userId: number,
    @Param('id') id: number,
  ) {
    const profile = await this.profileService.findOne(id);
    
    if (profile.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este perfil');
    }
    
    return this.profileService.findProfilePf(id);
  }

  @Get(':id/pj')
  async findProfilePj(
    @GetUser('userId') userId: number,
    @Param('id') id: number,
  ) {
    const profile = await this.profileService.findOne(id);
    
    if (profile.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este perfil');
    }
    
    return this.profileService.findProfilePj(id);
  }

  @Put(':id/pf')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateProfilePf(
    @GetUser('userId') userId: number,
    @Param('id') id: number,
    @Body() updateProfilePfDto: UpdateProfilePfDto,
  ) {
    try {
      const profile = await this.profileService.findOne(id);
      
      if (profile.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para atualizar este perfil');
      }
            
      return this.profileService.updateProfilePf(+id, updateProfilePfDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }
                  
      throw error;
    }
  }

  @Put(':id/pj')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateProfilePj(
    @GetUser('userId') userId: number,
    @Param('id') id: number,
    @Body() updateProfilePjDto: UpdateProfilePjDto,
  ) {
    try {
      const profile = await this.profileService.findOne(id);
      
      if (profile.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para atualizar este perfil');
      }
      
      return this.profileService.updateProfilePj(+id, updateProfilePjDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }
            
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @GetUser('userId') userId: number,
    @Param('id') id: number,
  ) {
    const profile = await this.profileService.findOne(id);
    
    if (profile.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para remover este perfil');
    }
    
    await this.profileService.remove(id);
  }
} 