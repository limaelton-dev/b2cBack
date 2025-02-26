import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoGrupo {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer', unique: true }) pgr_codigo: number;
    @Column({ type: 'varchar', length: 4, nullable: true }) pgr_numero: string;
    @Column({ type: 'varchar', length: 4, nullable: true }) fam_numero: string;
    @Column({ type: 'boolean', default: true }) pgr_situacao: boolean;
}
