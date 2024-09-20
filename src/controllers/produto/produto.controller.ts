import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProdutoService } from 'src/services/produto/produto.service';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  async buscarProdutos(@Query('s') s: string) {
    return this.produtoService.buscarProduto(s);
  }
}
