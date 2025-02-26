import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoFamilia {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer', unique: true }) fam_codigo: number;
    @Column({ type: 'varchar', length: 4, nullable: true }) fam_numero: string;
    @Column({ type: 'varchar', length: 60, nullable: true }) fam_descricao: string;
}
