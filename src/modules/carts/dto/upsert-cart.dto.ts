import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CartItemDto } from './cart-item.dto';

export class UpsertCartDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  profileId: number;

  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  @ArrayMinSize(1)
  items: CartItemDto[];
}

