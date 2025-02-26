import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoModelo {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer', unique: true }) pmo_codigo: number;
    @Column({ type: 'varchar', length: 4, nullable: true }) pmo_numero: string;
    @Column({ type: 'varchar', length: 4, nullable: true }) pgr_numero: string;
    @Column({ type: 'varchar', length: 60, nullable: true }) pmo_descricao: string;
}
