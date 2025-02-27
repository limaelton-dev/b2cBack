import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AddressService } from 'src/services/address/address.service';
import { Address } from 'src/models/address/address';
import { CreateAddressDto } from 'src/services/address/dto/createAddress.dto';
import { UpdateAddressDto } from 'src/services/address/dto/updateAddress.dto';

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Post()
    async create(@Body() createAddressDto: CreateAddressDto): Promise<Address> {
        return this.addressService.create(createAddressDto);
    }

    @Get('profile/:profileId')
    async findAll(@Param('profileId', ParseIntPipe) profileId: number): Promise<Address[]> {
        return this.addressService.findAll(profileId);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Address> {
        return this.addressService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAddressDto: UpdateAddressDto
    ): Promise<Address> {
        return this.addressService.update(id, updateAddressDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.addressService.remove(id);
    }

    @Patch(':id/set-default')
    async setDefault(@Param('id', ParseIntPipe) id: number): Promise<Address> {
        return this.addressService.setDefault(id);
    }
} 