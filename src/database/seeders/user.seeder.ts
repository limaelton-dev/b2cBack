import { DataSource } from 'typeorm';
import { hash } from 'bcrypt';
import { User } from '../../modules/user/entities/user.entity';
import { Profile } from '../../modules/profile/entities/profile.entity';
import { ProfilePf } from '../../modules/profile/entities/profile-pf.entity';
import { ProfilePj } from '../../modules/profile/entities/profile-pj.entity';
import { Address } from '../../modules/address/entities/address.entity';
import { Phone } from '../../modules/phone/entities/phone.entity';
import { Card } from '../../modules/card/entities/card.entity';
import { ProfileType } from '../../common/enums/profile-type.enum';

export class UserSeeder {
  constructor(private dataSource: DataSource, private forceCreate: boolean = false) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);
    const profileRepository = this.dataSource.getRepository(Profile);
    const profilePfRepository = this.dataSource.getRepository(ProfilePf);
    const profilePjRepository = this.dataSource.getRepository(ProfilePj);
    const addressRepository = this.dataSource.getRepository(Address);
    const phoneRepository = this.dataSource.getRepository(Phone);
    const cardRepository = this.dataSource.getRepository(Card);

    if (this.forceCreate) {
      console.log('Modo forçado: limpando registros existentes de usuários de teste...');
      
      const userPF = await userRepository.findOne({ where: { email: 'pessoafisica@exemplo.com' } });
      const userPJ = await userRepository.findOne({ where: { email: 'pessoajuridica@exemplo.com' } });
      
      if (userPF) {
        const profilesPF = await profileRepository.find({ where: { userId: userPF.id } });
        if (profilesPF.length > 0) {
          for (const profile of profilesPF) {
            await cardRepository.delete({ profileId: profile.id });
            await phoneRepository.delete({ profileId: profile.id });
            await addressRepository.delete({ profileId: profile.id });
            await profilePfRepository.delete({ profileId: profile.id });
          }
          await profileRepository.delete({ userId: userPF.id });
        }
        await userRepository.delete(userPF.id);
        console.log('Usuário PF e registros associados removidos');
      }
      
      if (userPJ) {
        const profilesPJ = await profileRepository.find({ where: { userId: userPJ.id } });
        if (profilesPJ.length > 0) {
          for (const profile of profilesPJ) {
            await cardRepository.delete({ profileId: profile.id });
            await phoneRepository.delete({ profileId: profile.id });
            await addressRepository.delete({ profileId: profile.id });
            await profilePjRepository.delete({ profileId: profile.id });
          }
          await profileRepository.delete({ userId: userPJ.id });
        }
        await userRepository.delete(userPJ.id);
        console.log('Usuário PJ e registros associados removidos');
      }
    }

    const existingPF = await userRepository.findOne({ where: { email: 'pessoafisica@exemplo.com' } });
    const existingPJ = await userRepository.findOne({ where: { email: 'pessoajuridica@exemplo.com' } });

    if (existingPF && existingPJ && !this.forceCreate) {
      console.log('Usuários de exemplo já existem no banco. Pulando seed.');
      return;
    }

    console.log('Criando usuários de exemplo...');

    if (!existingPF || this.forceCreate) {
      const hashedPasswordPF = await hash('Senha123', 10);
      const userPF = await userRepository.save({
        email: 'pessoafisica@exemplo.com',
        password: hashedPasswordPF,
      });

      const profilePF = await profileRepository.save({
        userId: userPF.id,
        profileType: ProfileType.PF,
      });

      await profilePfRepository.save({
        profileId: profilePF.id,
        firstName: 'Usuário',
        lastName: 'Pessoa Física',
        cpf: '123.456.789-00',
        birthDate: new Date('1990-01-01'),
        gender: 'Masculino',
      });

      await addressRepository.save({
        profileId: profilePF.id,
        street: 'Rua Exemplo',
        number: '123',
        complement: 'Apto 101',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
        isDefault: true,
      });

      await phoneRepository.save({
        profileId: profilePF.id,
        ddd: '11',
        number: '99999-9999',
        isDefault: true,
        verified: true,
      });

      await cardRepository.save({
        profileId: profilePF.id,
        lastFourDigits: '1234',
        holderName: 'USUARIO P.',
        expirationMonth: '12',
        expirationYear: '2030',
        brand: 'Visa',
        isDefault: true,
      });

      console.log('Usuário PF criado com ID:', userPF.id);
    }

    if (!existingPJ || this.forceCreate) {
      const hashedPasswordPJ = await hash('Senha123', 10);
      const userPJ = await userRepository.save({
        email: 'pessoajuridica@exemplo.com',
        password: hashedPasswordPJ,
      });

      const profilePJ = await profileRepository.save({
        userId: userPJ.id,
        profileType: ProfileType.PJ,
      });

      await profilePjRepository.save({
        profileId: profilePJ.id,
        companyName: 'Empresa de Exemplo LTDA',
        cnpj: '12.345.678/0001-90',
        tradingName: 'Empresa Exemplo',
        stateRegistration: '123456789',
        municipalRegistration: '987654321',
      });

      await addressRepository.save({
        profileId: profilePJ.id,
        street: 'Avenida Comercial',
        number: '1000',
        complement: 'Sala 42',
        neighborhood: 'Distrito Comercial',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04002-000',
        isDefault: true,
      });

      await phoneRepository.save({
        profileId: profilePJ.id,
        ddd: '11',
        number: '3333-3333',
        isDefault: true,
        verified: true,
      });

      await cardRepository.save({
        profileId: profilePJ.id,
        lastFourDigits: '5678',
        holderName: 'EMPRESA E.',
        expirationMonth: '12',
        expirationYear: '2030',
        brand: 'Mastercard',
        isDefault: true,
      });

      console.log('Usuário PJ criado com ID:', userPJ.id);
    }

    console.log('Seed de usuários concluído com sucesso!');
  }
}
