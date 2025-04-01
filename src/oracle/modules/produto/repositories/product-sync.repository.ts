import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ProductSyncRepository {
  constructor(
    @InjectDataSource('oracle') private readonly oracleDataSource: DataSource,
  ) {}

  async getProductsToSync(limit: number, offset: number): Promise<any[]> {
    // Garantir que limit e offset sejam números válidos
    const limitValue = isNaN(Number(limit)) ? 100 : Number(limit);
    const offsetValue = isNaN(Number(offset)) ? 0 : Number(offset);

    const query = `
      SELECT PRO.PRO_CODIGO,
             TPO_CODIGO,
             PRO.FAB_CODIGO,
             PSG_CODIGO,
             PPN_CODIGO,
             PVR_CODIGO,
             FAM_CODIGO,
             PGR_CODIGO,
             PMO_CODIGO,
             PRO.PRO_REFERENCIA,
             PRO.PRO_DESCRICAO,
             PRO.PRO_CODIGOBARRA,
             PRO.PRO_UNIDADE,
             PRO.PRO_PRAZOGARANTIA,
             PRO.PRO_CONTEUDO_EMB,
             PRO.PRO_PARTNUM_SKU,
             PRO.PRO_SOFTWARE,
             PRO.PRO_MANUAL,
             PRO.PRO_KEYWORD,
             PRO.PRO_METATAGS,
             PRO.PRO_URL_AMIGAVEL,
             PRO.PRO_URL_FICHATEC,
             PRO.PRO_URL_DROPBOX,
             PRO.PRO_CONTEUDO_EMB2,
             PRO.PRO_MODELO_COM,
             PRO.PRO_DES_TECNICA,
             FAB.FAB_DESCRICAO,
             PRO.PRO_ALTURA_PRO,
             PRO.PRO_LARGURA_PRO,
             PRO.PRO_COMPRIMENTO_PRO,
             PRO.PRO_PESO_PRO,
             PRO.PRO_ALTURA_EMB,
             PRO.PRO_LARGURA_EMB,
             PRO.PRO_COMPRIMENTO_EMB,
             PRO.PRO_PESO_EMB,
             PRO.PRO_CUSTO01,
             PRO.PRO_CUSTO02,
             PRO.PRO_CUSTO03,
             PRO.PRO_CUSTO04,
             PRO.PRO_CUSTO05,
             PRO.PRO_CUSTO06,
             PRO.PRO_CUSTO07,
             PRO.PRO_CUSTO08,
             PRO.PRO_CUSTO09,
             PRO.PRO_CUSTO10,
             PRO.PRO_CUSTO11,
             PRO.PRO_CUSTO12,
             PRO.PRO_PRECOVENDA01,
             PRO.PRO_PRECOVENDA02,
             PRO.PRO_PRECOVENDA03,
             PRO.PRO_PRECOVENDA04,
             PRO.PRO_PRECOVENDA05,
             PRO.PRO_PRECOVENDA06,
             PRO.PRO_PRECOVENDA07,
             PRO.PRO_PRECOVENDA08,
             PRO.PRO_PRECOVENDA09,
             PRO.PRO_PRECOVENDA10,
             PRO.PRO_PRECOVENDA11,
             PRO.PRO_PRECOVENDA12,
             PRO.PRO_APRESENTACAO
      FROM ORACLC.PRODUTO PRO
      LEFT JOIN ORACLC.FABRICANTE FAB ON FAB.FAB_CODIGO = PRO.FAB_CODIGO
      WHERE FAM_CODIGO IN (3,4,5)
        AND PRO_ATIVO = '1'
        AND PRO_PRECOVENDA01 > 0
        AND PRO_FORALIN != 'S'
        AND PRO_CONSTASITE_B2B = 1
        AND EXISTS (
            SELECT 1 FROM "SNAP$_ESTOQUE_RATEIO" EST
            WHERE EST.PRO_CODIGO = PRO.PRO_CODIGO
            AND EST.RAT_CODIGO = 2
            AND EST.DISPONIVEL > 0
        )
      ORDER BY PRO.PRO_CODIGO
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
    `;

    return this.oracleDataSource.query(query, [offset, limit]);
  }
}