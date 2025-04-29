import { Injectable } from '@nestjs/common';
import { ProdutosSyncRepository } from '../repositories/produtos.sync.repository';
import { BrandRepository } from 'src/modules/category/repositories/brand.repository';
import { CategoryRepository } from 'src/modules/category/repositories/category.repository';
import { ProductRepository } from 'src/modules/product/repositories/product.repository';
import { normalizeFabCodigo } from 'src/common/helpers/category.util';
import { generateSlug } from 'src/common/helpers/category.util';

@Injectable()
export class ProdutosSyncService {
  constructor(
    private readonly produtoOracleRepository: ProdutosSyncRepository,
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async syncFromOracle(limit: number, offset: number): Promise<void> {
    const rawData = await this.produtoOracleRepository.getProdutosToSync(limit, offset);

    for (const item of rawData) {
      const normalizedFabCodigo = normalizeFabCodigo(item.FAB_CODIGO);

      const brand = await this.brandRepository.upsert({
        oracleId: normalizedFabCodigo,
        name: item.FAB_DESCRICAO
      });

      const categoryLevel1Id = await this.categoryRepository.getId({
        oracleId: item.CATEGORY_L1_ORACLE_ID,
        sourceTable: 'PRODUTO_CLASSIFICACAO',
        sourceColumn: 'PCL_CODIGO'
      });

      const categoryLevel2Id = await this.categoryRepository.getId({
        oracleId: item.CATEGORY_L2_ORACLE_ID,
        sourceTable: 'TIPO',
        sourceColumn: 'TPO_CODIGO'
      });

      const categoryLevel3Id = item.CATEGORY_L3_ORACLE_ID
        ? await this.categoryRepository.getId({
            oracleId: item.CATEGORY_L3_ORACLE_ID,
            sourceTable: 'PRODUTO_SUBCLASSIFICACAO',
            sourceColumn: 'SCL_CODIGO'
          })
        : null;

      const height = item.PRO_ALTURA_PRO || item.PRO_ALTURA_EMB;
      const width = item.PRO_LARGURA_PRO || item.PRO_LARGURA_EMB;
      const length = item.PRO_COMPRIMENTO_PRO || item.PRO_COMPRIMENTO_EMB;
      const weight = item.PRO_PESO_PRO || item.PRO_PESO_EMB;

      await this.productRepository.upsert({
        oracleId: item.PRO_CODIGO,
        reference: item.PRO_REFERENCIA,
        name: item.PRO_DESCRICAO,
        description: item.PRO_APRESENTACAO,
        techDescription: item.PRO_DES_TECNICA,
        packagingContent: item.PRO_CONTEUDO_EMB,
        model: item.PRO_MODELO_COM,
        price: item.PRECO_VENDA,
        stock: 0,
        unit: item.PRO_UNIDADE,
        barcode: item.PRO_CODIGOBARRA,
        sku: item.PRO_PARTNUM_SKU,
        slug: generateSlug(item.PRO_URL_AMIGAVEL || item.PRO_DESCRICAO),
        weight,
        height,
        width,
        length,
        brandId: brand.id,
        categoryLevel1Id,
        categoryLevel2Id,
        categoryLevel3Id
      });
    }
  }

  async getProdutosToSync(limit: number, offset: number): Promise<any[]> {
    return this.produtoOracleRepository.getProdutosToSync(limit, offset);
  }
}