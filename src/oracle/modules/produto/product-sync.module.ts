import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSyncController } from './controllers/product-sync.controller';
import { ProductSyncService } from './services/product-sync.service';
import { ProductSyncRepository } from './repositories/product-sync.repository';
import { Tipo } from './entities/tipo.entity';
import { Produto } from './entities/produto.entity';
import { Fabricante } from './entities/fabricante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Tipo,
        Produto,
        Fabricante,
      ],
      'oracle'
    ),
  ],
  controllers: [ProductSyncController],
  providers: [ProductSyncService, ProductSyncRepository],
})
export class ProductSyncModule {}