import { Injectable } from '@nestjs/common';
import { BrandsRepository } from '../repositories/brands.repository';

@Injectable()
export class BrandsService {
  constructor(
    private readonly brandsRepository: BrandsRepository
  ) {}

  async findAll(): Promise<[]> {
    const brands = await this.brandsRepository.findAll();
    return brands;
  }
}
