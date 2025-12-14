// Interfaces alinhadas com a documentação oficial do AnyMarket V2 API

export interface AnymarketOrderCustomerDocument {
  documentType?: 'CPF' | 'CNPJ' | string;
  documentNumber?: string;
  normalizedDocumentNumber?: string;
}

export interface AnymarketOrderAddress {
  state: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  address?: string;
  street?: string;
  number?: string;
  comment?: string;
  reference?: string;
  receiverName?: string;
}

export interface AnymarketOrderBuyer {
  name: string;
  email: string;
  document?: string;
  documentType?: string;
  phone?: string;
  cellPhone?: string;
}

export interface AnymarketOrderPayment {
  method: string;
  status?: string;
  value: number;
  installments?: number;
}

export interface AnymarketOrderShipping {
  city?: string;
  state?: string;
  address?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  zipCode?: string;
  receiverName?: string;
  comment?: string;
  reference?: string;
}

export interface AnymarketOrderItemSku {
  id?: number;
  title?: string;
  partnerId: string;
  externalId?: string;
  ean?: string;
}

export interface AnymarketOrderItemProduct {
  id?: number;
  title?: string;
}

export interface AnymarketOrderItem {
  product?: AnymarketOrderItemProduct;
  sku: AnymarketOrderItemSku;
  amount: number;
  unit: number;
  gross: number;
  total: number;
  discount?: number;
}

export interface AnymarketOrderCreate {
  partnerId: string;
  marketPlace?: string;
  marketPlaceId?: string;
  status?: string;
  buyer: AnymarketOrderBuyer;
  shipping: AnymarketOrderShipping;
  billingAddress?: AnymarketOrderAddress;
  items: AnymarketOrderItem[];
  payments: AnymarketOrderPayment[];
  discount?: number;
  freight?: number;
  gross?: number;
  total?: number;
}

export interface AnymarketOrder extends AnymarketOrderCreate {
  id: number;
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
