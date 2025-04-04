import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ProdutosSyncService } from '../services/produtos.sync.service';
import { CategoriasSyncRepository } from '../../categorias/repositories/categorias.sync.repository';

@Controller('products')
export class ProdutoSyncController {
  constructor(
    private readonly productSyncService: ProdutosSyncService,
    private readonly categoriasSyncService: CategoriasSyncRepository,
  ) {}

  @Get('sync')
  async getProductsToSync(
    @Query('limit', new DefaultValuePipe(1000), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.productSyncService.getProdutosToSync(limit, offset);
  }

  @Get('sync/categorias')
  async getCategoriasToSync() {
    return this.categoriasSyncService.getCategoriasToSync();
  }
}