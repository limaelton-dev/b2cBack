import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('brand')
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    oracleId: number;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;
}