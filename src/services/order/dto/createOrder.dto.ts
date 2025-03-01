import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  produto_id: number;

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
  address_id: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'O pedido deve ter pelo menos um item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
} 