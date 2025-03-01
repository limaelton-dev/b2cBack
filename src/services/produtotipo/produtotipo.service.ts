import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { ProdutoTipo } from 'src/models/produto/produtotipo';

@Injectable()
export class ProdutoTipoService {
    constructor(
        @InjectRepository(ProdutoTipo)
        private produtoTipoRepository: Repository<ProdutoTipo>,
    ) {}

    async getProdutosTipoLimit(limit: number): Promise<ProdutoTipo[]> {
        const query = this.produtoTipoRepository
            .createQueryBuilder('produtotipo')
            .limit(limit);
    
        return await query.getMany();
    }
}
