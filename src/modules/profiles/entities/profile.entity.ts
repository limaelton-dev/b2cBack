import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProfileType } from '../../../common/enums/profile-type.enum';
import { Address } from '../../addresses/entities/address.entity';
import { Phone } from '../../phones/entities/phone.entity';
import { Card } from '../../cards/entities/card.entity';
import { Order } from '../../orders/entities/order.entity';
import { ProfilePf } from './profile-pf.entity';
import { ProfilePj } from './profile-pj.entity';

@Entity('profiles')
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

  @ManyToOne(() => User, (user) => user.profiles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Address, (address) => address.profile)
  addresses: Address[];

  @OneToMany(() => Phone, (phone) => phone.profile)
  phones: Phone[];

  @OneToMany(() => Card, (card) => card.profile)
  cards: Card[];

  @OneToMany(() => Order, (order) => order.profile)
  orders: Order[];

  @OneToOne(() => ProfilePf, (profilePf) => profilePf.profile)
  profilePf: ProfilePf;

  @OneToOne(() => ProfilePj, (profilePj) => profilePj.profile)
  profilePj: ProfilePj;
} 