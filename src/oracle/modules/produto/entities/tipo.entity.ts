import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TIPO' })
export class Tipo {
  @PrimaryColumn({ name: 'TPO_CODIGO', type: 'number', precision: 6, scale: 0 })
  tpo_codigo: number;

  @Column({"name": "TPO_DESCRICAO", "nullable": false, "type": "varchar2", "length": 40})
  tpo_descricao: string;
  @Column({"name": "TPO_INCLUIDATA", "nullable": false, "type": "date"})
  tpo_incluidata: Date;
  @Column({"name": "TPO_INCLUIPOR", "nullable": false, "type": "varchar2", "length": 40})
  tpo_incluipor: string;
  @Column({"name": "TPO_ALTERADATA", "nullable": false, "type": "date"})
  tpo_alteradata: Date;
  @Column({"name": "TPO_ALTERAPOR", "nullable": false, "type": "varchar2", "length": 40})
  tpo_alterapor: string;
  @Column({"name": "TPO_ATC_ATIVO", "nullable": true, "type": "number", "precision": 1, "scale": 0})
  tpo_atc_ativo: number;
  @Column({"name": "TPO_ATC_ACAO", "nullable": true, "type": "char", "length": 1})
  tpo_atc_acao: string;
  @Column({"name": "TPO_COMERCIALIZACAO", "nullable": true, "type": "number"})
  tpo_comercializacao: number;
  @Column({"name": "TPO_SIGLA", "nullable": true, "type": "varchar2", "length": 2})
  tpo_sigla: string;
  @Column({"name": "TPO_INVENTARIO", "nullable": true, "type": "number", "precision": 1, "scale": 0})
  tpo_inventario: number;
  @Column({"name": "TPO_CONSTASITE", "nullable": true, "type": "number", "precision": 1, "scale": 0})
  tpo_constasite: number;
  @Column({"name": "TPO_URL_BANNER_SITE", "nullable": true, "type": "varchar2", "length": 400})
  tpo_url_banner_site: string;
}
