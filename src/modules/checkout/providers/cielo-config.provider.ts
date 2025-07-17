import { Provider } from '@nestjs/common';
import { CieloConfig } from '../payment-gateway/cielo/cielo.config';
import { ConfigService } from '@nestjs/config';

export const CieloConfigProvider: Provider = {
  provide: 'CieloConfig',
  useFactory: (configService: ConfigService): CieloConfig => {
    // Obter valores das variáveis de ambiente ou usar valores padrão
    const merchantId = configService.get<string>('CIELO_MERCHANT_ID') || '168422a9-a87d-4cca-876d-728247d6c7a4';
    const merchantKey = configService.get<string>('CIELO_MERCHANT_KEY') || 'FSCJYHUIOOJZZYOABWBVSGGYJIAMIIFLFBSTUJFC';
    const environment = configService.get<string>('CIELO_ENVIRONMENT') || 'sandbox';
    const returnUrl = configService.get<string>('CIELO_RETURN_URL');
    
    return {
      merchantId,
      merchantKey,
      environment: environment === 'production' ? 'production' : 'sandbox',
      returnUrl
    } as CieloConfig;
  },
  inject: [ConfigService]
}; 