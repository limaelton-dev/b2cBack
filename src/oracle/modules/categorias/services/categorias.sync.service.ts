import { Injectable } from '@nestjs/common';
import { CategoriasSyncRepository } from '../repositories/categorias.sync.repository';
import { BrandRepository } from 'src/modules/category/repositories/brand.repository';
import { CategoryRepository } from 'src/modules/category/repositories/category.repository';
import { normalizeFabCodigo } from 'src/common/helpers/normalize.categorias';

@Injectable()
export class CategoriasSyncService {
  constructor(
    private readonly categoriaSyncRepository: CategoriasSyncRepository, //oracle
    private readonly brandRepository: BrandRepository, //postgres
    private readonly categoryRepository: CategoryRepository //postgres
) {}

    async syncCategorysFromOracle() {

        //executa a query necessária para pegar os dados do oracle.
        //a query é feita no repository do oracle, que é o CategoriasSyncRepository.
        const rawData = await this.categoriaSyncRepository.getCategoriasToSync();
        const brandMap = new Map<number, number>();
        const processedCategoryKeys = new Set<string>();

        for(const item of rawData) {
            const normalizedFabCodigo = normalizeFabCodigo(item.FAB_CODIGO);

            const brand = await this.brandRepository.upsert({
                oracleId: normalizedFabCodigo,
                name: item.FAB_DESCRICAO
            });
            brandMap.set(normalizedFabCodigo, brand.id);
            
            const partentKey = `1-${item.COD_PAI}-${brand.id}`;
            if (!processedCategoryKeys.has(partentKey)) {
                const parent = await this.categoryRepository.upsert({
                    oracleId: item.COD_PAI,
                    name: item.DESC_PAI,
                    level: 1,
                    brandId: brand.id,
                    sourceTable: 'PRODUTO_CLASSIFICACAO',
                    sourceColumn: 'PCL_CODIGO'
                });
                processedCategoryKeys.add(partentKey);
            }

            const childKey = `2-${item.COD_FILHO}-${brand.id}`;
            if (processedCategoryKeys.has(childKey)) {
                const parentId = await this.categoryRepository.getId({
                    oracleId: item.COD_PAI,
                    sourceTable: 'PRODUTO_CLASSIFICACAO',
                    sourceColumn: 'PCL_CODIGO'
                });

                const child = await this.categoryRepository.upsert({
                    oracleId: item.COD_FILHO,
                    name: item.DESC_FILHO,
                    level: 2,
                    parentId,
                    brandId: brand.id,
                    sourceTable: 'TIPO',
                    sourceColumn: 'TPO_CODIGO'
                });
                processedCategoryKeys.add(childKey);
            }


            if (item.COD_NETO) {
                const grandChildKey = `3-${item.COD_NETO}-${brand.id}`;
                if(!processedCategoryKeys.has(grandChildKey)) {
                    const childId = await this.categoryRepository.getId({
                        oracleId: item.COD_FILHO,
                        sourceTable: 'TIPO',
                        sourceColumn: 'TPO_CODIGO'
                    });

                    await this.categoryRepository.upsert({
                        oracleId: item.COD_NETO,
                        name: item.DESC_NETO,
                        level: 3,
                        parentId: childId,
                        brandId: brand.id,
                        sourceTable: 'PRODUTO_SUBCLASSIFICACAO',
                        sourceColumn: 'SCL_CODIGO'
                    });
                }
            }
        }
    }



    //método de teste de resultado de query.
    async getCategoriasToSync(): Promise<any[]> {
        return this.categoriaSyncRepository.getCategoriasToSync();
    }
}