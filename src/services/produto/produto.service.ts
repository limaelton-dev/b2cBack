import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Produto } from 'src/models/produto/produto';
import { Cores } from 'src/models/cores/cores';

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
    ) {}

    async getProduto(ids: string): Promise<Produto[]> {

        if(ids.includes(',')) {
            const prods = ids.split(',').map(Number);
            return await this.produtoRepository.find({where: {pro_codigo: In(prods)}, relations: ['cores']})
        }
        else {
            const product = this.produtoRepository.find({where: {pro_codigo: parseInt(ids)}, relations: ['cores']});
            return product;
        }
    }

    async buscarProduto(s: string): Promise<Produto[]> {
        return this.produtoRepository.find({
            where: {
                pro_descricao: ILike(`%${s}%`),
            },
        });
    }
}
