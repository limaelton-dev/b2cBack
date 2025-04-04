import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasSyncRepository } from './repositories/categorias.sync.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [],
      'oracle'
    ),
  ],
  providers: [CategoriasSyncRepository],
  exports: [CategoriasSyncRepository],
})
export class CategoriasSyncModule {} 