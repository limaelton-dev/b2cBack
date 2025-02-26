import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoSubgrupo {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer', unique: true }) psg_codigo: number;
    @Column({ type: 'varchar', length: 255, nullable: true }) psg_descricao: string;
    @Column({ type: 'integer', default: 1 }) psg_codificacao: number;
    @Column({ type: 'varchar', length: 4, nullable: true }) psg_numgrupo: string;
    @Column({ type: 'varchar', length: 2, nullable: true }) psg_numsubgrupo: string;
    @Column({ type: 'varchar', length: 40, nullable: true }) psg_descsubgrupo: string;
}
