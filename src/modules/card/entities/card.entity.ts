import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @Column({ name: 'last_four_digits', length: 4 })
  lastFourDigits: string;

  @Column({ name: 'holder_name' })
  holderName: string;

  @Column({ name: 'expiration_month', length: 2 })
  expirationMonth: string;

  @Column({ name: 'expiration_year', length: 4 })
  expirationYear: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ length: 20 })
  brand: string;

  @Column({ name: 'card_token', nullable: true })
  cardToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.card)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;
}
