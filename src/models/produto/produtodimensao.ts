import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoDimensao {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer' }) pro_codigo: number;
    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true }) pro_altura_pro: number;
    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true }) pro_largura_pro: number;
    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true }) pro_comprimento_pro: number;
    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true }) pro_peso_pro: number;
}
