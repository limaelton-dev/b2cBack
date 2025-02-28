import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProdutoImagens } from './produtoimagens';

@Entity()
export class Produto {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer', unique: true }) pro_codigo: number;
    @Column({ type: 'integer' }) tpo_codigo: number;
    @Column({ type: 'integer' }) fab_codigo: number;
    @Column({ type: 'integer' }) psg_codigo: number;
    @Column({ type: 'integer' }) ppn_codigo: number;
    @Column({ type: 'integer' }) pvr_codigo: number;
    @Column({ type: 'integer' }) fam_codigo: number;
    @Column({ type: 'integer' }) pgr_codigo: number;
    @Column({ type: 'integer' }) pmo_codigo: number;
    @Column({ type: 'text', nullable: true }) pro_referencia: string;
    @Column({ type: 'text', nullable: true }) pro_descricao: string;
    @Column({ type: 'text', nullable: true }) pro_codigobarra: string;
    @Column({ type: 'text', nullable: true }) pro_unidade: string;
    @Column({ type: 'integer', nullable: true }) pro_prazogarantia: number;
    @Column({ type: 'boolean', default: true }) pro_ativo: boolean;
    @Column({ type: 'text', nullable: true }) pro_conteudo_emb: string;
    @Column({ type: 'text', nullable: true }) pro_partnum_sku: string;
    @Column({ type: 'text', nullable: true }) pro_software: string;
    @Column({ type: 'text', nullable: true }) pro_manual: string;
    @Column({ type: 'text', nullable: true }) pro_keyword: string;
    @Column({ type: 'text', nullable: true }) pro_metatags: string;
    @Column({ type: 'text', nullable: true }) pro_url_amigavel: string;
    @Column({ type: 'text', nullable: true }) pro_url_fichatec: string;
    @Column({ type: 'text', nullable: true }) pro_url_dropbox: string;
    @Column({ type: 'text', nullable: true }) pro_conteudo_emb2: string;
    @Column({ type: 'text', nullable: true }) pro_modelo_com: string;
    @Column({ type: 'text', nullable: true }) pro_desc_tecnica: string;

    @OneToMany(() => ProdutoImagens, (imagem) => imagem.produto, { cascade: true })
    imagens: ProdutoImagens[];
}
