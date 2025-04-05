import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Brand } from "./brand.entity";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'oracle_id', unique: true})
    oracleId: number;

    @Column({name: 'name'})
    name: string;

    @Column({ name: 'source_table' })
    sourceTable: string;

    @Column({ name: 'source_column' })
    sourceColumn: string;

    @Column({ name: 'slug' })
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