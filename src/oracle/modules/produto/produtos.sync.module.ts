import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoSyncController } from './controllers/produtos.sync.controller';
import { ProdutosSyncService } from './services/produtos.sync.service';
import { ProdutosSyncRepository } from './repositories/produtos.sync.repository';
import { Tipo } from './entities/tipo.entity';
import { Produto } from './entities/produto.entity';
import { Fabricante } from './entities/fabricante.entity';
import { CategoriasSyncModule } from '../categorias/categorias.sync.module';

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
    CategoriasSyncModule,
  ],
  controllers: [ProdutoSyncController],
  providers: [ProdutosSyncService, ProdutosSyncRepository],
})
export class ProdutosSyncModule {}