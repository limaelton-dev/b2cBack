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
import { In } from 'typeorm';

export class UserSeeder {
  constructor(private dataSource: DataSource, private forceCreate: boolean = false) {}

  async run(): Promise<void> {
    // Verifica se já existem usuários no banco
    const userRepository = this.dataSource.getRepository(User);
    const profileRepository = this.dataSource.getRepository(Profile);
    const profilePfRepository = this.dataSource.getRepository(ProfilePf);
    const profilePjRepository = this.dataSource.getRepository(ProfilePj);
    const addressRepository = this.dataSource.getRepository(Address);
    const phoneRepository = this.dataSource.getRepository(Phone);
    const cardRepository = this.dataSource.getRepository(Card);

    // Se estamos forçando a criação e existem os usuários de teste, removemos primeiro
    if (this.forceCreate) {
      console.log('Modo forçado: limpando registros existentes de usuários de teste...');
      
      // Buscar perfis existentes para os emails específicos
      const userPF = await userRepository.findOne({ where: { email: 'pessoafisica@exemplo.com' } });
      const userPJ = await userRepository.findOne({ where: { email: 'pessoajuridica@exemplo.com' } });
      
      // Se encontrou, remover os registros associados
      if (userPF) {
        const profilesPF = await profileRepository.find({ where: { userId: userPF.id } });
        if (profilesPF.length > 0) {
          // Remover registros relacionados em ordem hierárquica para evitar violações de chave estrangeira
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

    // Verificar se os usuários de exemplo já existem
    const existingPF = await userRepository.findOne({ where: { email: 'pessoafisica@exemplo.com' } });
    const existingPJ = await userRepository.findOne({ where: { email: 'pessoajuridica@exemplo.com' } });

    // Se já existem e não estamos no modo forçado, pulamos
    if (existingPF && existingPJ && !this.forceCreate) {
      console.log('Usuários de exemplo já existem no banco. Pulando seed.');
      return;
    }

    // Criação dos usuários de exemplo ==========================================
    console.log('Criando usuários de exemplo...');

    // 1. Usuário Pessoa Física ================================================
    if (!existingPF || this.forceCreate) {
      // 1.1 Criar usuário
      const hashedPasswordPF = await hash('senha123', 10);
      const userPF = await userRepository.save({
        email: 'pessoafisica@exemplo.com',
        password: hashedPasswordPF,
      });

      // 1.2 Criar perfil associado ao usuário
      const profilePF = await profileRepository.save({
        userId: userPF.id,
        profileType: ProfileType.PF,
      });

      // 1.3 Criar dados de perfil PF
      await profilePfRepository.save({
        profileId: profilePF.id,
        fullName: 'Usuário Pessoa Física',
        cpf: '123.456.789-00',
        birthDate: new Date('1990-01-01'),
        gender: 'Masculino',
      });

      // 1.4 Criar endereço associado ao perfil
      await addressRepository.save({
        profileId: profilePF.id,
        street: 'Rua Exemplo',
        number: '123',
        complement: 'Apto 101',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01001-000',
        is_default: true,
      });

      // 1.5 Criar telefone associado ao perfil
      await phoneRepository.save({
        profileId: profilePF.id,
        ddd: '11',
        number: '99999-9999',
        is_default: true,
        verified: true,
      });

      // 1.6 Criar cartão associado ao perfil
      await cardRepository.save({
        profileId: profilePF.id,
        card_number: '**** **** **** 1234',
        holder_name: 'USUARIO P FISICA',
        expiration_date: '12/2030',
        brand: 'Visa',
        is_default: true,
      });

      console.log('Usuário PF criado com ID:', userPF.id);
    }

    // 2. Usuário Pessoa Jurídica ==============================================
    if (!existingPJ || this.forceCreate) {
      // 2.1 Criar usuário
      const hashedPasswordPJ = await hash('senha123', 10);
      const userPJ = await userRepository.save({
        email: 'pessoajuridica@exemplo.com',
        password: hashedPasswordPJ,
      });

      // 2.2 Criar perfil associado ao usuário
      const profilePJ = await profileRepository.save({
        userId: userPJ.id,
        profileType: ProfileType.PJ,
      });

      // 2.3 Criar dados de perfil PJ
      await profilePjRepository.save({
        profileId: profilePJ.id,
        companyName: 'Empresa de Exemplo LTDA',
        cnpj: '12.345.678/0001-90',
        tradingName: 'Empresa Exemplo',
        stateRegistration: '123456789',
        municipalRegistration: '987654321',
      });

      // 2.4 Criar endereço associado ao perfil
      await addressRepository.save({
        profileId: profilePJ.id,
        street: 'Avenida Comercial',
        number: '1000',
        complement: 'Sala 42',
        neighborhood: 'Distrito Comercial',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '04002-000',
        is_default: true,
      });

      // 2.5 Criar telefone associado ao perfil
      await phoneRepository.save({
        profileId: profilePJ.id,
        ddd: '11',
        number: '3333-3333',
        is_default: true,
        verified: true,
      });

      // 2.6 Criar cartão associado ao perfil
      await cardRepository.save({
        profileId: profilePJ.id,
        card_number: '**** **** **** 5678',
        holder_name: 'EMPRESA EXEMPLO',
        expiration_date: '12/2030',
        brand: 'Mastercard',
        is_default: true,
      });

      console.log('Usuário PJ criado com ID:', userPJ.id);
    }

    console.log('Seed de usuários concluído com sucesso!');
  }
} 