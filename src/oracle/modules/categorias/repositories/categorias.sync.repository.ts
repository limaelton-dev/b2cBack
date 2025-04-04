import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class CategoriasSyncRepository {
  constructor(
    @InjectDataSource('oracle') private readonly oracleDataSource: DataSource,
  ) { }

  async getCategoriasToSync(): Promise<any[]> {

    const query = `
        SELECT * FROM (SELECT
          F.FAB_CODIGO,
          F.FAB_DESCRICAO,
          F.COD_PAI,
          F.DESC_PAI,
          F.COD_FILHO,
          F.DESC_FILHO,
          F.COD_NETO,
          F.DESC_NETO,
          F.PRO_PROPCL2 L1,
          F.PRO_PROPCL3 L2,
          F.PRO_PROPCL4 L3,
          F.CAT
        FROM (
          SELECT 
            D.FAB_CODIGO,
            D.FAB_DESCRICAO,
            D.COD_PAI,
            D.DESC_PAI,
            D.COD_FILHO,
            D.DESC_FILHO,
            D.COD_NETO, 
            D.DESC_NETO,
            D.PRO_PROPCL2,
            D.PRO_PROPCL3,
            D.PRO_PROPCL4,
            CASE 
              WHEN D.FAB_CODIGO IN (36,230) THEN '36,230,419' 
              WHEN D.FAB_CODIGO = 355 THEN '355' 
              WHEN D.FAB_CODIGO = 342 THEN '342'
              WHEN D.FAB_CODIGO = 118 THEN '118'
              WHEN D.FAB_CODIGO = 197 THEN '197,290,423'
              WHEN D.FAB_CODIGO = 420 THEN '420'
              WHEN D.FAB_CODIGO IN (136,344) THEN '136,344' 
              WHEN D.FAB_CODIGO = 474 THEN '474'
            END CAT
          FROM (
            SELECT 
              FAB_CODIGO,
              CASE 
                WHEN FAB_CODIGO = 197 THEN 'HP' 
                WHEN FAB_CODIGO = 136 THEN 'PLUSCABLE' 
                WHEN FAB_CODIGO = 36 THEN 'C3TECH' 
                ELSE FAB_DESCRICAO
              END FAB_DESCRICAO,
              COD_PAI,
              DESC_PAI,
              COD_FILHO,
              DESC_FILHO,
              COD_NETO,
              DESC_NETO,
              PRO_PROPCL2,
              PRO_PROPCL3,
              PRO_PROPCL4
            FROM (
              SELECT 
                    CASE 
                    -- HP
                    WHEN F.FAB_CODIGO IN (290, 423) THEN 197 
                    -- PLUS CABLE
                    WHEN F.FAB_CODIGO IN (344) THEN 136
                    -- C3TECH
                    WHEN F.FAB_CODIGO IN (230, 419) THEN 36
                    ELSE F.FAB_CODIGO
                  END FAB_CODIGO,
                  F.FAB_DESCRICAO,
                  P.PRO_PROPCL2 COD_PAI,
                  INITCAP(C.PCL_DESCRICAO) DESC_PAI,
                  P.TPO_CODIGO COD_FILHO,
                  INITCAP(T.TPO_DESCRICAO) DESC_FILHO,
                  P.PRO_PROPCL4 COD_NETO,
                  INITCAP(S.SCL_DESCRICAO) DESC_NETO,
                  PRO_PROPCL2,
                  PRO_PROPCL3,
                  PRO_PROPCL4
                FROM PRODUTO P
                INNER JOIN FABRICANTE F ON (F.FAB_CODIGO = P.FAB_CODIGO)
                LEFT  JOIN PRODUTO_CLASSIFICACAO C ON (C.PCL_CODIGO = P.PRO_PROPCL2)
                LEFT  JOIN TIPO T ON (T.TPO_CODIGO = P.TPO_CODIGO)
                LEFT  JOIN PRODUTO_SUBCLASSIFICACAO S ON (S.SCL_CODIGO = P.PRO_PROPCL4)
                WHERE SUBSTR(P.PRO_REFERENCIA, 1, 1) IN ('3', '4', '5')
                AND P.PRO_ATIVO = '1'
                AND P.PRO_FORALIN = 'N'
                AND P.PRO_CONSTASITE_B2B = 1
                AND P.PRO_PROPCL2 > 0
                AND P.PRO_PROPCL2 <> 140
                AND F.FAB_CODIGO IN (36,230,419,342,474,118,197,290,423,420,136,344)
                ORDER BY 2, 4, 6, 8
            )
          ) D
        ) F  
      )
    `;

    return this.oracleDataSource.query(query);
  }
}