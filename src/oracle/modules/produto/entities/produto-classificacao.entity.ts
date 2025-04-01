import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PRODUTO_CLASSIFICACAO' })
export class ProdutoClassificacao {
  @PrimaryColumn({ name: 'PCL_CODIGO', type: 'number', precision: 6, scale: 0 })
  pcl_codigo: number;

  @Column({"name": "PCL_DESCRICAO", "nullable": false, "type": "varchar2", "length": 50})
  pcl_descricao: string;
  @Column({"name": "PCL_ATIVO", "nullable": false, "type": "number", "precision": 1, "scale": 0})
  pcl_ativo: number;
  @Column({"name": "PCL_INCLUIPOR", "nullable": false, "type": "varchar2", "length": 40})
  pcl_incluipor: string;
  @Column({"name": "PCL_INCLUIDATA", "nullable": false, "type": "date"})
  pcl_incluidata: Date;
  @Column({"name": "PCL_ALTERAPOR", "nullable": true, "type": "varchar2", "length": 40})
  pcl_alterapor: string;
  @Column({"name": "PCL_ALTERADATA", "nullable": true, "type": "date"})
  pcl_alteradata: Date;
  @Column({"name": "PCL_CONSTASITE", "nullable": false, "type": "number", "precision": 1, "scale": 0})
  pcl_constasite: number;
  @Column({"name": "PCL_URL_BANNER_SITE", "nullable": true, "type": "varchar2", "length": 400})
  pcl_url_banner_site: string;
}
