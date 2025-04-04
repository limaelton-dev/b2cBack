import { DataSource } from 'typeorm';
import AppDataSource from '../data-source';

async function resetDatabase() {
  const dataSource: DataSource = await AppDataSource.initialize();
  console.log("Conexão com o banco de dados estabelecida");

  try {
    // Desativa temporariamente as foreign keys
    await dataSource.query('SET session_replication_role = replica;');
    console.log("Foreign keys desativadas");

    // Obtém todas as tabelas do banco
    const tables = await dataSource.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    console.log(`Encontradas ${tables.length} tabelas para remover`);

    // Remove cada tabela
    for (const table of tables) {
      await dataSource.query(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE`);
      console.log(`Tabela ${table.tablename} removida`);
    }

    // Reativa as foreign keys
    await dataSource.query('SET session_replication_role = DEFAULT;');
    console.log("Foreign keys reativadas");

    // Executa as migrations
    await dataSource.runMigrations();
    console.log("Migrations executadas com sucesso");

  } catch (error) {
    console.error('Erro durante o reset:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log("Conexão com o banco de dados fechada");
  }
}

// Executa a função principal
resetDatabase()
  .catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  }); 