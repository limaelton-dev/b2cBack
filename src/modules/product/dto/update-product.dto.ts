import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Type(() => Number)
  @Min(0, { message: 'Preço deve ser maior ou igual a zero' })
  price?: number;
} 