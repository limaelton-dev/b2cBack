import { Module } from '@nestjs/common';
import { ProdutosSyncModule } from './modules/produto/produtos.sync.module';
import { CheckoutOracleModule } from './modules/checkout/checkout.oracle.module';

@Module({
  imports: [ProdutosSyncModule, CheckoutOracleModule],
  exports: [ProdutosSyncModule, CheckoutOracleModule],
})
export class OracleModule {}
