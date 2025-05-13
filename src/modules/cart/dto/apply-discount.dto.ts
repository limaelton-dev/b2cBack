import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyDiscountDto {
  @IsNotEmpty({ message: 'O código de desconto é obrigatório' })
  @IsString({ message: 'O código de desconto deve ser uma string' })
  code: string;
} 