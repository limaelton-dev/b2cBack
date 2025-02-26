import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoCusto {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer' }) pro_codigo: number;
    @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true }) valor: number;
    @Column({ type: 'varchar', length: 15, nullable: true }) nome_coluna: string;
}
