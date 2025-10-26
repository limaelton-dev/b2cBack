export interface AnyMarketOrderFilter {
  offset?: number;
  limit?: number;
  marketplaceId?: string;
  accountName?: string;
  orderId?: string;
  orderNumber?: string;
  status?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  createdAfter?: string; // ISO date string
  createdBefore?: string; // ISO date string
  updatedAfter?: string; // ISO date string
  updatedBefore?: string; // ISO date string
}

export interface AnyMarketOrderAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  reference?: string;
}

export interface AnyMarketOrderCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  documentType?: string;
}

export interface AnyMarketOrderItem {
  id: string;
  skuId: string;
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  shippingCost?: number;
  discount?: number;
  images?: string[];
  attributes?: Record<string, any>;
}

export interface AnyMarketOrderPayment {
  method: string;
  value: number;
  installments?: number;
  status: string;
  transactionId?: string;
  details?: Record<string, any>;
}

export interface AnyMarketOrderShipping {
  method: string;
  cost: number;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  status?: string;
}

export interface AnyMarketOrder {
  id: string;
  accountName: string;
  marketplaceId: string;
  marketplaceName: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  subtotalAmount: number;
  discountAmount?: number;
  shippingAmount?: number;
  taxAmount?: number;
  currency: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  purchaseDate: string; // ISO date string
  
  customer: AnyMarketOrderCustomer;
  billingAddress: AnyMarketOrderAddress;
  shippingAddress: AnyMarketOrderAddress;
  items: AnyMarketOrderItem[];
  payments: AnyMarketOrderPayment[];
  shipping: AnyMarketOrderShipping;
  
  notes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface AnyMarketOrdersResponse {
  content: AnyMarketOrder[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface OrderListResponse {
  orders: AnyMarketOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderDetailResponse extends AnyMarketOrder {}
