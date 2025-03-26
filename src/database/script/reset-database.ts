import { DataSource } from 'typeorm';
import AppDataSource from '../data-source';

async function resetDatabase() {
  const dataSource: DataSource = await AppDataSource.initialize();
  console.log("Conexão com o banco de dados estabelecida");

  // Remove todas as tabelas, índices, constraints, etc.
  await dataSource.dropDatabase();
  console.log("Banco de dados limpo com dropDatabase()");

  // Opcional: Se você quiser rodar as migrations automaticamente no reset:
  // await dataSource.runMigrations();
  // console.log("Migrations executadas com sucesso");

  await dataSource.destroy();
  console.log("Conexão com o banco de dados fechada");
}

// Executa a função principal
resetDatabase()
  .catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  }); 