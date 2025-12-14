export interface ShippingServiceOption {
  serviceName: string;
  carrierName?: string;
  price: number;
  deliveryDays: number;
  estimatedDeliveryDate: Date;
}

export interface ShippingResponseDto {
  success: boolean;
  message?: string;
  zipCode?: string;
  services?: ShippingServiceOption[];
}
