import { DataSource } from 'typeorm';
import { PaymentMethodsSeeder } from './payment-methods.seeder';

export const runSeeders = async (dataSource: DataSource) => {
  try {
    // PaymentMethods seeder
    const paymentMethodsSeeder = new PaymentMethodsSeeder(dataSource);
    await paymentMethodsSeeder.run();
    
    console.log('Seeders executados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seeders:', error);
    throw error;
  }
}; 