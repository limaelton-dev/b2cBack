import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Produto } from '../produto/produto';

@Entity('cores')
export class Cores {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30 })
    name_color: string;

    @Column({ length: 9, unique: true })
    hex: string;

    @ManyToMany(() => Produto, produto => produto.cores)
    @JoinTable({
        name: 'produto_cor',
        joinColumn: {
            name: 'cor_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'produto_id',
            referencedColumnName: 'pro_codigo' // nome relação prod
        }
    })
    produtos: Produto[];
}