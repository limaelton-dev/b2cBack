export interface CieloConfig {
  merchantId: string;
  merchantKey: string;
  environment: 'sandbox' | 'production';
  returnUrl?: string;
} 