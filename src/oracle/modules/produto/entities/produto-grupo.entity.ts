import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PRODUTO_GRUPO' })
export class ProdutoGrupo {
  @PrimaryColumn({ name: 'PGR_CODIGO', type: 'number', precision: 6, scale: 0 })
  pgr_codigo: number;

  @Column({"name": "PGR_NUMERO", "nullable": false, "type": "varchar2", "length": 4})
  pgr_numero: string;
  @Column({"name": "PGR_DESCRICAO", "nullable": false, "type": "varchar2", "length": 60})
  pgr_descricao: string;
  @Column({"name": "PGR_INCLUIPOR", "nullable": false, "type": "varchar2", "length": 40})
  pgr_incluipor: string;
  @Column({"name": "PGR_INCLUIDATA", "nullable": false, "type": "date"})
  pgr_incluidata: Date;
  @Column({"name": "PGR_ALTERAPOR", "nullable": false, "type": "varchar2", "length": 40})
  pgr_alterapor: string;
  @Column({"name": "PGR_ALTERADATA", "nullable": false, "type": "date"})
  pgr_alteradata: Date;
  @Column({"name": "FAM_NUMERO", "nullable": true, "type": "varchar2", "length": 4})
  fam_numero: string;
  @Column({"name": "TIM_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  tim_codigo: number;
  @Column({"name": "PGR_SITUACAO", "nullable": true, "type": "number", "precision": 1, "scale": 0})
  pgr_situacao: number;
}
