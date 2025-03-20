import { DataSource } from 'typeorm';
import { UsersSeeder } from './users.seeder';

export const runSeeders = async (dataSource: DataSource, forceCreate: boolean = false) => {
  try {
    // Executar seeder de usuários
    const usersSeeder = new UsersSeeder(dataSource, forceCreate);
    await usersSeeder.run();
    
    console.log('Seeders executados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seeders:', error);
    throw error;
  }
}; 