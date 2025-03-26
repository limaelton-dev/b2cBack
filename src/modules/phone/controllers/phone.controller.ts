import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PhoneService } from '../services/phone.service';
import { Phone } from '../entities/phone.entity';
import { CreatePhoneDto } from '../dto/create-phone.dto';
import { UpdatePhoneDto } from '../dto/update-phone.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('phone')
@UseGuards(JwtAuthGuard)
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPhoneDto: CreatePhoneDto): Promise<Phone> {
    return this.phoneService.create(createPhoneDto);
  }

  @Get()
  async findAll(): Promise<Phone[]> {
    return this.phoneService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Phone> {
    return this.phoneService.findOne(+id);
  }

  @Get('profile/:profileId')
  async findByProfileId(@Param('profileId') profileId: number): Promise<Phone[]> {
    return this.phoneService.findByProfileId(+profileId);
  }

  @Get('profile/:profileId/default')
  async findDefaultByProfileId(@Param('profileId') profileId: number): Promise<Phone> {
    return this.phoneService.findDefaultByProfileId(+profileId);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePhoneDto: UpdatePhoneDto): Promise<Phone> {
    return this.phoneService.update(+id, updatePhoneDto);
  }

  @Patch(':id/verify')
  async setVerified(@Param('id') id: number): Promise<Phone> {
    return this.phoneService.setVerified(+id, true);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.phoneService.remove(+id);
  }
} 