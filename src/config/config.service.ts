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

  getDatabaseConfig() {
    return {
      host: this.get('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_DATABASE'),
    };
  }

  getMercadoPagoConfig() {
    return {
      accessToken: this.get('MERCADO_PAGO_ACCESS_TOKEN'),
      publicKey: this.get('MERCADO_PAGO_PUBLIC_KEY'),
    };
  }
}
