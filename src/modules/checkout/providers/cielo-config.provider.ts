import { Provider } from '@nestjs/common';
import { CieloConfig } from '../payment-gateway/cielo/cielo.config';
import { ConfigService } from '@nestjs/config';

export const CieloConfigProvider: Provider = {
  provide: 'CieloConfig',
  useFactory: (configService: ConfigService): CieloConfig => {
    const merchantId = configService.get<string>('CIELO_MERCHANT_ID');
    const merchantKey = configService.get<string>('CIELO_MERCHANT_KEY');
    const environment = configService.get<string>('CIELO_ENVIRONMENT') || 'sandbox';
    const returnUrl = configService.get<string>('CIELO_RETURN_URL');

    if (!merchantId || !merchantKey) {
      throw new Error('CIELO_MERCHANT_ID e CIELO_MERCHANT_KEY são obrigatórios');
    }

    return {
      merchantId,
      merchantKey,
      environment: environment === 'production' ? 'production' : 'sandbox',
      returnUrl,
    };
  },
  inject: [ConfigService],
};
