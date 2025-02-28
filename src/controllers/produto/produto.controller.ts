import { Controller, Get, Param, Query } from '@nestjs/common';
import { Produto } from 'src/models/produto/produto';
import { ProdutoService } from 'src/services/produto/produto.service';

@Controller('produtos')
export class ProdutoController {
    constructor(private readonly produtoService: ProdutoService) {}

    @Get(':ids')
    async getProductByCodigo(@Param('ids') ids: string): Promise<Produto[]> {
        return this.produtoService.getProduto(ids);
    }

    @Get()
    async getProductsLimit(@Query('limit') limit: number): Promise<Produto[]> {
        return this.produtoService.getProdutosLimit(limit);
    }

    @Get()
    async buscarProdutos(@Query('s') s: string): Promise<Produto[]> {
        return this.produtoService.buscarProduto(s);
    }
}
