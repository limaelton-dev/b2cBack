import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PRODUTO_FAMILIA' })
export class ProdutoFamilia {
  @PrimaryColumn({ name: 'FAM_CODIGO', type: 'number', precision: 6, scale: 0 })
  fam_codigo: number;

  @Column({"name": "FAM_NUMERO", "nullable": false, "type": "varchar2", "length": 4})
  fam_numero: string;
  @Column({"name": "FAM_DESCRICAO", "nullable": false, "type": "varchar2", "length": 60})
  fam_descricao: string;
  @Column({"name": "FAM_INCLUIPOR", "nullable": false, "type": "varchar2", "length": 40})
  fam_incluipor: string;
  @Column({"name": "FAM_INCLUIDATA", "nullable": false, "type": "date"})
  fam_incluidata: Date;
  @Column({"name": "FAM_ALTERAPOR", "nullable": false, "type": "varchar2", "length": 40})
  fam_alterapor: string;
  @Column({"name": "FAM_ALTERADATA", "nullable": false, "type": "date"})
  fam_alteradata: Date;
  @Column({"name": "FAM_INSPQUA", "nullable": true, "type": "varchar2", "length": 1})
  fam_inspqua: string;
  @Column({"name": "FAM_INSPEST", "nullable": true, "type": "varchar2", "length": 1})
  fam_inspest: string;
}
