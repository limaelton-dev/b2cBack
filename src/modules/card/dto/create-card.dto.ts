import { IsNotEmpty, IsString, IsBoolean, IsOptional, Length, Matches } from 'class-validator';

export class CreateCardDto {
  @IsOptional()
  profileId?: number;

  @IsNotEmpty({ message: 'Número do cartão é obrigatório' })
  @IsString({ message: 'Número do cartão deve ser uma string' })
  @Matches(/^\d{13,19}$/, { message: 'Número do cartão inválido' })
  cardNumber: string;

  @IsNotEmpty({ message: 'Nome do titular é obrigatório' })
  @IsString({ message: 'Nome do titular deve ser uma string' })
  @Length(3, 100, { message: 'Nome do titular deve ter entre 3 e 100 caracteres' })
  holderName: string;

  @IsNotEmpty({ message: 'Mês de expiração é obrigatório' })
  @IsString({ message: 'Mês de expiração deve ser uma string' })
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Mês de expiração inválido (01-12)' })
  expirationMonth: string;

  @IsNotEmpty({ message: 'Ano de expiração é obrigatório' })
  @IsString({ message: 'Ano de expiração deve ser uma string' })
  @Matches(/^\d{4}$/, { message: 'Ano de expiração inválido (YYYY)' })
  expirationYear: string;

  @IsNotEmpty({ message: 'CVV é obrigatório' })
  @IsString({ message: 'CVV deve ser uma string' })
  @Matches(/^\d{3,4}$/, { message: 'CVV inválido' })
  cvv: string;

  @IsOptional()
  @IsBoolean({ message: 'Padrão deve ser um booleano' })
  isDefault?: boolean;

  @IsNotEmpty({ message: 'Bandeira do cartão é obrigatória' })
  @IsString({ message: 'Bandeira do cartão deve ser uma string' })
  brand: string;

  @IsOptional()
  @IsString()
  cardToken?: string;
}
