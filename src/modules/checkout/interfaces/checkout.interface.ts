export interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  name: string;
  sku: string;
  stock: number;
}

export interface CartValidation {
  isValid: boolean;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discounts: number;
  errors?: string[];
}

export interface CheckoutError extends Error {
  code: string;
  details?: Record<string, any>;
}

export class CheckoutException extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = 'CheckoutException';
  }
} 