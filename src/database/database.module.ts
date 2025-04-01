import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { getOracleDataSourceOptions, getPostgresDataSourceOptions } from './data-source';
import { ConfigService as AppConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [NestConfigModule, ConfigModule],
      inject: [ConfigService, AppConfigService],
      useFactory: async (configService: ConfigService, appConfigService: AppConfigService) => {
        const dbConfig = appConfigService.getPostgresDatabaseConfig();
        const options = getPostgresDataSourceOptions(dbConfig);
        return {
          ...options,
          autoLoadEntities: true,
          logging: configService.get('NODE_ENV') !== 'production',
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      name: 'oracle',
      imports: [NestConfigModule, ConfigModule],
      inject: [ConfigService, AppConfigService],
      useFactory: async (configService: ConfigService, appConfigService: AppConfigService) => {
        const dbConfig = appConfigService.getOracleDatabaseConfig();
        const options = getOracleDataSourceOptions(dbConfig);
        return {
          ...options,
          autoLoadEntities: true,
          logging: configService.get('NODE_ENV') !== 'production',
        };
      },
    }),
  ],
})
export class DatabaseModule {} 