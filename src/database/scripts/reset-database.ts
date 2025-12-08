import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { postgresDataSourceOptions } from '../data-source';

// Evita derrubar o banco de produção por engano
if (process.env.NODE_ENV === 'production') {
  throw new Error('Não execute o reset de banco em ambiente de produção.');
}

const dataSource = new DataSource({
  ...postgresDataSourceOptions,
  entities: ['src/modules/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: false,
});

async function resetDatabase() {
  console.info('🔄 Iniciando reset completo do banco...');

  try {
    await dataSource.initialize();
    console.info('✅ Conexão estabelecida.');

    console.info('🧨 Removendo todas as tabelas e registros...');
    await dataSource.dropDatabase();
    console.info('🧹 Banco limpo com sucesso.');

    console.info('📦 Recriando schema a partir das migrations...');
    await dataSource.runMigrations();
    console.info('✅ Migrations executadas.');

    console.info('🎉 Reset concluído.');
  } catch (error) {
    console.error('❌ Erro ao resetar o banco:', error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

resetDatabase();

