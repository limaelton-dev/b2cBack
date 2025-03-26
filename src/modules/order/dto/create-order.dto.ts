import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsInt, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty({ message: 'ID do produto é obrigatório' })
  @IsInt({ message: 'ID do produto deve ser um número inteiro' })
  productId: number;

  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsInt({ message: 'Quantidade deve ser um número inteiro' })
  @Min(1, { message: 'Quantidade deve ser maior ou igual a 1' })
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Endereço completo é obrigatório' })
  @IsString({ message: 'Endereço completo deve ser uma string' })
  fullAddress: string;

  @IsOptional()
  @IsInt({ message: 'ID do desconto deve ser um número inteiro' })
  discountId?: number;

  @IsNotEmpty({ message: 'Itens do pedido são obrigatórios' })
  @IsArray({ message: 'Itens do pedido devem ser um array' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
} 