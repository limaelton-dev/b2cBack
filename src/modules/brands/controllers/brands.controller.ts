import { Controller, Get, Query, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { BrandService } from '../services/brand.service';

@Controller('brands')
export class BrandController {
  constructor(
    private readonly brandService: BrandService
  ) {}
    @Get()
    async findAll() {
      return this.brandService.findAll();
    }
}
