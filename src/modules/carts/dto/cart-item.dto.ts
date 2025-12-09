import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class CartItemDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  productId: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  skuId: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quantity: number;
}