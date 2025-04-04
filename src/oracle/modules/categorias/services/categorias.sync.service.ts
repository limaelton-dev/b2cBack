import { Injectable } from '@nestjs/common';
import { CategoriasSyncRepository } from '../repositories/categorias.sync.repository';

@Injectable()
export class CategoriasSyncService {
  constructor(private readonly categoriaSyncRepository: CategoriasSyncRepository) {}

  async getCategoriasToSync(): Promise<any[]> {
    return this.categoriaSyncRepository.getCategoriasToSync();
  }
}