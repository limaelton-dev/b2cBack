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
} from '@nestjs/common';
import { ProfilesService } from '../services/profiles.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProfilePfDto } from '../dto/create-profile-pf.dto';
import { CreateProfilePjDto } from '../dto/create-profile-pj.dto';
import { UpdateProfilePfDto } from '../dto/update-profile-pf.dto';
import { UpdateProfilePjDto } from '../dto/update-profile-pj.dto';
import { UserProfileDetailsDto } from 'src/modules/users/dto/user-profile-details.dto';
import { UserProfileDto } from 'src/modules/users/dto/user-profile.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post('pf')
  @HttpCode(HttpStatus.CREATED)
  async createProfilePf(@Request() req, @Body() createProfilePfDto: CreateProfilePfDto) {
    return this.profilesService.createProfilePf(req.user.userId, createProfilePfDto);
  }

  @Post('pj')
  @HttpCode(HttpStatus.CREATED)
  async createProfilePj(@Request() req, @Body() createProfilePjDto: CreateProfilePjDto) {
    return this.profilesService.createProfilePj(req.user.userId, createProfilePjDto);
  }

  @Get()
  async findUserWithProfile(@Request() req): Promise<UserProfileDto> {
    const userId = req.user.userId;
    return this.profilesService.findUserWithProfile(userId);
  }

  @Get('details')
  async findUserWithProfileDetails(@Request() req): Promise<UserProfileDetailsDto> {
    const userId = req.user.userId;
    return this.profilesService.findUserProfileDetails(userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const profile = await this.profilesService.findOne(+id);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este perfil');
    }
    
    return profile;
  }

  @Get(':id/pf')
  async findProfilePf(@Request() req, @Param('id') id: string) {
    const profile = await this.profilesService.findOne(+id);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este perfil');
    }
    
    return this.profilesService.findProfilePf(+id);
  }

  @Get(':id/pj')
  async findProfilePj(@Request() req, @Param('id') id: string) {
    const profile = await this.profilesService.findOne(+id);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este perfil');
    }
    
    return this.profilesService.findProfilePj(+id);
  }

  @Put(':id/pf')
  async updateProfilePf(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProfilePfDto: UpdateProfilePfDto,
  ) {
    const profile = await this.profilesService.findOne(+id);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este perfil');
    }
    
    return this.profilesService.updateProfilePf(+id, updateProfilePfDto);
  }

  @Put(':id/pj')
  async updateProfilePj(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProfilePjDto: UpdateProfilePjDto,
  ) {
    const profile = await this.profilesService.findOne(+id);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este perfil');
    }
    
    return this.profilesService.updateProfilePj(+id, updateProfilePjDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('id') id: string) {
    const profile = await this.profilesService.findOne(+id);
    
    // Verificar se o perfil pertence ao usuário autenticado
    if (profile.userId !== req.user.userId) {
      throw new ForbiddenException('Você não tem permissão para remover este perfil');
    }
    
    await this.profilesService.remove(+id);
  }
} 