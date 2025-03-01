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

    async findById(id: number): Promise<Produto> {
        const produto = await this.produtoRepository.findOne({
            where: { id }
        });
        
        if (!produto) {
            throw new NotFoundException(`Produto com ID ${id} não encontrado`);
        }
        
        return produto;
    }

    async getProdutosLimit(limit: number, categoria?: string): Promise<Produto[]> {
        const query = this.produtoRepository
            .createQueryBuilder('produto')
            .leftJoinAndSelect('produto.imagens', 'imagem')
            .leftJoinAndSelect('produto.tipo', 'tipo')
            .distinctOn(['produto.pro_codigo'])
            .orderBy('produto.pro_codigo', 'DESC')
            .addOrderBy('produto.id', 'DESC')
            .limit(limit);
    
        if (categoria) {
            const categoriasArray = categoria.split(',').map(Number);
            query.where('produto.tpo_codigo IN (:...tpo_codigo)', { tpo_codigo: categoriasArray });
        }
    
        return await query.getMany();
    }

    async buscarProduto(s: string): Promise<Produto[]> {
        return this.produtoRepository.find({
            where: {
                pro_descricao: ILike(`%${s}%`),
            },
        });
    }
}
