import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional  } from 'class-validator';

export class CreateCardDto {
  @IsOptional()
  @IsNumber({}, { message: 'ID do perfil deve ser um número' })
  profileId?: number;

  @IsNotEmpty({ message: 'Número do cartão é obrigatório' })
  @IsString({ message: 'Número do cartão deve ser uma string' })
  cardNumber: string;

  @IsNotEmpty({ message: 'Nome do titular é obrigatório' })
  @IsString({ message: 'Nome do titular deve ser uma string' })
  holderName: string;

  @IsNotEmpty({ message: 'Data de expiração é obrigatória' })
  @IsString({ message: 'Data de expiração deve ser uma string' })
  expirationDate: string;

  @IsOptional()
  @IsBoolean({ message: 'Padrão deve ser um booleano' })
  isDefault?: boolean;

  @IsNotEmpty({ message: 'Bandeira do cartão é obrigatória' })
  @IsString({ message: 'Bandeira do cartão deve ser uma string' })
  brand: string;

  @IsNotEmpty({ message: 'CVV do cartão é obrigatória' })
  cvv: number;
} 