import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus, 
  UseGuards,
  ForbiddenException 
} from '@nestjs/common';
import { PhoneService } from '../services/phone.service';
import { Phone } from '../entities/phone.entity';
import { CreatePhoneDto } from '../dto/create-phone.dto';
import { UpdatePhoneDto } from '../dto/update-phone.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProfileService } from '../../profile/services/profile.service';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('phone')
@UseGuards(JwtAuthGuard)
export class PhoneController {
  constructor(
    private readonly phoneService: PhoneService,
    private readonly profileService: ProfileService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser('sub') userId: number,
    @Body() createPhoneDto: CreatePhoneDto
  ): Promise<Phone> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    // Atualiza o profileId no DTO
    createPhoneDto.profileId = profile.id;
    
    return this.phoneService.create(createPhoneDto);
  }

  @Get()
  async findAll(
    @GetUser('sub') userId: number
  ): Promise<Phone[]> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    return this.phoneService.findByProfileId(profile.id);
  }

  @Get('default')
  async findDefault(
    @GetUser('sub') userId: number
  ): Promise<Phone> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    return this.phoneService.findDefaultByProfileId(profile.id);
  }

  @Get(':id')
  async findOne(
    @GetUser('sub') userId: number,
    @Param('id') id: number
  ): Promise<Phone> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    const phone = await this.phoneService.findOne(+id);
    
    // Verificar se o telefone pertence ao perfil
    if (phone.profileId !== profile.id) {
      throw new ForbiddenException('Telefone não pertence a este perfil');
    }
    
    return phone;
  }

  @Patch(':id')
  async update(
    @GetUser('sub') userId: number,
    @Param('id') id: number,
    @Body() updatePhoneDto: UpdatePhoneDto
  ): Promise<Phone> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    const phone = await this.phoneService.findOne(+id);
    
    // Verificar se o telefone pertence ao perfil
    if (phone.profileId !== profile.id) {
      throw new ForbiddenException('Telefone não pertence a este perfil');
    }
    
    return this.phoneService.update(+id, updatePhoneDto);
  }

  @Patch(':id/verify')
  async setVerified(
    @GetUser('sub') userId: number,
    @Param('id') id: number
  ): Promise<Phone> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    const phone = await this.phoneService.findOne(+id);
    
    // Verificar se o telefone pertence ao perfil
    if (phone.profileId !== profile.id) {
      throw new ForbiddenException('Telefone não pertence a este perfil');
    }
    
    return this.phoneService.setVerified(+id, true);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @GetUser('sub') userId: number,
    @Param('id') id: number
  ): Promise<void> {
    // Buscar perfis do usuário
    const profiles = await this.profileService.findAllByUserId(userId);
    
    if (!profiles || profiles.length === 0) {
      throw new ForbiddenException('Perfil não encontrado para este usuário');
    }
    
    // Usando o primeiro perfil do usuário
    const profile = profiles[0];
    
    const phone = await this.phoneService.findOne(+id);
    
    // Verificar se o telefone pertence ao perfil
    if (phone.profileId !== profile.id) {
      throw new ForbiddenException('Telefone não pertence a este perfil');
    }
    
    await this.phoneService.remove(+id);
  }
} 