import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Produto } from 'src/models/produto/produto';

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
    ) {}

    async getProduto(id: number): Promise<Produto> {
        const product = this.produtoRepository.findOne({where: {pro_codigo: id}});
        
        if (!product) {
            throw new NotFoundException(`Produto com id '${id}' não encontrado`);
        }

        return product;
    }

    async buscarProduto(s: string): Promise<Produto[]> {
        return this.produtoRepository.find({
            where: {
                pro_descricao: ILike(`%${s}%`),
            },
        });
    }
}
