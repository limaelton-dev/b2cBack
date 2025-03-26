import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString({ message: 'Número do cartão deve ser uma string' })
  cardNumber?: string;

  @IsOptional()
  @IsString({ message: 'Nome do titular deve ser uma string' })
  holderName?: string;

  @IsOptional()
  @IsString({ message: 'Data de expiração deve ser uma string' })
  expirationDate?: string;

  @IsOptional()
  @IsBoolean({ message: 'Padrão deve ser um booleano' })
  isDefault?: boolean;

  @IsOptional()
  @IsString({ message: 'Bandeira do cartão deve ser uma string' })
  brand?: string;
} 