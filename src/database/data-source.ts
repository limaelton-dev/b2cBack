import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const isTsRuntime = __filename.endsWith('.ts');
const baseDir = isTsRuntime ? 'src' : 'dist';
const fileExt = isTsRuntime ? 'ts' : 'js';
const entitiesPath = path.join(baseDir, 'modules', '**', '*.entity.' + fileExt);
const migrationsPath = path.join(baseDir, 'database', 'migrations', '*.' + fileExt);

const isProduction = process.env.NODE_ENV === 'production';
const enableLogging = process.env.DB_LOGGING === 'true' && !isProduction;

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
  logging: enableLogging ? ['error', 'warn', 'migration'] : ['error'],
};

export const oracleDataSourceOptions: DataSourceOptions = {
  type: 'oracle',
  username: process.env.ORACLE_DB_USERNAME,
  password: process.env.ORACLE_DB_PASSWORD,
  connectString: `${process.env.ORACLE_DB_HOST}:${process.env.ORACLE_DB_PORT}/${process.env.ORACLE_DB_DATABASE}`,
  entities: ['dist/oracle/**/*.entity.js'],
  synchronize: false,
  thickMode: true,
  logging: isProduction ? ['error'] : ['error', 'warn'],
};

export const getPostgresDataSourceOptions = (dbConfig: any): DataSourceOptions => {
  const isProd = process.env.NODE_ENV === 'production';
  const dbLogging = process.env.DB_LOGGING === 'true' && !isProd;

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
    logging: dbLogging ? ['error', 'warn', 'migration'] : ['error'],
    ssl: false,
  };
};

export const getOracleDataSourceOptions = (dbConfig: any): DataSourceOptions => {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    type: 'oracle',
    username: dbConfig.username,
    password: dbConfig.password,
    connectString: dbConfig.connectString,
    entities: ['dist/oracle/**/*.entity.js'],
    synchronize: false,
    thickMode: dbConfig.thickMode,
    logging: isProd ? ['error'] : ['error', 'warn'],
  };
};

const dataSource = new DataSource(postgresDataSourceOptions);

export default dataSource;
