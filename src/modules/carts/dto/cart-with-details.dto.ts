export class BrandDto {
  name: string;
}

export class ProductImageDto {
  main: boolean;
  url: string;
  standardUrl: string;
  originalImage: string;
  variation: string;
}

export class SkuVariationDto {
  description: string;
}

export class ProductSummaryDto {
  title: string;
  brand: BrandDto;
  images: ProductImageDto[];
}

export class SkuDetailsDto {
  title: string;
  price: number;
  partnerId: string;
  ean: string;
  variations: SkuVariationDto[];
  product: ProductSummaryDto;
}

export class CartItemWithDetailsDto {
  skuId: number;
  quantity: number;
  available: boolean;
  sku: SkuDetailsDto;
}

export class CartWithDetailsDto {
  items: CartItemWithDetailsDto[];
  subtotal: number;
}