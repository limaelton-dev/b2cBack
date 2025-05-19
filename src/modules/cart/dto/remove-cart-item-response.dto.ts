import { CartResponseDto } from './cart-response.dto';

export class RemoveCartItemResponseDto {
  productId: number;
  cart: CartResponseDto;
} 