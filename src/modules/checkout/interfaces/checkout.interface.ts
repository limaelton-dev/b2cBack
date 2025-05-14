export interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  name: string;
  sku: string;
  stock: number;
}

export interface ShippingOption {
  code: string;
  name: string;
  price: number;
  deliveryTime: number;
  isEstimated?: boolean;
}

export interface CartValidation {
  isValid: boolean;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discounts: number;
  errors?: string[];
  shippingOptions?: ShippingOption[];
}

export interface CheckoutError extends Error {
  code: string;
  details?: Record<string, any>;
}

export class CheckoutException extends Error {
  public readonly code: string;
  public readonly details: any;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'CheckoutException';
    this.code = code;
    this.details = details;
  }
} 