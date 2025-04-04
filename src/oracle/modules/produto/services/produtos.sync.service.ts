import { Injectable } from '@nestjs/common';
import { ProdutosSyncRepository } from '../repositories/produtos.sync.repository';

@Injectable()
export class ProdutosSyncService {
  constructor(private readonly produtosSyncRepository: ProdutosSyncRepository) {}

  async getProdutosToSync(limit: number, offset: number): Promise<any[]> {
    return this.produtosSyncRepository.getProdutosToSync(limit, offset);
  }
}