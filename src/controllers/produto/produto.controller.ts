import { Controller, Get, Param, Query } from '@nestjs/common';
import { Produto } from 'src/models/produto/produto';
import { ProdutoService } from 'src/services/produto/produto.service';

@Controller('produtos')
export class ProdutoController {
    constructor(private readonly produtoService: ProdutoService) {}

    @Get(':id')
    async getProductByCodigo(@Param('id') id: number): Promise<Produto> {
        return this.produtoService.getProduto(id);
    }

    @Get()
    async buscarProdutos(@Query('s') s: string): Promise<Produto[]> {
        return this.produtoService.buscarProduto(s);
    }
}
