import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasSyncRepository } from './repositories/categorias.sync.repository';
import { CategoriasSyncService } from './services/categorias.sync.service';
import { CategoryModule } from 'src/modules/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [],
      'oracle'
    ),
    CategoryModule
  ],
  providers: [CategoriasSyncRepository, CategoriasSyncService],
  exports: [CategoriasSyncRepository, CategoriasSyncService],
})
export class CategoriasSyncModule {} 