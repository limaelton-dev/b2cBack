import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { postgresDataSourceOptions } from '../data-source';

// Evita derrubar o banco de produção por engano
if (process.env.NODE_ENV === 'production') {
  throw new Error('Não execute o drop de banco em ambiente de produção.');
}

const dataSource = new DataSource({
  ...postgresDataSourceOptions,
  entities: ['src/modules/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: false,
});

async function dropDatabase() {
  console.info('🧨 Iniciando drop do banco...\n');

  try {
    await dataSource.initialize();
    console.info('✅ Conexão estabelecida.');

    await dataSource.dropDatabase();
    console.info('🧹 Banco dropado com sucesso!\n');

  } catch (error) {
    console.error('❌ Erro ao dropar o banco:', error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

dropDatabase();

