import { IsNumber, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
} 