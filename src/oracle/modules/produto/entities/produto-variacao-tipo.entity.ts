import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PRODUTO_VARIACAO_TIPO' })
export class ProdutoVariacaoTipo {
  @PrimaryColumn({ name: 'PVT_CODIGO', type: 'number', precision: 1, scale: 0 })
  pvt_codigo: number;

  @Column({"name": "PVT_DESCRICAO", "nullable": true, "type": "varchar2", "length": 40})
  pvt_descricao: string;
  @Column({"name": "PVT_TAMANHONUM", "nullable": true, "type": "number", "precision": 1, "scale": 0})
  pvt_tamanhonum: number;
}
