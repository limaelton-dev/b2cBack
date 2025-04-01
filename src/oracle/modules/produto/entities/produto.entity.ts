import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PRODUTO' })
export class Produto {
  @PrimaryColumn({ name: 'PRO_CODIGO', type: 'number', precision: 8, scale: 0 })
  pro_codigo: number;

  @Column({"name": "LUC_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  luc_codigo: number;
  @Column({"name": "ARE_CODIGO", "nullable": false, "type": "number", "precision": 6, "scale": 0})
  are_codigo: number;
  @Column({"name": "GRU_CODIGO", "nullable": false, "type": "number", "precision": 6, "scale": 0})
  gru_codigo: number;
  @Column({"name": "TPO_CODIGO", "nullable": false, "type": "number", "precision": 6, "scale": 0})
  tpo_codigo: number;
  @Column({"name": "FAB_CODIGO", "nullable": false, "type": "number", "precision": 6, "scale": 0})
  fab_codigo: number;
  @Column({"name": "CCF_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  ccf_codigo: number;
  @Column({"name": "IND_CODIGO", "nullable": false, "type": "number", "precision": 6, "scale": 0})
  ind_codigo: number;
  @Column({"name": "FCC_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  fcc_codigo: number;
  @Column({"name": "PRO_REFERENCIA", "nullable": true, "type": "varchar2", "length": 15})
  pro_referencia: string;
  @Column({"name": "PRO_DESCRICAO", "nullable": false, "type": "varchar2", "length": 45})
  pro_descricao: string;
  @Column({"name": "PRO_DESCRICAONF", "nullable": false, "type": "varchar2", "length": 45})
  pro_descricaonf: string;
  @Column({"name": "PRO_COMPLEMENTO", "nullable": true, "type": "varchar2", "length": 20})
  pro_complemento: string;
  @Column({"name": "PRO_CATEGORIA", "nullable": false, "type": "varchar2", "length": 1})
  pro_categoria: string;
  @Column({"name": "PRO_UNIDADE", "nullable": true, "type": "varchar2", "length": 5})
  pro_unidade: string;
  @Column({"name": "PRO_PESOBRUTO", "nullable": true, "type": "number", "precision": 14, "scale": 3})
  pro_pesobruto: number;
  @Column({"name": "PRO_PESOLIQUIDO", "nullable": true, "type": "number", "precision": 14, "scale": 3})
  pro_pesoliquido: number;
  @Column({"name": "PRO_LOCALIZACAO", "nullable": true, "type": "varchar2", "length": 15})
  pro_localizacao: string;
  @Column({"name": "PRO_GRAUIMPORTANCIA", "nullable": false, "type": "varchar2", "length": 1})
  pro_grauimportancia: string;
  @Column({"name": "PRO_PRAZOGARANTIA", "nullable": true, "type": "number", "precision": 4, "scale": 0})
  pro_prazogarantia: number;
  @Column({"name": "PRO_CST", "nullable": true, "type": "varchar2", "length": 3})
  pro_cst: string;
  @Column({"name": "PRO_ATIVO", "nullable": false, "type": "varchar2", "length": 1})
  pro_ativo: string;
  @Column({"name": "PRO_IPI", "nullable": true, "type": "number", "precision": 6, "scale": 2})
  pro_ipi: number;
  @Column({"name": "PRO_ICMS", "nullable": true, "type": "number", "precision": 6, "scale": 2})
  pro_icms: number;
  @Column({"name": "PRO_IMPORTACAO", "nullable": true, "type": "number", "precision": 6, "scale": 2})
  pro_importacao: number;
  @Column({"name": "PRO_CUSTO01", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo01: number;
  @Column({"name": "PRO_CUSTO02", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo02: number;
  @Column({"name": "PRO_CUSTO03", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo03: number;
  @Column({"name": "PRO_CUSTO04", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo04: number;
  @Column({"name": "PRO_CUSTO05", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo05: number;
  @Column({"name": "PRO_CUSTO06", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo06: number;
  @Column({"name": "PRO_CUSTO07", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo07: number;
  @Column({"name": "PRO_CUSTO08", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo08: number;
  @Column({"name": "PRO_CUSTO09", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo09: number;
  @Column({"name": "PRO_CUSTO10", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo10: number;
  @Column({"name": "PRO_CUSTO11", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo11: number;
  @Column({"name": "PRO_CUSTO12", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_custo12: number;
  @Column({"name": "PRO_CUSTOMEDIO", "nullable": true, "type": "number", "precision": 14, "scale": 4})
  pro_customedio: number;
  @Column({"name": "PRO_MARGEMCUSTO", "nullable": true, "type": "number", "precision": 14, "scale": 2})
  pro_margemcusto: number;
  @Column({"name": "PRO_MARGEMFRETE", "nullable": true, "type": "number", "precision": 14, "scale": 2})
  pro_margemfrete: number;
  @Column({"name": "PRO_CALCULOPRECOAUTO", "nullable": false, "type": "varchar2", "length": 1})
  pro_calculoprecoauto: string;
  @Column({"name": "PRO_PRECOVENDA01", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda01: number;
  @Column({"name": "PRO_PRECOVENDA02", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda02: number;
  @Column({"name": "PRO_PRECOVENDA03", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda03: number;
  @Column({"name": "PRO_PRECOVENDA04", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda04: number;
  @Column({"name": "PRO_PRECOVENDA05", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda05: number;
  @Column({"name": "PRO_PRECOVENDA06", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda06: number;
  @Column({"name": "PRO_PRECOVENDA07", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda07: number;
  @Column({"name": "PRO_PRECOVENDA08", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda08: number;
  @Column({"name": "PRO_PRECOVENDA09", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda09: number;
  @Column({"name": "PRO_PRECOVENDA10", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda10: number;
  @Column({"name": "PRO_PRECOVENDA11", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda11: number;
  @Column({"name": "PRO_PRECOVENDA12", "nullable": true, "type": "number", "precision": 16, "scale": 4})
  pro_precovenda12: number;
  @Column({"name": "PRO_CONSTALISTAPRECO", "nullable": false, "type": "varchar2", "length": 1})
  pro_constalistapreco: string;
  @Column({"name": "PRO_QTDADEMINIMACOMPRA", "nullable": true, "type": "number", "precision": 10, "scale": 3})
  pro_qtdademinimacompra: number;
  @Column({"name": "PRO_ESTOQUEMINIMO", "nullable": true, "type": "number", "precision": 10, "scale": 3})
  pro_estoqueminimo: number;
  @Column({"name": "PRO_ESTOQUEMAXIMO", "nullable": true, "type": "number", "precision": 10, "scale": 3})
  pro_estoquemaximo: number;
  @Column({"name": "PRO_AUTOESTOQUEMINIMO", "nullable": false, "type": "varchar2", "length": 1})
  pro_autoestoqueminimo: string;
  @Column({"name": "PRO_AUTOESTOQUEMAXIMO", "nullable": false, "type": "varchar2", "length": 1})
  pro_autoestoquemaximo: string;
  @Column({"name": "PRO_PRODUCAO", "nullable": true, "type": "number", "precision": 10, "scale": 3})
  pro_producao: number;
  @Column({"name": "PRO_VALORULTIMACOMPRA", "nullable": true, "type": "number", "precision": 14, "scale": 2})
  pro_valorultimacompra: number;
  @Column({"name": "PRO_DATAULTIMACOMPRA", "nullable": true, "type": "date"})
  pro_dataultimacompra: Date;
  @Column({"name": "PRO_DATAULTIMAVENDA", "nullable": true, "type": "date"})
  pro_dataultimavenda: Date;
  @Column({"name": "PRO_DATAULTIMAPROPOSTA", "nullable": true, "type": "date"})
  pro_dataultimaproposta: Date;
  @Column({"name": "PRO_DATAULTIMACORRECAO", "nullable": true, "type": "date"})
  pro_dataultimacorrecao: Date;
  @Column({"name": "PRO_HORAULTIMACORRECAO", "nullable": true, "type": "varchar2", "length": 8})
  pro_horaultimacorrecao: string;
  @Column({"name": "PRO_CONFIRMANEGATIVO", "nullable": false, "type": "varchar2", "length": 1})
  pro_confirmanegativo: string;
  @Column({"name": "PRO_FATURANEGATIVO", "nullable": false, "type": "varchar2", "length": 1})
  pro_faturanegativo: string;
  @Column({"name": "PRO_DATACCONTAGEM", "nullable": true, "type": "date"})
  pro_dataccontagem: Date;
  @Column({"name": "PRO_DATARCONTAGEM", "nullable": true, "type": "date"})
  pro_datarcontagem: Date;
  @Column({"name": "PRO_QUANTIDADEEMBALAGEM", "nullable": true, "type": "number", "precision": 10, "scale": 3})
  pro_quantidadeembalagem: number;
  @Column({"name": "PRO_MOVIMENTAESTOQUE", "nullable": false, "type": "varchar2", "length": 1})
  pro_movimentaestoque: string;
  @Column({"name": "PRO_EMBALAGEMPADRAO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pro_embalagempadrao: number;
  @Column({"name": "PRO_PRODUTOESPECIAL", "nullable": true, "type": "varchar2", "length": 1})
  pro_produtoespecial: string;
  @Column({"name": "PRO_REGISTRANUMEROSERIE", "nullable": true, "type": "varchar2", "length": 1})
  pro_registranumeroserie: string;
  @Column({"name": "PRO_NUMEROSERIEINICIAL", "nullable": true, "type": "varchar2", "length": 50})
  pro_numeroserieinicial: string;
  @Column({"name": "PRO_EDITAPRECOVENDA", "nullable": true, "type": "varchar2", "length": 1})
  pro_editaprecovenda: string;
  @Column({"name": "PRO_INCLUIDATA", "nullable": false, "type": "date"})
  pro_incluidata: Date;
  @Column({"name": "PRO_INCLUIPOR", "nullable": false, "type": "varchar2", "length": 40})
  pro_incluipor: string;
  @Column({"name": "PRO_ALTERADATA", "nullable": false, "type": "date"})
  pro_alteradata: Date;
  @Column({"name": "PRO_ALTERAPOR", "nullable": false, "type": "varchar2", "length": 40})
  pro_alterapor: string;
  @Column({"name": "DIV_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  div_codigo: number;
  @Column({"name": "SUB_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  sub_codigo: number;
  @Column({"name": "REF_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  ref_codigo: number;
  @Column({"name": "PRO_ARREDONDAMENTO", "nullable": true, "type": "varchar2", "length": 1})
  pro_arredondamento: string;
  @Column({"name": "PRO_NEGOCIACAO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pro_negociacao: number;
  @Column({"name": "PRO_CUSTO_MINIMO", "nullable": true, "type": "number"})
  pro_custo_minimo: number;
  @Column({"name": "PRO_DIF", "nullable": true, "type": "number", "precision": 14, "scale": 2})
  pro_dif: number;
  @Column({"name": "PRO_MOD", "nullable": true, "type": "number", "precision": 14, "scale": 2})
  pro_mod: number;
  @Column({"name": "PRO_CSTVENDA", "nullable": true, "type": "varchar2", "length": 3})
  pro_cstvenda: string;
  @Column({"name": "PRO_DESCINGLES", "nullable": true, "type": "varchar2", "length": 200})
  pro_descingles: string;
  @Column({"name": "PRO_ICMSRECENT", "nullable": true, "type": "number", "precision": 6, "scale": 2})
  pro_icmsrecent: number;
  @Column({"name": "PRO_ICMSRECSAI", "nullable": true, "type": "number", "precision": 6, "scale": 2})
  pro_icmsrecsai: number;
  @Column({"name": "PRO_PONTO", "nullable": true, "type": "number", "precision": 14, "scale": 2})
  pro_ponto: number;
  @Column({"name": "FAM_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  fam_codigo: number;
  @Column({"name": "PGR_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pgr_codigo: number;
  @Column({"name": "PMO_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pmo_codigo: number;
  @Column({"name": "EMB_CODIGO", "nullable": true, "type": "number", "precision": 8, "scale": 0})
  emb_codigo: number;
  @Column({"name": "PRO_ATC_ATIVO", "nullable": true, "type": "number", "precision": 1, "scale": 0})
  pro_atc_ativo: number;
  @Column({"name": "PRO_ATC_ACAO", "nullable": true, "type": "char", "length": 1})
  pro_atc_acao: string;
  @Column({"name": "TPR_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  tpr_codigo: number;
  @Column({"name": "PRO_PREMIACAO", "nullable": true, "type": "varchar2", "length": 1})
  pro_premiacao: string;
  @Column({"name": "PRO_OFERTA", "nullable": true, "type": "varchar2", "length": 1})
  pro_oferta: string;
  @Column({"name": "PRO_DEMANDAMEDIA", "nullable": true, "type": "number", "precision": 14, "scale": 0})
  pro_demandamedia: number;
  @Column({"name": "PRO_CAIXACOLETIVA", "nullable": true, "type": "varchar2", "length": 2})
  pro_caixacoletiva: string;
  @Column({"name": "PRO_PRODREF", "nullable": true, "type": "varchar2", "length": 1})
  pro_prodref: string;
  @Column({"name": "PRO_CONSTAREL", "nullable": true, "type": "varchar2", "length": 1})
  pro_constarel: string;
  @Column({"name": "PRO_FABCODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pro_fabcodigo: number;
  @Column({"name": "PRO_MODELOFAB", "nullable": true, "type": "varchar2", "length": 40})
  pro_modelofab: string;
  @Column({"name": "PRO_FORALIN", "nullable": true, "type": "varchar2", "length": 1})
  pro_foralin: string;
  @Column({"name": "CST_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  cst_codigo: number;
  @Column({"name": "PRO_DES_TECNICA", "nullable": true, "type": "varchar2", "length": 80})
  pro_des_tecnica: string;
  @Column({"name": "PRO_ALTURA_EMB", "nullable": true, "type": "number", "precision": 8, "scale": 3})
  pro_altura_emb: number;
  @Column({"name": "PRO_LARGURA_EMB", "nullable": true, "type": "number", "precision": 8, "scale": 3})
  pro_largura_emb: number;
  @Column({"name": "PRO_COMPRIMENTO_EMB", "nullable": true, "type": "number", "precision": 8, "scale": 3})
  pro_comprimento_emb: number;
  @Column({"name": "PRO_PESO_EMB", "nullable": true, "type": "number", "precision": 8, "scale": 3})
  pro_peso_emb: number;
  @Column({"name": "PRO_ALTURA_PRO", "nullable": true, "type": "number", "precision": 8, "scale": 3})
  pro_altura_pro: number;
  @Column({"name": "PRO_LARGURA_PRO", "nullable": true, "type": "number", "precision": 8, "scale": 3})
  pro_largura_pro: number;
  @Column({"name": "PRO_COMPRIMENTO_PRO", "nullable": true, "type": "number", "precision": 8, "scale": 3})
  pro_comprimento_pro: number;
  @Column({"name": "PRO_PESO_PRO", "nullable": true, "type": "number", "precision": 8, "scale": 3})
  pro_peso_pro: number;
  @Column({"name": "PRO_CONTEUDO_EMB", "nullable": true, "type": "nvarchar2", "length": 2000})
  pro_conteudo_emb: string;
  @Column({"name": "PRO_MODELO_COM", "nullable": true, "type": "varchar2", "length": 40})
  pro_modelo_com: string;
  @Column({"name": "PRO_APRESENTACAO", "nullable": true, "type": "nvarchar2", "length": 4000})
  pro_apresentacao: string;
  @Column({"name": "PRO_VIDEO", "nullable": true, "type": "varchar2", "length": 100})
  pro_video: string;
  @Column({"name": "PRO_PROPCL1", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pro_propcl1: number;
  @Column({"name": "PRO_PROPCL2", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pro_propcl2: number;
  @Column({"name": "PRO_PROPCL3", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pro_propcl3: number;
  @Column({"name": "PRO_PROPCL4", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pro_propcl4: number;
  @Column({"name": "PRO_MPFCI", "nullable": true, "type": "varchar2", "length": 1})
  pro_mpfci: string;
  @Column({"name": "PRO_MEDIASUG", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pro_mediasug: number;
  @Column({"name": "PRO_BENEFICIADO", "nullable": true, "type": "varchar2", "length": 1})
  pro_beneficiado: string;
  @Column({"name": "PRO_DESCRICAOIMP", "nullable": true, "type": "varchar2", "length": 800})
  pro_descricaoimp: string;
  @Column({"name": "PRO_CONSTASITE", "nullable": true, "type": "varchar2", "length": 1})
  pro_constasite: string;
  @Column({"name": "PRO_CAIXAIND", "nullable": true, "type": "varchar2", "length": 1})
  pro_caixaind: string;
  @Column({"name": "POP_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pop_codigo: number;
  @Column({"name": "PRO_SRP", "nullable": true, "type": "number", "precision": 14, "scale": 2})
  pro_srp: number;
  @Column({"name": "PRO_DUN14", "nullable": true, "type": "varchar2", "length": 25})
  pro_dun14: string;
  @Column({"name": "PRO_COMISSAOEXTRA", "nullable": true, "type": "number", "precision": 10, "scale": 3})
  pro_comissaoextra: number;
  @Column({"name": "PRO_NF", "nullable": true, "type": "varchar2", "length": 1})
  pro_nf: string;
  @Column({"name": "ALF_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  alf_codigo: number;
  @Column({"name": "PRO_OBSPADRAO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pro_obspadrao: number;
  @Column({"name": "PRO_DESOBSPADRAO", "nullable": true, "type": "varchar2", "length": 300})
  pro_desobspadrao: string;
  @Column({"name": "PRO_EMBINTERMEDIARIA", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pro_embintermediaria: number;
  @Column({"name": "PRO_UTILMATERIAL", "nullable": true, "type": "varchar2", "length": 100})
  pro_utilmaterial: string;
  @Column({"name": "PRO_URL_AMIGAVEL", "nullable": true, "type": "varchar2", "length": 70})
  pro_url_amigavel: string;
  @Column({"name": "PRO_NOME_COMERCIAL", "nullable": true, "type": "varchar2", "length": 70})
  pro_nome_comercial: string;
  @Column({"name": "PRO_EDM", "nullable": true, "type": "varchar2", "length": 300})
  pro_edm: string;
  @Column({"name": "PRO_LANCAMENTO", "nullable": true, "type": "number", "precision": 1, "scale": 0})
  pro_lancamento: number;
  @Column({"name": "PRO_EXPIRA_LANC", "nullable": true, "type": "date"})
  pro_expira_lanc: Date;
  @Column({"name": "PRO_PARTNUM_SKU", "nullable": true, "type": "varchar2", "length": 20})
  pro_partnum_sku: string;
  @Column({"name": "PRO_CONSTASITE_B2B", "nullable": true, "type": "number", "precision": 1, "scale": 0})
  pro_constasite_b2b: number;
  @Column({"name": "COE_CODIGO", "nullable": true, "type": "number", "precision": 3, "scale": 0})
  coe_codigo: number;
  @Column({"name": "PRO_SOFTWARE", "nullable": true, "type": "varchar2", "length": 300})
  pro_software: string;
  @Column({"name": "PRO_MANUAL", "nullable": true, "type": "varchar2", "length": 300})
  pro_manual: string;
  @Column({"name": "PRO_ALTURA_EDM", "nullable": true, "type": "number", "precision": 8, "scale": 2})
  pro_altura_edm: number;
  @Column({"name": "PRO_LARGURA_EDM", "nullable": true, "type": "number", "precision": 8, "scale": 2})
  pro_largura_edm: number;
  @Column({"name": "PRO_KEYWORD", "nullable": true, "type": "varchar2", "length": 200})
  pro_keyword: string;
  @Column({"name": "PRO_METATAGS", "nullable": true, "type": "varchar2", "length": 200})
  pro_metatags: string;
  @Column({"name": "PRO_CODREF", "nullable": true, "type": "number", "precision": 8, "scale": 0})
  pro_codref: number;
  @Column({"name": "PRO_TIPOUSO", "nullable": true, "type": "varchar2", "length": 1})
  pro_tipouso: string;
  @Column({"name": "PSG_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  psg_codigo: number;
  @Column({"name": "PPN_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  ppn_codigo: number;
  @Column({"name": "PVR_CODIGO", "nullable": true, "type": "number", "precision": 6, "scale": 0})
  pvr_codigo: number;
  @Column({"name": "PRO_URL_FICHATEC", "nullable": true, "type": "varchar2", "length": 100})
  pro_url_fichatec: string;
  @Column({"name": "PRO_SITE_DESTAQUE", "nullable": true, "type": "varchar2", "length": 1})
  pro_site_destaque: string;
  @Column({"name": "PRO_URL_DROPBOX", "nullable": true, "type": "varchar2", "length": 100})
  pro_url_dropbox: string;
  @Column({"name": "PRO_APRESENTACAO2", "nullable": true, "type": "varchar2", "length": 2000})
  pro_apresentacao2: string;
  @Column({"name": "PRO_CONTEUDO_EMB2", "nullable": true, "type": "varchar2", "length": 1000})
  pro_conteudo_emb2: string;
  @Column({"name": "PRO_ID_MULTIEMPRESA", "nullable": true, "type": "number", "precision": 10, "scale": 0})
  pro_id_multiempresa: number;
  @Column({"name": "PRO_QTDVENMULTIPLO", "nullable": false, "type": "number", "precision": 4, "scale": 0})
  pro_qtdvenmultiplo: number;
  @Column({"name": "PRO_CERTIFICACAONES", "nullable": true, "type": "varchar2", "length": 1})
  pro_certificacaones: string;
  @Column({"name": "PRO_CERTIFICADOATIVO", "nullable": true, "type": "varchar2", "length": 1})
  pro_certificadoativo: string;
  @Column({"name": "PRO_CERTNUMEROHML", "nullable": true, "type": "varchar2", "length": 20})
  pro_certnumerohml: string;
}
