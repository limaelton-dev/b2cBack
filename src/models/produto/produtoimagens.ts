import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoImagens {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer' }) pro_codigo: number;
    @Column({ type: 'text' }) url: string;
}
