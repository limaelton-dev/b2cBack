import { DataSource } from 'typeorm';
import { hash } from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { Profile } from '../../modules/profiles/entities/profile.entity';
import { ProfilePf } from '../../modules/profiles/entities/profile-pf.entity';
import { ProfilePj } from '../../modules/profiles/entities/profile-pj.entity';
import { Address } from '../../modules/addresses/entities/address.entity';
import { Phone } from '../../modules/phones/entities/phone.entity';
import { Card } from '../../modules/cards/entities/card.entity';
import { ProfileType } from '../../common/enums/profile-type.enum';
import { In } from 'typeorm';

export class UsersSeeder {
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
      
      // Buscar perfis para limpar relacionamentos
      let profilesPF = [];
      let profilesPJ = [];
      
      if (userPF) {
        profilesPF = await profileRepository.find({ where: { userId: userPF.id } });
      }
      if (userPJ) {
        profilesPJ = await profileRepository.find({ where: { userId: userPJ.id } });
      }
      
      // IDs de perfis para limpar
      const profileIds = [...profilesPF, ...profilesPJ].map(p => p.id);
      
      if (profileIds.length > 0) {
        // Remover cartões
        await cardRepository.delete({ profileId: In(profileIds) });
        console.log('Cartões removidos.');
        
        // Remover telefones
        await phoneRepository.delete({ profileId: In(profileIds) });
        console.log('Telefones removidos.');
        
        // Remover endereços
        await addressRepository.delete({ profileId: In(profileIds) });
        console.log('Endereços removidos.');
        
        // Remover perfil PF/PJ
        await profilePfRepository.delete({ profileId: In(profileIds) });
        await profilePjRepository.delete({ profileId: In(profileIds) });
        console.log('Detalhes de perfis removidos.');
        
        // Remover perfil
        await profileRepository.delete({ id: In(profileIds) });
        console.log('Perfis removidos.');
      }
      
      // Remover usuários
      if (userPF) {
        await userRepository.delete(userPF.id);
        console.log('Usuário PF removido.');
      }
      if (userPJ) {
        await userRepository.delete(userPJ.id);
        console.log('Usuário PJ removido.');
      }
    } else {
      // Se não estamos forçando, verificamos se já existem usuários
      const existingUsers = await userRepository.count();
      if (existingUsers > 0) {
        console.log('Usuários já existem no banco. Pulando seed.');
        return;
      }
    }

    console.log('Iniciando seed de usuários...');

    // Criar novo usuário PF
    const hashedPasswordPF = await hash('123456', 10);
    const userPF = userRepository.create({
      email: 'pessoafisica@exemplo.com',
      password: hashedPasswordPF,
    });
    await userRepository.save(userPF);
    console.log('Usuário PF criado:', userPF.id);

    // Criando perfil PF
    const profilePF = profileRepository.create({
      userId: userPF.id,
      profileType: ProfileType.PF,
      user: userPF,
    });
    await profileRepository.save(profilePF);
    console.log('Perfil PF criado:', profilePF.id);

    // Criando detalhes do perfil PF
    const profileDetailsPF = profilePfRepository.create({
      profileId: profilePF.id,
      fullName: 'João da Silva',
      cpf: '12345678900',
      birthDate: new Date('1990-01-01'),
      gender: 'M',
      profile: profilePF,
    });
    await profilePfRepository.save(profileDetailsPF);
    console.log('Detalhes do perfil PF criados');

    // Criando endereço para PF
    const addressPF = addressRepository.create({
      profileId: profilePF.id,
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 101',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234567',
      isDefault: true,
      profile: profilePF,
    });
    await addressRepository.save(addressPF);
    console.log('Endereço PF criado');

    // Criando telefone para PF
    const phonePF = phoneRepository.create({
      profileId: profilePF.id,
      ddd: '11',
      number: '987654321',
      isDefault: true,
      verified: true,
      profile: profilePF,
    });
    await phoneRepository.save(phonePF);
    console.log('Telefone PF criado');

    // Criando cartão para PF
    const cardPF = cardRepository.create({
      profileId: profilePF.id,
      cardNumber: '4111111111111111', // Número fictício
      holderName: 'JOAO DA SILVA',
      expirationDate: '12/2025',
      isDefault: true,
      brand: 'visa',
      profile: profilePF,
    });
    await cardRepository.save(cardPF);
    console.log('Cartão PF criado');

    // Criar novo usuário PJ
    const hashedPasswordPJ = await hash('123456', 10);
    const userPJ = userRepository.create({
      email: 'pessoajuridica@exemplo.com',
      password: hashedPasswordPJ,
    });
    await userRepository.save(userPJ);
    console.log('Usuário PJ criado:', userPJ.id);

    // Criando perfil PJ
    const profilePJ = profileRepository.create({
      userId: userPJ.id,
      profileType: ProfileType.PJ,
      user: userPJ,
    });
    await profileRepository.save(profilePJ);
    console.log('Perfil PJ criado:', profilePJ.id);

    // Criando detalhes do perfil PJ
    const profileDetailsPJ = profilePjRepository.create({
      profileId: profilePJ.id,
      companyName: 'Empresa Exemplo LTDA',
      cnpj: '12345678000199',
      tradingName: 'Exemplo Comércio',
      stateRegistration: '123456789',
      municipalRegistration: '987654321',
      profile: profilePJ,
    });
    await profilePjRepository.save(profileDetailsPJ);
    console.log('Detalhes do perfil PJ criados');

    // Criando endereço para PJ
    const addressPJ = addressRepository.create({
      profileId: profilePJ.id,
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Sala 1010',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310100',
      isDefault: true,
      profile: profilePJ,
    });
    await addressRepository.save(addressPJ);
    console.log('Endereço PJ criado');

    // Criando telefone para PJ
    const phonePJ = phoneRepository.create({
      profileId: profilePJ.id,
      ddd: '11',
      number: '998765432',
      isDefault: true,
      verified: true,
      profile: profilePJ,
    });
    await phoneRepository.save(phonePJ);
    console.log('Telefone PJ criado');

    // Criando cartão para PJ
    const cardPJ = cardRepository.create({
      profileId: profilePJ.id,
      cardNumber: '5555555555554444', // Número fictício
      holderName: 'EMPRESA EXEMPLO LTDA',
      expirationDate: '12/2026',
      isDefault: true,
      brand: 'mastercard',
      profile: profilePJ,
    });
    await cardRepository.save(cardPJ);
    console.log('Cartão PJ criado');

    console.log('Seed de usuários concluído com sucesso!');
  }
} 