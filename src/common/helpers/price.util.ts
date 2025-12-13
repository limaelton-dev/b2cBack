export function roundPrice(value: number | undefined | null): number {
  if (value == null || isNaN(value)) return 0;
  return Math.round(value * 100) / 100;
}

export interface CartItemForCalculation {
  skuId: number;
  quantity: number;
  available?: boolean;
}

export interface SkuPriceInfo {
  _rawPrice?: number;
}

export function calculateItemsTotal(
  items: CartItemForCalculation[],
  skuMap: Map<number, SkuPriceInfo>,
): number {
  const total = items.reduce((sum, item) => {
    if (item.available === false) return sum;
    const sku = skuMap.get(item.skuId);
    if (!sku) return sum;
    const price = sku._rawPrice ?? 0;
    return sum + price * item.quantity;
  }, 0);

  return roundPrice(total);
}

export function calculateGrandTotal(
  itemsTotal: number,
  shippingTotal: number,
  discountTotal: number,
): number {
  return roundPrice(itemsTotal + shippingTotal - discountTotal);
}
