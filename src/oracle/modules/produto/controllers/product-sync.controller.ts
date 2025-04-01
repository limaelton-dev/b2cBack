import { Controller, Get, Query } from '@nestjs/common';
import { ProductSyncService } from '../services/product-sync.service';

@Controller('products')
export class ProductSyncController {
  constructor(private readonly productSyncService: ProductSyncService) {}

  @Get('sync')
  async getProductsToSync(
    @Query('limit') limit: number = 100,
    @Query('offset') offset: number = 0,
  ) {
    return this.productSyncService.getProductsToSync(limit, offset);
  }
}