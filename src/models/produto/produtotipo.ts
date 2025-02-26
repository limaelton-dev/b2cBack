import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoTipo {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer', unique: true }) tpo_codigo: number;
    @Column({ type: 'varchar', length: 255 }) tpo_descricao: string;
}
