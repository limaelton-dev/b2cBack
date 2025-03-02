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
            return await this.produtoRepository.find({
                where: {id: In(prods)},
                relations: ['tipo', 'imagens']
            });
        }
        else {
            const product = await this.produtoRepository.find({
                where: {id: parseInt(ids)},
                relations: ['tipo', 'imagens', 'fabricante']
            });
            return product;
        }
    }

    async findById(id: number): Promise<Produto> {
        const produto = await this.produtoRepository.findOne({
            where: { id },
        });
        
        if (!produto) {
            throw new NotFoundException(`Produto com ID ${id} não encontrado`);
        }
        
        return produto;
    }

    async getProdutosLimit(limit: number, categoria?: string, s?: string): Promise<Produto[]> {
        const query = this.produtoRepository
            .createQueryBuilder('produto')
            .leftJoinAndSelect('produto.imagens', 'imagem')
            .leftJoinAndSelect('produto.tipo', 'tipo')
            .distinctOn(['produto.pro_codigo'])
            .orderBy('produto.pro_codigo', 'DESC')
            .addOrderBy('produto.id', 'DESC')
            .limit(limit)

        if(s) {
            query.where('produto.pro_desc_tecnica ILIKE :s', { s: `%${s}%` });
        }
    
        if (categoria) {
            const categoriasArray = categoria.split(',').map(Number);
            query.where('produto.tpo_codigo IN (:...tpo_codigo)', { tpo_codigo: categoriasArray });
        }
    
        return await query.getMany();
    }
    
}
