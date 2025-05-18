import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity('profile_pf')
export class ProfilePf {
  @PrimaryColumn({ name: 'profile_id' })
  profileId: number;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

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