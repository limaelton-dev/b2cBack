import { Injectable } from '@nestjs/common';
import { ProductSyncRepository } from '../repositories/product-sync.repository';

@Injectable()
export class ProductSyncService {
  constructor(private readonly productSyncRepository: ProductSyncRepository) {}

  async getProductsToSync(limit: number, offset: number): Promise<any[]> {
    return this.productSyncRepository.getProductsToSync(limit, offset);
  }
}