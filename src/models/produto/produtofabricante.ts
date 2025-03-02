import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Produto } from './produto';

@Entity()
export class ProdutoFabricante {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer', unique: true }) fab_codigo: number;
    @Column({ type: 'varchar', length: 255, nullable: true }) fab_descricao: string;

    @OneToMany(() => Produto, (produto) => produto.fabricante)
    produtos: Produto[];
}
