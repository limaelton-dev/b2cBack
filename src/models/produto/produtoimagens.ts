import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Produto } from './produto';

@Entity()
export class ProdutoImagens {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer' }) pro_codigo: number;
    @Column({ type: 'text' }) url: string;
    @ManyToOne(() => Produto, (produto) => produto.imagens, { 
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "pro_codigo", referencedColumnName: "pro_codigo" })
    produto: Produto;
}
