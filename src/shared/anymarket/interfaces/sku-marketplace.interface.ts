export interface SkuMarketplaceListing {
  id: number;
  skuId?: number;
  skuInMarketplace: string;
  marketPlace: string;
  publicationStatus: string;
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
  originalPrice: number;
  finalPrice: number;
  hasDiscount: boolean;
  stock: number;
  isActive: boolean;
}

export function isListingActive(listing: SkuMarketplaceListing): boolean {
  const activeStatuses = ['ACTIVE', 'PUBLISHED', 'OK'];
  return activeStatuses.includes(listing.publicationStatus?.toUpperCase() ?? '');
}

export function toSkuMarketplaceData(
  listing: SkuMarketplaceListing,
  skuId: number,
): SkuMarketplaceData {
  const originalPrice = listing.price ?? 0;
  const finalPrice = listing.discountPrice ?? listing.price ?? 0;
  const hasDiscount = listing.discountPrice != null && listing.discountPrice < originalPrice;

  return {
    listingId: listing.id,
    skuId,
    partnerId: listing.skuInMarketplace,
    marketplace: listing.marketPlace,
    status: listing.publicationStatus,
    originalPrice,
    finalPrice,
    hasDiscount,
    stock: listing.amount ?? 0,
    isActive: isListingActive(listing),
  };
}
