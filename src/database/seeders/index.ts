import { DataSource } from 'typeorm';
import { UserSeeder } from './user.seeder';
import { PaymentMethodsSeeder } from './payment-methods.seeder';

export async function runSeeders(dataSource: DataSource, forceCreate = false): Promise<void> {
  try {
    console.log('Iniciando execução dos seeders...');
    
    // Executar seeder de usuários
    await new UserSeeder(dataSource, forceCreate).run();
    
    // Executar seeder de métodos de pagamento
    await new PaymentMethodsSeeder(dataSource).run();
    
    console.log('Seeders executados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seeders:', error);
    throw error;
  }
} 