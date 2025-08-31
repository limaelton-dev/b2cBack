import { Injectable } from '@nestjs/common';
import { BrandRepository } from '../repositories/brand.repository';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository
  ) {}

  async findAll(): Promise<[]> {
    const brands = await this.brandRepository.findAll();
    return brands;
  }
}
