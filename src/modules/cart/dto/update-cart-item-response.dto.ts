import { CartResponseDto } from './cart-response.dto';

export class UpdateCartItemResponseDto {
  productId: number;
  cart: CartResponseDto;
} 