import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Produto } from 'src/models/produto/produto';

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
    ) {}

    async buscarProduto(s: string): Promise<Produto[]> {
        return this.produtoRepository.find({
            where: {
                pro_descricao: ILike(`%${s}%`),
            },
        });
    }
}
