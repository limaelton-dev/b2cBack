import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get(key: string): string {
    return this.configService.get<string>(key);
  }

  getNumber(key: string): number {
    return Number(this.configService.get<string>(key));
  }

  getBoolean(key: string): boolean {
    return this.configService.get<string>(key) === 'true';
  }

  getJwtSecret(): string {
    return this.get('JWT_SECRET');
  }

  getPostgresDatabaseConfig() {
    return {
      host: this.get('POSTGRES_DB_HOST'),
      port: this.getNumber('POSTGRES_DB_PORT'),
      username: this.get('POSTGRES_DB_USERNAME'),
      password: this.get('POSTGRES_DB_PASSWORD'),
      database: this.get('POSTGRES_DB_DATABASE'),
    };
  }

  getOracleDatabaseConfig() {
    return {
      host: this.get('ORACLE_DB_HOST'),
      port: this.getNumber('ORACLE_DB_PORT'),
      username: this.get('ORACLE_DB_USERNAME'),
      password: this.get('ORACLE_DB_PASSWORD'),
      database: this.get('ORACLE_DB_DATABASE'),
    };
  }

  getMercadoPagoConfig() {
    return {
      accessToken: this.get('MERCADO_PAGO_ACCESS_TOKEN'),
      publicKey: this.get('MERCADO_PAGO_PUBLIC_KEY'),
    };
  }
}
