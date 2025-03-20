import { IsOptional, IsString, IsNumber, Min, Max, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDiscountDto {
  @IsOptional()
  @IsString({ message: 'Código deve ser uma string' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Percentual deve ser um número' })
  @Min(0, { message: 'Percentual deve ser maior ou igual a 0' })
  @Max(100, { message: 'Percentual deve ser menor ou igual a 100' })
  percentage?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Valor fixo deve ser um número' })
  @Min(0, { message: 'Valor fixo deve ser maior ou igual a 0' })
  fixedAmount?: number;

  @IsOptional()
  @IsDate({ message: 'Data de validade deve ser uma data válida' })
  @Type(() => Date)
  expirationDate?: Date;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Quantidade de usos deve ser um número' })
  @Min(0, { message: 'Quantidade de usos deve ser maior ou igual a 0' })
  usageLimit?: number;
} 