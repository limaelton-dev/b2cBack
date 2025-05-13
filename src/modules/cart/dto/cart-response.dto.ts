export class CartItemResponseDto {
  id: number;
  productId: number;
  quantity: number;
}

export class CartResponseDto {
  id: number;
  subtotal: number;
  total: number;
  items: CartItemResponseDto[];
} 