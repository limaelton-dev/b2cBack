export interface AnyMarketFreightProductDimensions {
  height: number;
  width: number;
  weight: number;
  length: number;
}

export interface AnyMarketFreightProduct {
  skuId: string;
  amount: number;
  dimensions: AnyMarketFreightProductDimensions;
}

export interface AnyMarketFreightRequest {
  zipCode: string;
  marketPlace: string;
  additionalPercentual?: number;
  timeout?: number;
  products: AnyMarketFreightProduct[];
}

export interface AnyMarketFreightProductResponse {
  skuId: string;
  amount: number;
  dimensions: AnyMarketFreightProductDimensions;
  stockAmount?: number;
  additionalDeliveryTime: number;
  price: number;
  discountPrice?: number;
}

export interface AnyMarketFreightResponse {
  marketPlace: string;
  zipCode: string;
  products: AnyMarketFreightProductResponse[];
}
