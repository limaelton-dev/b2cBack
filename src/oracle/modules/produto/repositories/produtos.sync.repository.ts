import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ProdutosSyncRepository {
  private readonly logger = new Logger(ProdutosSyncRepository.name);

  constructor(
    @InjectDataSource('oracle') private readonly oracleDataSource: DataSource,
  ) { }

  async getProdutosToSync(limit: number, offset: number): Promise<any[]> {
    const limitValue = isNaN(Number(limit)) ? 5 : Number(limit);
    const offsetValue = isNaN(Number(offset)) ? 0 : Number(offset);

    const query = `
      SELECT
        PRO.PRO_CODIGO, --chave primária orcle
        PRO.PRO_DESCRICAO, -- descrição(título) do produto
        PRO.PRO_REFERENCIA, -- referência única do produto
        PRO.PRO_CODIGOBARRA, -- código de barras do produto
        PRO.PRO_UNIDADE, -- unidade de medida do produto
        PRO.PRO_PARTNUM_SKU, -- SKU do produto
        PRO.PRO_MODELO_COM, -- modelo do produto
        PRO.PRO_DES_TECNICA, -- descrição técnica do produto
        PRO.PRO_APRESENTACAO, -- apresentação do produto
        PRO.PRO_URL_AMIGAVEL, -- slug do produto
        CASE 
          WHEN PRO.PRO_CONTEUDO_EMB IS NOT NULL 
            THEN TO_NCHAR(PRO.PRO_CONTEUDO_EMB)
          ELSE TO_NCHAR(PRO.PRO_CONTEUDO_EMB2)
        END AS PRO_CONTEUDO_EMB, -- NÃO É POSSÍVEL UTILIZAR COALESCE, POIS OS CAMPOS TEM CONJUNTO DE CARACTERES DIFERENTES
                                 -- CONTEÚDO DA EMBALAGEM DO PRODUTO

        -- Medidas do produto
        PRO.PRO_ALTURA_PRO,
        PRO.PRO_LARGURA_PRO,
        PRO.PRO_COMPRIMENTO_PRO,
        PRO.PRO_PESO_PRO,

        -- Medidas da embalagem (fallback)
        PRO.PRO_ALTURA_EMB,
        PRO.PRO_LARGURA_EMB,
        PRO.PRO_COMPRIMENTO_EMB,
        PRO.PRO_PESO_EMB,

        -- Preço
        COALESCE(
            PRO.PRO_PRECOVENDA01, PRO.PRO_PRECOVENDA02, PRO.PRO_PRECOVENDA03, PRO.PRO_PRECOVENDA04,
            PRO.PRO_PRECOVENDA05, PRO.PRO_PRECOVENDA06, PRO.PRO_PRECOVENDA07, PRO.PRO_PRECOVENDA08,
            PRO.PRO_PRECOVENDA09, PRO.PRO_PRECOVENDA10, PRO.PRO_PRECOVENDA11, PRO.PRO_PRECOVENDA12
        ) AS PRECO_VENDA,

        -- Categorias (para relacionamento category)
        PRO.PRO_PROPCL2 AS CATEGORY_L1_ORACLE_ID,
        PRO.TPO_CODIGO AS CATEGORY_L2_ORACLE_ID,
        PRO.PRO_PROPCL4 AS CATEGORY_L3_ORACLE_ID,

        -- Fabricante (para relacionamento brand)
        CASE 
            WHEN PRO.FAB_CODIGO IN (290, 423) THEN 197 
            WHEN PRO.FAB_CODIGO IN (344) THEN 136 
            WHEN PRO.FAB_CODIGO IN (230, 419) THEN 36 
            ELSE PRO.FAB_CODIGO 
        END AS FAB_CODIGO,

        COUNT(PRO.PRO_CODIGO) OVER () AS TOTAL_PRODUTOS

      FROM (
        ORACLC.PRODUTO PRO
        LEFT JOIN ORACLC.FABRICANTE FAB
          ON FAB.FAB_CODIGO = PRO.FAB_CODIGO
      )

      -- Filtros de negócio
        WHERE PRO.FAM_CODIGO IN (3,4,5)
          AND PRO.PRO_ATIVO = '1'
          AND PRO.PRO_PRECOVENDA01 > 0
          AND PRO.PRO_FORALIN != 'S'
          AND PRO.PRO_CONSTASITE_B2B = 1
          AND PRO.PRO_DESCRICAO IS NOT NULL
          AND PRO.PRO_REFERENCIA IS NOT NULL
          AND PRO_PARTNUM_SKU IS NOT NULL
          AND PRO.PRO_PROPCL2 > 0
          AND PRO.PRO_PROPCL2 <> 140
          AND FAB.FAB_CODIGO IN (36,230,419,342,474,118,197,290,423,420,136,344)
        AND (
          (
            NVL(PRO.PRO_ALTURA_PRO,0) > 0 
            AND NVL(PRO.PRO_LARGURA_PRO,0) > 0 
            AND NVL(PRO.PRO_COMPRIMENTO_PRO,0) > 0 
            AND NVL(PRO.PRO_PESO_PRO,0) > 0
          )
          OR
          (
            NVL(PRO.PRO_ALTURA_EMB,0) > 0 
            AND NVL(PRO.PRO_LARGURA_EMB,0) > 0 
            AND NVL(PRO.PRO_COMPRIMENTO_EMB,0) > 0 
            AND NVL(PRO.PRO_PESO_EMB,0) > 0
          )
        )
        AND EXISTS (
            SELECT 1 FROM "SNAP$_ESTOQUE_RATEIO" EST
            WHERE EST.PRO_CODIGO = PRO.PRO_CODIGO
            AND EST.RAT_CODIGO = 2
            AND EST.DISPONIVEL > 0
        )

      ORDER BY PRO.PRO_CODIGO
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
    `;

    return await this.oracleDataSource.query(query, [offsetValue, limitValue]);
  }
}