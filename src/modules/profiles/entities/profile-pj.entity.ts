import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity('profile_pj')
export class ProfilePj {
  @PrimaryColumn({ name: 'profile_id' })
  profileId: number;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ unique: true })
  cnpj: string;

  @Column({ name: 'trading_name', nullable: true })
  tradingName: string;

  @Column({ name: 'state_registration', nullable: true })
  stateRegistration: string;

  @Column({ name: 'municipal_registration', nullable: true })
  municipalRegistration: string;

  @OneToOne(() => Profile, (profile) => profile.profilePj)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;
} 