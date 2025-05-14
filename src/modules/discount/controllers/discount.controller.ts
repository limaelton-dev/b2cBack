import { Controller, Post, Body, Param, Get, Put, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { DiscountService } from '../services/discount.service';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  async findAll() {
    return this.discountService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.discountService.findOne(+id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.discountService.findByCode(code);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Put(':id/increment-usage')
  @UseGuards(JwtAuthGuard)
  async incrementUsage(@Param('id') id: number) {
    return this.discountService.incrementUsage(id);
  }

  @Put(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  async deactivate(@Param('id') id: number) {
    return this.discountService.deactivate(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    return this.discountService.remove(id);
  }
} 