import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PhoneService } from 'src/services/phone/phone.service';
import { Phone } from 'src/models/phone/phone';
import { CreatePhoneDto } from 'src/services/phone/dto/createPhone.dto';
import { UpdatePhoneDto } from 'src/services/phone/dto/updatePhone.dto';

@Controller('phone')
export class PhoneController {
    constructor(private readonly phoneService: PhoneService) {}

    @Post()
    async create(@Body() createPhoneDto: CreatePhoneDto): Promise<Phone> {
        return this.phoneService.create(createPhoneDto);
    }

    @Get('profile/:profileId')
    async findAll(@Param('profileId', ParseIntPipe) profileId: number): Promise<Phone[]> {
        return this.phoneService.findAll(profileId);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Phone> {
        return this.phoneService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePhoneDto: UpdatePhoneDto
    ): Promise<Phone> {
        return this.phoneService.update(id, updatePhoneDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.phoneService.remove(id);
    }

    @Patch(':id/set-primary')
    async setPrimary(@Param('id', ParseIntPipe) id: number): Promise<Phone> {
        return this.phoneService.setPrimary(id);
    }
} 