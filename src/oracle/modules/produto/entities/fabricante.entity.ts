import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'FABRICANTE' })
export class Fabricante {
  @PrimaryColumn({ name: 'FAB_CODIGO', type: 'number', precision: 6, scale: 0 })
  fab_codigo: number;

  @Column({"name": "FAB_DESCRICAO", "nullable": false, "type": "varchar2", "length": 40})
  fab_descricao: string;
  @Column({"name": "FAB_INCLUIDATA", "nullable": false, "type": "date"})
  fab_incluidata: Date;
  @Column({"name": "FAB_INCLUIPOR", "nullable": false, "type": "varchar2", "length": 40})
  fab_incluipor: string;
  @Column({"name": "FAB_ALTERADATA", "nullable": false, "type": "date"})
  fab_alteradata: Date;
  @Column({"name": "FAB_ALTERAPOR", "nullable": false, "type": "varchar2", "length": 40})
  fab_alterapor: string;
  @Column({"name": "FAB_ESTOQUE", "nullable": true, "type": "number", "precision": 3, "scale": 0})
  fab_estoque: number;
  @Column({"name": "FAB_PREMIACAO", "nullable": true, "type": "varchar2", "length": 1})
  fab_premiacao: string;
  @Column({"name": "FAB_BLOQUEIOTAB", "nullable": true, "type": "varchar2", "length": 1})
  fab_bloqueiotab: string;
  @Column({"name": "FAB_METAMINIMA", "nullable": true, "type": "number", "precision": 14, "scale": 2})
  fab_metaminima: number;
  @Column({"name": "FAB_METAMINIMA_UF", "nullable": true, "type": "number", "precision": 14, "scale": 2})
  fab_metaminima_uf: number;
  @Column({"name": "FAB_PERC_PREMIACAO", "nullable": true, "type": "number", "precision": 14, "scale": 2})
  fab_perc_premiacao: number;
  @Column({"name": "FAB_VPC", "nullable": true, "type": "varchar2", "length": 1})
  fab_vpc: string;
  @Column({"name": "FAB_PERCVPC", "nullable": true, "type": "number", "precision": 5, "scale": 2})
  fab_percvpc: number;
  @Column({"name": "FAB_MARCA", "nullable": true, "type": "varchar2", "length": 1})
  fab_marca: string;
  @Column({"name": "FAB_NUMFAB", "nullable": true, "type": "varchar2", "length": 3})
  fab_numfab: string;
}
