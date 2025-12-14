import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MercadoPagoConfig } from "../payment-gateway/mercado-pago/mercado-pago.config";

export const MercadoPagoConfigProvider: Provider = {
    provide: 'MercadoPagoConfig',
    useFactory: (configService: ConfigService): MercadoPagoConfig | null => {
        const accessToken = configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN');
        const environment = configService.get<string>('MP_ENVIRONMENT') || 'sandbox';
        const notificationUrl = configService.get<string>('MP_NOTIFICATION_URL');

        if (!accessToken) {
            return null;
        }
        return {
            accessToken,
            environment: environment === 'production' ? 'production' : 'sandbox',
            notificationUrl,
        }
    },
    inject: [ConfigService]
}