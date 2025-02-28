import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  unit_price: number;
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  profile_id: number;

  @IsNumber()
  @IsNotEmpty()
  shipping_address_id: number;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'O pedido deve ter pelo menos um item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
} 