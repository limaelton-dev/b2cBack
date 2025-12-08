import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { postgresDataSourceOptions } from '../data-source';
import { runSeeders } from '../seeders';
import * as fs from 'fs';
import * as path from 'path';

// Evita derrubar o banco de produção por engano
if (process.env.NODE_ENV === 'production') {
  throw new Error('Não execute o rebuild de banco em ambiente de produção.');
}

const migrationsDir = path.join(__dirname, '..', 'migrations');

// Limpa todas as migrations existentes
function clearMigrations(): void {
  console.info('🗑️  Limpando migrations antigas...');
  
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
    console.info('📁 Pasta de migrations criada.');
    return;
  }

  const files = fs.readdirSync(migrationsDir);
  let deletedCount = 0;

  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      fs.unlinkSync(path.join(migrationsDir, file));
      deletedCount++;
    }
  }

  console.info(`🧹 ${deletedCount} migration(s) removida(s).`);
}

async function rebuildDatabase() {
  console.info('\n🔄 REBUILD COMPLETO DO BANCO DE DADOS\n');
  console.info('='.repeat(50) + '\n');

  // 1. Limpar migrations antigas
  clearMigrations();

  // 2. Criar DataSource para operações
  const dataSource = new DataSource({
    ...postgresDataSourceOptions,
    entities: ['src/modules/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    migrationsRun: false,
    synchronize: false,
  });

  try {
    // 3. Conectar ao banco
    await dataSource.initialize();
    console.info('✅ Conexão estabelecida.\n');

    // 4. Dropar o banco
    console.info('🧨 Dropando todas as tabelas...');
    await dataSource.dropDatabase();
    console.info('🧹 Banco limpo com sucesso.\n');

    // 5. Sincronizar schema (cria as tabelas baseado nas entities)
    console.info('📦 Criando schema baseado nas entities...');
    await dataSource.synchronize();
    console.info('✅ Schema criado com sucesso.\n');

    // 6. Rodar seeders
    console.info('🌱 Executando seeders...');
    await runSeeders(dataSource, true);
    console.info('✅ Seeders executados.\n');

    console.info('='.repeat(50));
    console.info('🎉 REBUILD CONCLUÍDO COM SUCESSO!');
    console.info('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Erro no rebuild:', error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

rebuildDatabase();

