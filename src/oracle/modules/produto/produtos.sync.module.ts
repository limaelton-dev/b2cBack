import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoSyncController } from './controllers/produtos.sync.controller';
import { ProdutosSyncService } from './services/produtos.sync.service';
import { ProdutosSyncRepository } from './repositories/produtos.sync.repository';
import { Tipo } from './entities/tipo.entity';
import { Produto } from './entities/produto.entity';
import { Fabricante } from './entities/fabricante.entity';
import { CategoriasSyncModule } from '../categorias/categorias.sync.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { ProductModule } from 'src/modules/product/product.module';
import { Brand } from 'src/modules/category/entities/brand.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Category } from 'src/modules/category/entities/category.entity';

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
    TypeOrmModule.forFeature([Brand, Product, Category]),
    CategoriasSyncModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [ProdutoSyncController],
  providers: [ProdutosSyncService, ProdutosSyncRepository],
  exports: [ProdutosSyncService, ProdutosSyncRepository],
})
export class ProdutosSyncModule {}