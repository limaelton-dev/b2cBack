import { Injectable, Logger } from '@nestjs/common';
import { ProdutosSyncRepository } from '../repositories/produtos.sync.repository';
import { BrandRepository } from 'src/modules/category/repositories/brand.repository';
import { CategoryRepository } from 'src/modules/category/repositories/category.repository';
import { ProductRepository } from 'src/modules/product-v1/repositories/product.repository';
// import { normalizeFabCodigo } from 'src/common/helpers/category.util';
import { generateSlug } from 'src/common/helpers/category.util';
import { generateUniqueProductSlug } from 'src/common/helpers/product.util';

@Injectable()
export class ProdutosSyncService {
  private readonly logger = new Logger(ProdutosSyncService.name);
  constructor(
    private readonly produtoOracleRepository: ProdutosSyncRepository,
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async syncFromOracle(limit: number, offset: number): Promise<void> {
    const rawData = await this.produtoOracleRepository.getProdutosToSync(limit, offset);

    for (const item of rawData) {
      // const normalizedFabCodigo = normalizeFabCodigo(item.FAB_CODIGO);
      const normalizedFabCodigo = item.FAB_CODIGO

      const brandId = await this.brandRepository.getId({
        oracleId: normalizedFabCodigo
      });

      this.logger.log(`Brand ID: ${brandId}`);

      const categoryLevel1Id = await this.categoryRepository.getId({
        oracleId: item.CATEGORY_L1_ORACLE_ID,
        sourceTable: 'PRODUTO_CLASSIFICACAO',
        sourceColumn: 'PCL_CODIGO'
      });

      this.logger.log(`Category Level 1 ID: ${categoryLevel1Id}`);

      const categoryLevel2Id = await this.categoryRepository.getId({
        oracleId: item.CATEGORY_L2_ORACLE_ID,
        sourceTable: 'TIPO',
        sourceColumn: 'TPO_CODIGO'
      });

      this.logger.log(`Category Level 2 ID: ${categoryLevel2Id}`);

      const categoryLevel3Id = item.CATEGORY_L3_ORACLE_ID
        ? await this.categoryRepository.getId({
            oracleId: item.CATEGORY_L3_ORACLE_ID,
            sourceTable: 'PRODUTO_SUBCLASSIFICACAO',
            sourceColumn: 'SCL_CODIGO'
          })
        : null;

      this.logger.log(`Category Level 3 ID: ${categoryLevel3Id}`);

      const height = item.PRO_ALTURA_PRO || item.PRO_ALTURA_EMB;
      const width = item.PRO_LARGURA_PRO || item.PRO_LARGURA_EMB;
      const length = item.PRO_COMPRIMENTO_PRO || item.PRO_COMPRIMENTO_EMB;
      const weight = item.PRO_PESO_PRO || item.PRO_PESO_EMB;

      const slug =  '';//await generateUniqueProductSlug(

      const productData = {
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
        slug: slug,
        weight,
        height,
        width,
        length,
        modelImage: item.PRO_MODELO_COM,
        brandImage: item.FAB_DESCRICAO,
        brand: { id: brandId },
        categoryLevel1: { id: categoryLevel1Id },
        categoryLevel2: { id: categoryLevel2Id },
        categoryLevel3: { id: categoryLevel3Id }
      };
      this.logger.log(`Product Data: ${JSON.stringify(productData)}`);
      await this.productRepository.upsert({...productData, slug: slug || ''});
    }
  }

  async getProdutosToSync(limit: number, offset: number): Promise<any[]> {
    return this.produtoOracleRepository.getProdutosToSync(limit, offset);
  }
}