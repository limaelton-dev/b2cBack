import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PRODUTO_MODELO' })
export class ProdutoModelo {
  @PrimaryColumn({ name: 'PMO_CODIGO', type: 'number', precision: 6, scale: 0 })
  pmo_codigo: number;

  @Column({"name": "PMO_NUMERO", "nullable": false, "type": "varchar2", "length": 4})
  pmo_numero: string;
  @Column({"name": "PGR_NUMERO", "nullable": false, "type": "varchar2", "length": 4})
  pgr_numero: string;
  @Column({"name": "PMO_DESCRICAO", "nullable": true, "type": "varchar2", "length": 60})
  pmo_descricao: string;
  @Column({"name": "PMO_INCLUIPOR", "nullable": true, "type": "varchar2", "length": 40})
  pmo_incluipor: string;
  @Column({"name": "PMO_INCLUIDATA", "nullable": true, "type": "date"})
  pmo_incluidata: Date;
  @Column({"name": "PMO_ALTERAPOR", "nullable": true, "type": "varchar2", "length": 40})
  pmo_alterapor: string;
  @Column({"name": "PMO_ALTERADATA", "nullable": true, "type": "date"})
  pmo_alteradata: Date;
  @Column({"name": "PGR_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pgr_codigo: number;
}
