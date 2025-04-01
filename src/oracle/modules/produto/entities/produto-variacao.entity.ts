import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PRODUTO_VARIACAO' })
export class ProdutoVariacao {
  @PrimaryColumn({ name: 'PVR_CODIGO', type: 'number', precision: 6, scale: 0 })
  pvr_codigo: number;

  @Column({"name": "PVR_DESCRICAO", "nullable": true, "type": "varchar2", "length": 50})
  pvr_descricao: string;
  @Column({"name": "PVR_NUMERO", "nullable": true, "type": "varchar2", "length": 2})
  pvr_numero: string;
  @Column({"name": "PVT_CODIGO", "nullable": false, "type": "number", "precision": 1, "scale": 0})
  pvt_codigo: number;
  @Column({"name": "PVR_NUMFAMILIA", "nullable": true, "type": "varchar2", "length": 2})
  pvr_numfamilia: string;
  @Column({"name": "PVR_DESCFAMILIA", "nullable": true, "type": "varchar2", "length": 60})
  pvr_descfamilia: string;
  @Column({"name": "PVR_INCLUIDATA", "nullable": true, "type": "date"})
  pvr_incluidata: Date;
  @Column({"name": "PVR_INCLUIPOR", "nullable": true, "type": "varchar2", "length": 40})
  pvr_incluipor: string;
  @Column({"name": "PVR_ALTERADATA", "nullable": true, "type": "date"})
  pvr_alteradata: Date;
  @Column({"name": "PVR_ALTERAPOR", "nullable": true, "type": "varchar2", "length": 40})
  pvr_alterapor: string;
  @Column({"name": "PVR_TIPOVARIACAO", "nullable": true, "type": "varchar2", "length": 40})
  pvr_tipovariacao: string;
}
