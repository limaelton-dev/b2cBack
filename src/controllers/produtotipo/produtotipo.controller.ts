import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProdutoTipo } from 'src/models/produto/produtotipo';
import { ProdutoTipoService } from 'src/services/produtotipo/produtotipo.service';


@Controller('produtotipo')
export class ProdutoTipoController {
    constructor(private readonly produtoTipoService: ProdutoTipoService) {}

    @Get()
    async getProdutosTipoLimit(@Query('limit') limit: number): Promise<ProdutoTipo[]> {
        return this.produtoTipoService.getProdutosTipoLimit(limit);
    }
}
