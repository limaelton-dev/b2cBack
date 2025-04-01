import { Module } from '@nestjs/common';
import { ProductSyncController } from './controllers/product-sync.controller';
import { ProductSyncService } from './services/product-sync.service';
import { ProductSyncRepository } from './repositories/product-sync.repository';

@Module({
  controllers: [ProductSyncController],
  providers: [ProductSyncService, ProductSyncRepository],
})
export class ProductSyncModule {}