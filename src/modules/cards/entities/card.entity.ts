import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @Column({ name: 'card_number' })
  cardNumber: string;

  @Column({ name: 'holder_name' })
  holderName: string;

  @Column({ name: 'expiration_date' })
  expirationDate: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column()
  brand: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.cards)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;
} 