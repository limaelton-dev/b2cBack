import { IsOptional, IsString, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateOrderItemDto {
  @IsOptional()
  @IsInt({ message: 'ID do produto deve ser um número inteiro' })
  productId?: number;

  @IsOptional()
  @IsInt({ message: 'Quantidade deve ser um número inteiro' })
  @Min(1, { message: 'Quantidade deve ser maior ou igual a 1' })
  quantity?: number;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString({ message: 'Endereço completo deve ser uma string' })
  fullAddress?: string;

  @IsOptional()
  @IsInt({ message: 'ID do desconto deve ser um número inteiro' })
  discountId?: number;

  @IsOptional()
  @IsArray({ message: 'Itens do pedido devem ser um array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];
}