import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Produto } from './produto';

@Entity()
export class ProdutoTipo {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer', unique: true }) tpo_codigo: number;
    @Column({ type: 'varchar', length: 255 }) tpo_descricao: string;

    @OneToMany(() => Produto, (produto) => produto.tipo)
    produtos: Produto[];
}
