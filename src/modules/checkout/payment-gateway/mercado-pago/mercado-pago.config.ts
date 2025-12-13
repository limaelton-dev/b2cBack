export interface MercadoPagoConfig {
    accessToken: string;
    environment: 'sandbox' | 'production';
    notificationUrl?: string;
}