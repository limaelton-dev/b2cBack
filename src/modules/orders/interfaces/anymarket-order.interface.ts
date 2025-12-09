// Interfaces simplificadas com foco no fluxo que você vai usar agora.
// Você pode enriquecer à medida que for precisando de mais campos.

export interface AnymarketOrderCustomerDocument {
    documentType?: 'CPF' | 'CNPJ' | string;
    documentNumber?: string;
    normalizedDocumentNumber?: string;
  }
  
  export interface AnymarketOrderCustomerAddress {
    state: string;
    city: string;
    zipCode: string;
    neighborhood: string;
    address: string;
    street?: string;
    number?: string;
    complement?: string;
    reference?: string;
  }
  
  export interface AnymarketOrderCustomer {
    name: string;
    email: string;
    document?: AnymarketOrderCustomerDocument;
    phone?: string;
    cellPhone?: string;
    billingAddress?: AnymarketOrderCustomerAddress;
    shippingAddress?: AnymarketOrderCustomerAddress;
  }
  
  export interface AnymarketOrderItem {
    sku: string;
    title?: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    discount?: number;
  }
  
  export interface AnymarketOrderPayment {
    paymentMethod: string;
    installments?: number;
    totalPaid: number;
  }
  
  export interface AnymarketOrderShipping {
    freightType?: string;
    carrierName?: string;
    serviceName?: string;
    freightPrice: number;
    estimatedDeliveryDate?: string;
  }
  
  export interface AnymarketOrderCreate {
    partnerId: string;
    marketplace?: string;
    marketplaceOrderId?: string;
    customer: AnymarketOrderCustomer;
    items: AnymarketOrderItem[];
    payment: AnymarketOrderPayment;
    shipping: AnymarketOrderShipping;
    discountTotal?: number;
    itemsTotal: number;
    grandTotal: number;
  }
  
  export interface AnymarketOrder extends AnymarketOrderCreate {
    id: number;
    status: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface AnymarketOrderFeed {
    id: number;
    orderId: number;
    type: string;
    status: 'PENDING' | 'PROCESSED' | string;
    createdAt: string;
    updatedAt: string;
  }
  