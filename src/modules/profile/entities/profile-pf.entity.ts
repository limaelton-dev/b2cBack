import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity('profile_pf')
export class ProfilePf {
  @PrimaryColumn({ name: 'profile_id' })
  profileId: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ name: 'birth_date' })
  birthDate: Date;

  @Column({ nullable: true })
  gender: string;

  @OneToOne(() => Profile, (profile) => profile.profilePf)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;
} 