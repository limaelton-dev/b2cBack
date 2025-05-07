import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { OrderItem } from '../../order/entities/order-item.entity';
import { DiscountProduct } from '../../discount/entities/discount-product.entity';
import { Brand } from '../../category/entities/brand.entity';
import { Category } from '../../category/entities/category.entity';
import { ProductImage } from './product.image.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'oracle_id' })
  oracleId: number; // PRO_CODIGO

  @Column({ unique: true })
  reference: string; // PRO_REFERENCIA

  @Column()
  name: string; // PRO_DESCRICAO

  @Column({ type: 'text', nullable: true })
  description: string; // PRO_APRESENTACAO

  @Column({ name: 'tech_description', type: 'text', nullable: true })
  techDescription: string; // PRO_DES_TECNICA

  @Column({ name: 'packaging_content', type: 'text', nullable: true })
  packagingContent: string; // PRO_CONTEUDO_EMB || PRO_CONTEUDO_EMB2

  @Column({ nullable: true })
  model: string; // PRO_MODELO_COM

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // PRO_PRECO_VENDA

  @Column()
  stock: number; // PRO_ESTOQUE

  @Column()
  unit: string; // PRO_UNIDADE

  @Column({ unique: true })
  barcode: string; // PRO_CODIGOBARRA

  @Column()
  sku: string; // PRO_PARTNUM_SKU

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weight: number; // PRO_PESO_PRO || PRO_PESO_EMB

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  height: number; // PRO_ALTURA_PRO || PRO_ALTURA_EMB

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  width: number; // PRO_LARGURA_PRO || PRO_LARGURA_EMB

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  length: number; // PRO_COMPRIMENTO_PRO || PRO_COMPRIMENTO_EMB

  @Column({ unique: true })
  slug: string; // PRO_URL_AMIGAVEL

  @Column({ name: 'model_image', nullable: true })
  modelImage: string; // PRO_MODELO_COM

  @Column({ name: 'brand_image', nullable: true })
  brandImage: string; // FAB_DESCRICAO

  @ManyToOne(() => Brand, { nullable: false })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_level1_id' })
  categoryLevel1: Category;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_level2_id' })
  categoryLevel2: Category;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_level3_id' })
  categoryLevel3: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => DiscountProduct, (discountProduct) => discountProduct.product)
  discountProduct: DiscountProduct[];

  @OneToMany(() => ProductImage, image => image.product, { cascade: true })
  images: ProductImage[];
  
}
