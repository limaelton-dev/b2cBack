import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasSyncRepository } from './repositories/categorias.sync.repository';
import { CategoriasSyncService } from './services/categorias.sync.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [],
      'oracle'
    ),
  ],
  providers: [CategoriasSyncRepository, CategoriasSyncService],
  exports: [CategoriasSyncRepository, CategoriasSyncService],
})
export class CategoriasSyncModule {} 