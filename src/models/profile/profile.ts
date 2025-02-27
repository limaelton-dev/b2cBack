import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from 'src/models/user/user';
import { ProfilePF } from '../profile_pf/profile_pf';
import { ProfilePJ } from '../profile_pj/profile_pj';
import { Address } from '../address/address';
import { Card } from '../card/card';

@Entity('profile')
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({ length: 2 })
    profile_type: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(() => ProfilePF, profilePF => profilePF.profile, { cascade: true })
    profilePF: ProfilePF;

    @OneToOne(() => ProfilePJ, profilePJ => profilePJ.profile, { cascade: true })
    profilePJ: ProfilePJ;

    @OneToMany(() => Address, address => address.profile, { cascade: true })
    addresses: Address[];

    @OneToMany(() => Card, card => card.profile, { cascade: true })
    cards: Card[];
} 