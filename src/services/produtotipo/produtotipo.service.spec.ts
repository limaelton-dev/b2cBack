import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoTipoService } from './produtotipo.service';

describe('ProdutoService', () => {
  let service: ProdutoTipoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutoTipoService],
    }).compile();

    service = module.get<ProdutoTipoService>(ProdutoTipoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
