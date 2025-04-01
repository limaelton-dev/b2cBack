import { Module } from '@nestjs/common';
import { ProductSyncModule } from './modules/produto/product-sync.module';

@Module({
  imports: [ProductSyncModule],
  exports: [ProductSyncModule],
})
export class OracleModule {}
