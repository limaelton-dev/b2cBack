import { Controller, Get } from '@nestjs/common';
import { BrandsService } from '../services/brands.service';

@Controller('brands')
export class BrandsController {
  constructor(
    private readonly brandsService: BrandsService
  ) {}
    @Get()
    async findAll() {
      return this.brandsService.findAll();
    }
}
