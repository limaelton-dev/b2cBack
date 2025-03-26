import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
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
  async createProfilePf(@Request() req, @Body() createProfilePfDto: CreateProfilePfDto) {
    try {
      return this.profileService.createProfilePf(req.user.userId, createProfilePfDto);
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
  async createProfilePj(@Request() req, @Body() createProfilePjDto: CreateProfilePjDto) {
    try {
      return this.profileService.createProfilePj(req.user.userId, createProfilePjDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      
      throw error;
    }
  }

  @Get()
  async findUserWithProfile(@Request() req): Promise<UserProfileDto> {
    const userId = req.user.userId;
    return this.profileService.findUserWithProfile(userId);
  }

  @Get('details')
  async findUserWithProfileDetails(@Request() req): Promise<UserProfileDetailsDto> {
    const userId = req.user.userId;
    return this.profileService.findUserProfileDetails(userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const profile = await this.profileService.findOne(+id);
    
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este perfil');
    }
    
    return profile;
  }

  @Get(':id/pf')
  async findProfilePf(@Request() req, @Param('id') id: string) {
    const profile = await this.profileService.findOne(+id);
    
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este perfil');
    }
    
    return this.profileService.findProfilePf(+id);
  }

  @Get(':id/pj')
  async findProfilePj(@Request() req, @Param('id') id: string) {
    const profile = await this.profileService.findOne(+id);
    
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este perfil');
    }
    
    return this.profileService.findProfilePj(+id);
  }

  @Put(':id/pf')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateProfilePf(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProfilePfDto: UpdateProfilePfDto,
  ) {
    try {
      const profile = await this.profileService.findOne(+id);
      
      if (profile.userId !== req.user.userId) {
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
    @Request() req,
    @Param('id') id: string,
    @Body() updateProfilePjDto: UpdateProfilePjDto,
  ) {
    try {
      const profile = await this.profileService.findOne(+id);
      
      if (profile.userId !== req.user.userId) {
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
  async remove(@Request() req, @Param('id') id: string) {
    const profile = await this.profileService.findOne(+id);
    
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para remover este perfil');
    }
    
    await this.profileService.remove(+id);
  }
} 