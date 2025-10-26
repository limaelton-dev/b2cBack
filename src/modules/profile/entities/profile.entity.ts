import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ProfileType } from '../../../common/enums/profile-type.enum';
import { Address } from '../../address/entities/address.entity';
import { Phone } from '../../phone/entities/phone.entity';
import { Card } from '../../card/entities/card.entity';
import { ProfilePf } from './profile-pf.entity';
import { ProfilePj } from './profile-pj.entity';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: ProfileType,
    name: 'profile_type',
  })
  profileType: ProfileType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Address, (address) => address.profile)
  address: Address[];

  @OneToMany(() => Phone, (phone) => phone.profile)
  phone: Phone[];

  @OneToMany(() => Card, (card) => card.profile)
  card: Card[];

  // @OneToMany(() => Order, (order) => order.profile)
  // order: Order[];

  @OneToOne(() => ProfilePf, (profilePf) => profilePf.profile)
  profilePf: ProfilePf;

  @OneToOne(() => ProfilePj, (profilePj) => profilePj.profile)
  profilePj: ProfilePj;
} 