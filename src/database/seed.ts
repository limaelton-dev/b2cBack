import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { runSeeders } from './seeders';

async function seed() {
  console.log('Argumentos:', process.argv);
  
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  // Verifica se há argumento para forçar a criação
  const forceCreate = process.argv.includes('--force');
  console.log('Forçar criação:', forceCreate);

  try {
    console.log(`Iniciando execução de seeders${forceCreate ? ' (forçado)' : ''}...`);
    await runSeeders(dataSource, forceCreate);
    console.log('Seeders executados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seeders:', error);
  } finally {
    await app.close();
  }
}

seed(); 