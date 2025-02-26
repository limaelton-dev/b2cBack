import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProdutoPartNumber {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'integer' }) psg_codigo: number;
    @Column({ type: 'integer', nullable: true }) ppn_item: number;
    @Column({ type: 'varchar', length: 255, nullable: true }) ppn_descricao: string;
    @Column({ type: 'varchar', length: 4, nullable: true }) ppn_numero: string;
    @Column({ type: 'varchar', length: 3, nullable: true }) ppn_numvarcabo: string;
    @Column({ type: 'varchar', length: 40, nullable: true }) ppn_descvarcabo: string;
    @Column({ type: 'integer', unique: true }) ppn_codigo: number;
    @Column({ type: 'integer', nullable: true }) ppn_codvarcabo: number;
}
