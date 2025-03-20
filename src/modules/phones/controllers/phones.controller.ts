import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PhonesService } from '../services/phones.service';
import { Phone } from '../entities/phone.entity';
import { CreatePhoneDto } from '../dto/create-phone.dto';
import { UpdatePhoneDto } from '../dto/update-phone.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('phones')
@UseGuards(JwtAuthGuard)
export class PhonesController {
  constructor(private readonly phonesService: PhonesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPhoneDto: CreatePhoneDto): Promise<Phone> {
    return this.phonesService.create(createPhoneDto);
  }

  @Get()
  async findAll(): Promise<Phone[]> {
    return this.phonesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Phone> {
    return this.phonesService.findOne(+id);
  }

  @Get('profile/:profileId')
  async findByProfileId(@Param('profileId') profileId: number): Promise<Phone[]> {
    return this.phonesService.findByProfileId(+profileId);
  }

  @Get('profile/:profileId/default')
  async findDefaultByProfileId(@Param('profileId') profileId: number): Promise<Phone> {
    return this.phonesService.findDefaultByProfileId(+profileId);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePhoneDto: UpdatePhoneDto): Promise<Phone> {
    return this.phonesService.update(+id, updatePhoneDto);
  }

  @Patch(':id/verify')
  async setVerified(@Param('id') id: number): Promise<Phone> {
    return this.phonesService.setVerified(+id, true);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.phonesService.remove(+id);
  }
} 