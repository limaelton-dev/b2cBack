import { Controller, Post, Body, Param, Get, Put, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { DiscountsService } from '../services/discounts.service';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountsService.create(createDiscountDto);
  }

  @Get()
  async findAll() {
    return this.discountsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.discountsService.findOne(+id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.discountsService.findByCode(code);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountsService.update(+id, updateDiscountDto);
  }

  @Put(':id/increment-usage')
  @UseGuards(JwtAuthGuard)
  async incrementUsage(@Param('id') id: string) {
    return this.discountsService.incrementUsage(+id);
  }

  @Put(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  async deactivate(@Param('id') id: string) {
    return this.discountsService.deactivate(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.discountsService.remove(+id);
  }
} 