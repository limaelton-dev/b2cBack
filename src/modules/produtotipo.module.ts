import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoTipo } from 'src/models/produto/produtotipo';
import { ProdutoTipoService } from 'src/services/produtotipo/produtotipo.service';
import { ProdutoTipoController } from 'src/controllers/produtotipo/produtotipo.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutoTipo]),
  ],
  controllers: [ProdutoTipoController],
  providers: [ProdutoTipoService],
  exports: [ProdutoTipoService],
})
export class ProdutoTipoModule {} 