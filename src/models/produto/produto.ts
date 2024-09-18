import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Produto {
    @PrimaryGeneratedColumn()
    pro_codigo: number;

    @Column({ type: 'integer', nullable: true })
    luc_codigo: number;

    @Column({ type: 'integer' })
    are_codigo: number;

    @Column({ type: 'integer' })
    gru_codigo: number;

    @Column({ type: 'integer' })
    tpo_codigo: number;

    @Column({ type: 'integer' })
    fab_codigo: number;

    @Column({ type: 'integer', nullable: true })
    ccf_codigo: number;

    @Column({ type: 'integer' })
    ind_codigo: number;

    @Column({ type: 'integer', nullable: true })
    fcc_codigo: number;

    @Column({ type: 'varchar', length: 15, nullable: true })
    pro_referencia: string;

    @Column({ type: 'varchar', length: 45 })
    pro_descricao: string;

    @Column({ type: 'varchar', length: 45 })
    pro_descricaonf: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    pro_complemento: string;

    @Column({ type: 'varchar', length: 25, nullable: true })
    pro_codigofabricante: string;

    @Column({ type: 'varchar', length: 25, nullable: true })
    pro_codigobarra: string;

    @Column({ type: 'varchar', length: 1})
    pro_categoria: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    pro_unidade: string;

    @Column({ type: 'numeric', precision: 14, scale: 3, default: 0 })
    pro_pesobruto: number;

    @Column({ type: 'numeric', precision: 14, scale: 3, default: 0 })
    pro_pesoliquido: number;

    @Column({ type: 'varchar', length: 15, nullable: true })
    pro_localizacao: string;

    @Column({ type: 'varchar', length: 1 })
    pro_grauimportancia: string;

    @Column({ type: 'smallint', nullable: true })
    pro_prazogarantia: number;

    @Column({ type: 'varchar', length: 3, nullable: true })
    pro_cst: string;

    @Column({ type: 'varchar', length: 1})
    pro_ativo: string;

    @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
    pro_ipi: number;

    @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
    pro_icms: number;

    @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
    pro_importacao: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo01: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo02: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo03: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo04: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo05: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo06: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo07: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo08: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo09: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo10: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo11: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_custo12: number;

    @Column({ type: 'numeric', precision: 14, scale: 4, default: 0 })
    pro_customedio: number;

    @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
    pro_margemcusto: number;

    @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
    pro_margemfrete: number;

    @Column({ type: 'varchar', length: 1 })
    pro_calculoprecoauto: string;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda01: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda02: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda03: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda04: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda05: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda06: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda07: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda08: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda09: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda10: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda11: number;

    @Column({ type: 'numeric', precision: 16, scale: 4, default: 0 })
    pro_precovenda12: number;

    @Column({ type: 'varchar', length: 1 })
    pro_constalistapreco: string;

    @Column({ type: 'numeric', precision: 10, scale: 3, nullable: true })
    pro_qtdademinimacompra: number;

    @Column({ type: 'numeric', precision: 10, scale: 3, nullable: true })
    pro_estoqueminimo: number;

    @Column({ type: 'numeric', precision: 10, scale: 3, nullable: true })
    pro_estoquemaximo: number;

    @Column({ type: 'varchar', length: 1 })
    pro_autoestoqueminimo: string;

    @Column({ type: 'varchar', length: 1 })
    pro_autoestoquemaximo: string;

    @Column({ type: 'numeric', precision: 10, scale: 3, default: 0 })
    pro_producao: number;

    @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
    pro_valorultimacompra: number;

    @Column({ type: 'timestamp', nullable: true })
    pro_dataultimacompra: Date;

    @Column({ type: 'timestamp', nullable: true })
    pro_dataultimavenda: Date;

    @Column({ type: 'timestamp', nullable: true })
    pro_dataultimaproposta: Date;

    @Column({ type: 'timestamp', nullable: true })
    pro_dataultimacorrecao: Date;

    @Column({ type: 'varchar', length: 8, nullable: true })
    pro_horaultimacorrecao: string;

    @Column({ type: 'varchar', length: 1 })
    pro_confirmanegativo: string;

    @Column({ type: 'varchar', length: 1 })
    pro_faturanegativo: string;

    @Column({ type: 'timestamp', nullable: true })
    pro_dataccontagem: Date;

    @Column({ type: 'timestamp', nullable: true })
    pro_datarcontagem: Date;

    @Column({ type: 'numeric', precision: 10, scale: 3, default: 0 })
    pro_quantidadeembalagem: number;

    @Column({ type: 'varchar', length: 1 })
    pro_movimentaestoque: string;

    @Column({ type: 'integer', nullable: true })
    pro_embalagempadrao: number;

    @Column({ type: 'varchar', length: 1, nullable: true })
    pro_produtoespecial: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    pro_registranumeroserie: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    pro_numeroserieinicial: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    pro_editaprecovenda: string;

    @Column({ type: 'timestamp' })
    pro_incluidata: Date;

    @Column({ type: 'varchar', length: 40 })
    pro_incluipor: string;

    @Column({ type: 'timestamp' })
    pro_alteradata: Date;

    @Column({ type: 'varchar', length: 40 })
    pro_alterapor: string;

    @Column({ type: 'integer', nullable: true })
    div_codigo: number;

    @Column({ type: 'integer', nullable: true })
    sub_codigo: number;

    @Column({ type: 'integer', nullable: true })
    ref_codigo: number;

    @Column({ type: 'varchar', length: 1, nullable: true })
    pro_arredondamento: string;

    @Column({ type: 'integer', nullable: true })
    pro_negociacao: number;

    @Column({ type: 'numeric', nullable: true, default: 0 })
    pro_custo_minimo: number;

    @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
    pro_dif: number;

    @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
    pro_mod: number;

    @Column({ type: 'varchar', length: 3, nullable: true })
    pro_cstvenda: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    pro_descingles: string;

    @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
    pro_icmsrecent: number;

    @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
    pro_icmsrecsai: number;

    @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
    pro_ponto: number;

    @Column({ type: 'integer', nullable: true })
    fam_codigo: number;

    @Column({ type: 'integer', nullable: true })
    pgr_codigo: number;

    @Column({ type: 'integer', nullable: true })
    pmo_codigo: number;

    @Column({ type: 'integer', nullable: true })
    emb_codigo: number;

    @Column({ type: 'smallint', nullable: true })
    pro_atc_ativo: number;

    @Column({ type: 'char', length: 1, nullable: true })
    pro_atc_acao: string;

    @Column({ type: 'integer', default: 2 })
    tpr_codigo: number;

    @Column({ type: 'varchar', length: 1, default: 'N' })
    pro_premiacao: string;

    @Column({ type: 'varchar', length: 1, default: 'N' })
    pro_oferta: string;

    @Column({ type: 'bigint', default: 0 })
    pro_demandamedia: number;

    @Column({ type: 'varchar', length: 2, nullable: true })
    pro_caixacoletiva: string;

    @Column({ type: 'varchar', length: 1, default: 'N' })
    pro_prodref: string;

    @Column({ type: 'varchar', length: 1, default: 'N' })
    pro_constarel: string;

    @Column({ type: 'integer', nullable: true })
    pro_fabcodigo: number;

    @Column({ type: 'varchar', length: 40, nullable: true })
    pro_modelofab: string;

    @Column({ type: 'varchar', length: 1, default: 'N' })
    pro_foralin: string;

    @Column({ type: 'integer', nullable: true })
    cst_codigo: number;

    @Column({ type: 'varchar', length: 80, nullable: true })
    pro_des_tecnica: string;

    @Column({ type: 'numeric', precision: 8, scale: 3, nullable: true })
    pro_altura_emb: number;

    @Column({ type: 'numeric', precision: 8, scale: 3, nullable: true })
    pro_largura_emb: number;

    @Column({ type: 'numeric', precision: 8, scale: 3, nullable: true })
    pro_comprimento_emb: number;

    @Column({ type: 'numeric', precision: 8, scale: 3, nullable: true })
    pro_peso_emb: number;

    @Column({ type: 'numeric', precision: 8, scale: 3, nullable: true })
    pro_altura_pro: number;

    @Column({ type: 'numeric', precision: 8, scale: 3, nullable: true })
    pro_largura_pro: number;

    @Column({ type: 'numeric', precision: 8, scale: 3, nullable: true })
    pro_comprimento_pro: number;

    @Column({ type: 'numeric', precision: 8, scale: 3, nullable: true })
    pro_peso_pro: number;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    pro_conteudo_emb: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    pro_modelo_com: string;

    @Column({ type: 'varchar', length: 2000, nullable: true })
    pro_apresentacao: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    pro_video: string;

    @Column({ type: 'integer', default: 0 })
    pro_propcl1: number;

    @Column({ type: 'integer', default: 0 })
    pro_propcl2: number;

    @Column({ type: 'integer', default: 0 })
    pro_propcl3: number;

    @Column({ type: 'integer', default: 0 })
    pro_propcl4: number;

    @Column({ type: 'varchar', length: 1, nullable: true })
    pro_mpfci: string;

    @Column({ type: 'integer', default: 0 })
    pro_mediasug: number;

    @Column({ type: 'varchar', length: 1, default: 'N' })
    pro_beneficiado: string;

    @Column({ type: 'varchar', length: 800, nullable: true })
    pro_descricaoimp: string;

    @Column({ type: 'varchar', length: 1, default: 'N' })
    pro_constasite: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    pro_caixaind: string;

    @Column({ type: 'integer', default: 0 })
    pop_codigo: number;

    @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
    pro_srp: number;

    @Column({ type: 'varchar', length: 25, nullable: true })
    pro_dun14: string;

    @Column({ type: 'numeric', precision: 10, scale: 3, default: 0 })
    pro_comissaoextra: number;

    @Column({ type: 'varchar', length: 1, default: 'N' })
    pro_nf: string;

    @Column({ type: 'integer', nullable: true })
    alf_codigo: number;

    @Column({ type: 'integer', nullable: true })
    pro_obspadrao: number;

    @Column({ type: 'varchar', length: 300, nullable: true })
    pro_desobspadrao: string;

    @Column({ type: 'integer', default: 0 })
    pro_embintermediaria: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    pro_utilmaterial: string;

    @Column({ type: 'varchar', length: 70, nullable: true })
    pro_url_amigavel: string;

    @Column({ type: 'varchar', length: 70, nullable: true })
    pro_nome_comercial: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    pro_edm: string;

    @Column({ type: 'smallint', nullable: true })
    pro_lancamento: number;

    @Column({ type: 'timestamp', nullable: true })
    pro_expira_lanc: Date;

    @Column({ type: 'varchar', length: 20, nullable: true })
    pro_partnum_sku: string;

    @Column({ type: 'smallint', nullable: true })
    pro_constasite_b2b: number;

    @Column({ type: 'smallint', nullable: true })
    coe_codigo: number;

    @Column({ type: 'varchar', length: 300, nullable: true })
    pro_software: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    pro_manual: string;

    @Column({ type: 'numeric', precision: 8, scale: 2, nullable: true })
    pro_altura_edm: number;

    @Column({ type: 'numeric', precision: 8, scale: 2, nullable: true })
    pro_largura_edm: number;

    @Column({ type: 'varchar', length: 200, nullable: true })
    pro_keyword: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    pro_metatags: string;

    @Column({ type: 'integer', nullable: true })
    pro_codref: number;

    @Column({ type: 'varchar', length: 1, nullable: true })
    pro_tipouso: string;

    @Column({ type: 'integer', nullable: true })
    psg_codigo: number;

    @Column({ type: 'integer', nullable: true })
    ppn_codigo: number;

    @Column({ type: 'integer', nullable: true })
    pvr_codigo: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    pro_url_fichatec: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    pro_site_destaque: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    pro_url_dropbox: string;

    @Column({ type: 'varchar', length: 2000, nullable: true })
    pro_apresentacao2: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    pro_conteudo_emb2: string;

    @Column({ type: 'bigint', nullable: true })
    pro_id_multiempresa: number;

    @Column({ type: 'smallint', default: 1 })
    pro_qtdvenmultiplo: number;

    @Column({ type: 'varchar', length: 1, nullable: true })
    pro_certificacaones: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    pro_certificadoativo: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    pro_certnumerohml: string;
}