import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from 'src/models/produto/produto';
import { Like } from 'typeorm';

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
    ) {}

    async buscarProduto(descricao: string): Promise<Produto[]> {
        return this.produtoRepository.find({
            where: {
                pro_descricao: Like(`%${descricao}%`),
            },
        });
    }
}
