import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('brand')
export class Brand {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'oracle_id', unique: true })
    oracleId: number;

    @Column({name: 'name'})
    name: string;

    @Column({ name: 'slug', unique: true })
    slug: string;
}