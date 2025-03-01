import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoTipoController } from './produtotipo.controller';

describe('ProdutoTipoController', () => {
  let controller: ProdutoTipoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoTipoController],
    }).compile();

    controller = module.get<ProdutoTipoController>(ProdutoTipoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
