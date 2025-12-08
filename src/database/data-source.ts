import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const isTsRuntime = __filename.endsWith('.ts');
const baseDir = isTsRuntime ? 'src' : 'dist';
const fileExt = isTsRuntime ? 'ts' : 'js';
const entitiesPath = path.join(baseDir, 'modules', '**', '*.entity.' + fileExt);
const migrationsPath = path.join(baseDir, 'database', 'migrations', '*.' + fileExt);

// Versão básica usando variáveis de ambiente para CLI de migrations
export const postgresDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: parseInt(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_DATABASE,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  migrationsTableName: 'migrations_history',
  synchronize: false,
  logging: true, // Habilita logs para debug
  // ssl: false, // Desabilita SSL para conexões locais
};

export const oracleDataSourceOptions: DataSourceOptions = {
  type: 'oracle',
  username: process.env.ORACLE_DB_USERNAME,
  password: process.env.ORACLE_DB_PASSWORD,
  connectString: `${process.env.ORACLE_DB_HOST}:${process.env.ORACLE_DB_PORT}/${process.env.ORACLE_DB_DATABASE}`,
  entities: ['dist/oracle/**/*.entity.js'],
  synchronize: false,
  thickMode: true
};

// Funções que utilizam ConfigService
export const getPostgresDataSourceOptions = (dbConfig: any): DataSourceOptions => {
  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [entitiesPath],
    migrations: [migrationsPath],
    migrationsTableName: 'migrations_history',
    synchronize: false,
    logging: true,
    ssl: false,
  };
};

export const getOracleDataSourceOptions = (dbConfig: any): DataSourceOptions => {
  return {
    type: 'oracle',
    username: dbConfig.username,
    password: dbConfig.password,
    connectString: dbConfig.connectString,
    entities: ['dist/oracle/**/*.entity.js'],
    synchronize: false,
    thickMode: dbConfig.thickMode,
    logging: ["query", "error"],        // faz o log de todas as queries e erros
    logger: "advanced-console",         // logger avançado no console
  };
};

// Instância do DataSource para CLI de migrations
const dataSource = new DataSource(postgresDataSourceOptions);

export default dataSource;