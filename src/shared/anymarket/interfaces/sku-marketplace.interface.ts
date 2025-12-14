export interface SkuMarketplaceListing {
  id: number;
  skuId?: number;
  partnerId: string;
  marketplace: string;
  status: string;
  price?: number;
  discountPrice?: number;
  amount?: number;
  stockLocalId?: number;
  permalink?: string;
}

export interface SkuMarketplaceData {
  listingId: number;
  skuId: number;
  partnerId: string;
  marketplace: string;
  status: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export function isListingActive(listing: SkuMarketplaceListing): boolean {
  const activeStatuses = ['ACTIVE', 'PUBLISHED', 'OK'];
  return activeStatuses.includes(listing.status?.toUpperCase() ?? '');
}

export function toSkuMarketplaceData(
  listing: SkuMarketplaceListing,
  skuId: number,
): SkuMarketplaceData {
  return {
    listingId: listing.id,
    skuId,
    partnerId: listing.partnerId,
    marketplace: listing.marketplace,
    status: listing.status,
    price: listing.discountPrice ?? listing.price ?? 0,
    stock: listing.amount ?? 0,
    isActive: isListingActive(listing),
  };
}
