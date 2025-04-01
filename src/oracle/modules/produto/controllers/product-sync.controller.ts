import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ProductSyncService } from '../services/product-sync.service';

@Controller('products')
export class ProductSyncController {
  constructor(private readonly productSyncService: ProductSyncService) {}

  @Get('sync')
  async getProductsToSync(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.productSyncService.getProductsToSync(limit, offset);
  }
}