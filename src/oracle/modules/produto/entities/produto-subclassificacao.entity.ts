import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PRODUTO_SUBCLASSIFICACAO' })
export class ProdutoSubclassificacao {
  @PrimaryColumn({ name: 'SCL_CODIGO', type: 'number', precision: 6, scale: 0 })
  scl_codigo: number;

  @Column({"name": "SCL_DESCRICAO", "nullable": false, "type": "varchar2", "length": 50})
  scl_descricao: string;
  @Column({"name": "SCL_ATIVO", "nullable": false, "type": "number", "precision": 1, "scale": 0})
  scl_ativo: number;
  @Column({"name": "SCL_INCLUIPOR", "nullable": false, "type": "varchar2", "length": 40})
  scl_incluipor: string;
  @Column({"name": "SCL_INCLUIDATA", "nullable": false, "type": "date"})
  scl_incluidata: Date;
  @Column({"name": "SCL_ALTERAPOR", "nullable": true, "type": "varchar2", "length": 40})
  scl_alterapor: string;
  @Column({"name": "SCL_ALTERADATA", "nullable": true, "type": "date"})
  scl_alteradata: Date;
  @Column({"name": "SCL_URL_BANNER_SITE", "nullable": true, "type": "varchar2", "length": 400})
  scl_url_banner_site: string;
}
