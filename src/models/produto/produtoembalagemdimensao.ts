import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoEmbalagemDimensao {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer' }) pro_codigo: number;
    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true }) pro_altura_emb: number;
    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true }) pro_largura_emb: number;
    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true }) pro_comprimento_emb: number;
    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true }) pro_peso_emb: number;
}
