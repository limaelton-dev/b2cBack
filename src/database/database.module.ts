import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getOracleDataSourceOptions, getPostgresDataSourceOptions } from './data-source';
import { AppConfigService } from '../config/app.config.service';
import { AppConfigModule } from '../config/app.config.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule, AppConfigModule],
      inject: [ConfigService, AppConfigService],
      useFactory: async (configService: ConfigService, appConfigService: AppConfigService) => {
        const dbConfig = appConfigService.getPostgresDatabaseConfig();
        const options = getPostgresDataSourceOptions(dbConfig);
        return {
          ...options
        };
      },
    }),
    // TypeOrmModule.forRootAsync({
    //   name: 'oracle',
    //   imports: [ConfigModule, AppConfigModule],
    //   inject: [ConfigService, AppConfigService],
    //   useFactory: async (configService: ConfigService, appConfigService: AppConfigService) => {
    //     const dbConfig = appConfigService.getOracleDatabaseConfig();
    //     const options = getOracleDataSourceOptions(dbConfig);
    //     return {
    //       ...options
    //     };
    //   },
    // }),
  ],
})
export class DatabaseModule {} 