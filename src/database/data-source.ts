import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// Versão básica usando variáveis de ambiente para CLI de migrations
export const postgresDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: parseInt(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations_history',
  synchronize: false,
};

export const oracleDataSourceOptions: DataSourceOptions = {
  type: 'oracle',
  host: process.env.ORACLE_DB_HOST,
  port: parseInt(process.env.ORACLE_DB_PORT),
  username: process.env.ORACLE_DB_USERNAME,
  password: process.env.ORACLE_DB_PASSWORD,
  database: process.env.ORACLE_DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  synchronize: false
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
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
    migrationsTableName: 'migrations_history',
    synchronize: false,
  };
};

export const getOracleDataSourceOptions = (dbConfig: any): DataSourceOptions => {
  return {
    type: 'oracle',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: ['dist/**/*.entity.js'],
    synchronize: false
  };
};

// Instância do DataSource para CLI de migrations
const dataSource = new DataSource(postgresDataSourceOptions);

export default dataSource;