import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ProdutosSyncService } from '../services/produtos.sync.service';
import { CategoriasSyncService } from '../../categorias/services/categorias.sync.service';

@Controller('products')
export class ProdutoSyncController {
  constructor(
    private readonly productSyncService: ProdutosSyncService,
    private readonly categoriasSyncService: CategoriasSyncService,
  ) {}

  @Get('sync')
  async getProductsToSync(
    @Query('limit', new DefaultValuePipe(1000), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.productSyncService.syncFromOracle(limit, offset);
  }

  @Get('sync/categorias')
  async getCategoriasToSync() {
    return this.categoriasSyncService.syncCategorysFromOracle();
  }
}