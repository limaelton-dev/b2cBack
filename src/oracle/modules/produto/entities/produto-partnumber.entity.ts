import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PRODUTO_PARTNUMBER' })
export class ProdutoPartnumber {
  @PrimaryColumn({ name: 'PPN_ITEM', type: 'number', precision: 6, scale: 0 })
  ppn_item: number;

  @Column({"name": "PSG_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  psg_codigo: number;
  @Column({"name": "PPN_DESCRICAO", "nullable": false, "type": "varchar2", "length": 100})
  ppn_descricao: string;
  @Column({"name": "PPN_NUMERO", "nullable": false, "type": "varchar2", "length": 3})
  ppn_numero: string;
  @Column({"name": "PPN_NUMVARCABO", "nullable": true, "type": "varchar2", "length": 2})
  ppn_numvarcabo: string;
  @Column({"name": "PPN_DESCVARCABO", "nullable": true, "type": "varchar2", "length": 40})
  ppn_descvarcabo: string;
  @Column({"name": "PPN_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  ppn_codigo: number;
  @Column({"name": "PPN_CODVARCABO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  ppn_codvarcabo: number;
}
