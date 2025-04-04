import { Module } from '@nestjs/common';
import { ProdutosSyncModule } from './modules/produto/produtos.sync.module';

@Module({
  imports: [ProdutosSyncModule],
  exports: [ProdutosSyncModule],
})
export class OracleModule {}
