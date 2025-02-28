import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Produto } from 'src/models/produto/produto';

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
    ) {}

    async getProduto(ids: string): Promise<Produto[]> {

        if(ids.includes(',')) {
            const prods = ids.split(',').map(Number);
            return await this.produtoRepository.find({where: {pro_codigo: In(prods)}})
        }
        else {
            const product = this.produtoRepository.find({where: {pro_codigo: parseInt(ids)}});
            return product;
        }
    }

    async getProdutosLimit(limit: number): Promise<Produto[]> {
        return await this.produtoRepository
            .createQueryBuilder('produto')
            .leftJoinAndSelect('produto.imagens', 'imagem')
            .distinctOn(['produto.pro_codigo'])
            .orderBy('produto.pro_codigo', 'DESC')
            .limit(limit)
            .getMany();

  
    }

    async buscarProduto(s: string): Promise<Produto[]> {
        return this.produtoRepository.find({
            where: {
                pro_descricao: ILike(`%${s}%`),
            },
        });
    }
}
