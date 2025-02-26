import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoFabricante {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer', unique: true }) fab_codigo: number;
    @Column({ type: 'varchar', length: 255, nullable: true }) fab_descricao: string;
}
