import { Injectable } from '@nestjs/common';
import { CategoriasSyncRepository } from '../repositories/categorias.sync.repository';

@Injectable()
export class ProductSyncService {
  constructor(private readonly categoriaSyncRepository: CategoriasSyncRepository) {}

  async getProdutosToSync(limit: number, offset: number): Promise<any[]> {
    return this.categoriaSyncRepository.getCategoriasToSync();
  }
}