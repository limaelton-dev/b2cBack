import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MercadoPagoConfig } from "../payment-gateway/mercado-pago/mercado-pago.config";

export const MercadoPagoConfigProvider: Provider = {
    provide: 'MercadoPagoConfig',
    useFactory: (configService: ConfigService): MercadoPagoConfig => {
        return {
            accessToken: configService.get<string>('MP_ACCESS_TOKEN')!,
            environment: configService.get<string>('MP_ENVIRONMENT') === 'production' ? 'production' : 'sandbox',
            notificationUrl: configService.get<string>('MP_NOTIFICATION_URL'),
        }
    },
    inject: [ConfigService]
}