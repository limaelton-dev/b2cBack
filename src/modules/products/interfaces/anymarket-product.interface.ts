export interface AnyMarketProduct {
    id?: number | string;
    title?: string;
    partnerId?: string;
    sku?: string;
    description?: string;
    price?: number;
    salePrice?: number;
    brand?: { id?: number | string; name?: string };
    categories?: Array<{ id: number | string; name?: string; fullPath?: string }>;
    isProductActive?: boolean;
  }