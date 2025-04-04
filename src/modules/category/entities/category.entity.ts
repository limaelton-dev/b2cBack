import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Brand } from "./brand.entity";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    oracleId: number;

    @Column()
    name: string;

    @Column()
    sourceTable: string;

    @Column()
    sourceColumn: string;

    @Column()
    slug: string;

    @Column({ type: 'smallint' })
    level: number;

    @ManyToOne(() => Category, (category) => category.children, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent?: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children?: Category[];

    @ManyToOne(() => Brand)
    @JoinColumn({ name: 'brand_id' })
    brand?: Brand;
}