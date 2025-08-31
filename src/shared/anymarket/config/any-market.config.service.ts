import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AnyMarketConfig {
  baseUrl: string;
  apiPrefix: string;
  gumgaToken: string;
  platform: string;
}

export interface AnyMarketHeaders {
  'Content-Type': string;
  gumgaToken: string;
  platform: string;
  [key: string]: string;
}

@Injectable()
export class AnyMarketConfigService {
  constructor(private readonly configService: ConfigService) {}

  getConfig(): AnyMarketConfig {
    return {
      baseUrl: this.configService.get<string>('ANYMARKET_BASE_URL')?.replace(/\/$/, '') || 'https://api.anymarket.com.br',
      apiPrefix: '/v2',
      gumgaToken: this.configService.get<string>('ANYMARKET_GUMGA_TOKEN')!,
      platform: this.configService.get<string>('ANYMARKET_PLATFORM')!,
    };
  }

  getHeaders(): AnyMarketHeaders {
    const config = this.getConfig();
    return {
      'Content-Type': 'application/json',
      gumgaToken: config.gumgaToken,
      platform: config.platform,
    };
  }

  getFullUrl(endpoint: string): string {
    const config = this.getConfig();
    return `${config.baseUrl}${config.apiPrefix}${endpoint}`;
  }
}

// Função utilitária para casos onde não é possível injetar o serviço
export function createAnyMarketHeaders(configService: ConfigService): AnyMarketHeaders {
  return {
    'Content-Type': 'application/json',
    gumgaToken: configService.get<string>('ANYMARKET_GUMGA_TOKEN')!,
    platform: configService.get<string>('ANYMARKET_PLATFORM')!,
  };
}