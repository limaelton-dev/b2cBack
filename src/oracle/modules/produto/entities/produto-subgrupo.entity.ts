import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PRODUTO_SUBGRUPO' })
export class ProdutoSubgrupo {
  @PrimaryColumn({ name: 'PSG_CODIGO', type: 'number', precision: 6, scale: 0 })
  psg_codigo: number;

  @Column({"name": "PSG_DESCRICAO", "nullable": false, "type": "varchar2", "length": 50})
  psg_descricao: string;
  @Column({"name": "PSG_CODIFICACAO", "nullable": false, "type": "number", "precision": 1, "scale": 0})
  psg_codificacao: number;
  @Column({"name": "PSG_NUMGRUPO", "nullable": true, "type": "varchar2", "length": 2})
  psg_numgrupo: string;
  @Column({"name": "PSG_DESCGRUPO", "nullable": true, "type": "varchar2", "length": 40})
  psg_descgrupo: string;
  @Column({"name": "PSG_NUMSUBGRUPO", "nullable": true, "type": "varchar2", "length": 2})
  psg_numsubgrupo: string;
  @Column({"name": "PSG_DESCSUBGRUPO", "nullable": true, "type": "varchar2", "length": 40})
  psg_descsubgrupo: string;
  @Column({"name": "PSG_INCLUIDATA", "nullable": true, "type": "date"})
  psg_incluidata: Date;
  @Column({"name": "PSG_INCLUIPOR", "nullable": true, "type": "varchar2", "length": 40})
  psg_incluipor: string;
  @Column({"name": "PSG_ALTERADATA", "nullable": true, "type": "date"})
  psg_alteradata: Date;
  @Column({"name": "PSG_ALTERAPOR", "nullable": true, "type": "varchar2", "length": 40})
  psg_alterapor: string;
}
