import { Injectable } from '@nestjs/common';
import { BrandsRepository } from '../repositories/brands.repository';
import { ExtractedBrand } from 'src/shared/anymarket';

@Injectable()
export class BrandsService {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  async findAll(): Promise<ExtractedBrand[]> {
    return this.brandsRepository.findAll();
  }
}
