import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString({ message: 'Rua deve ser uma string' })
  street?: string;

  @IsOptional()
  @IsString({ message: 'Número deve ser uma string' })
  number?: string;

  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  complement?: string;

  @IsOptional()
  @IsString({ message: 'Bairro deve ser uma string' })
  neighborhood?: string;

  @IsOptional()
  @IsString({ message: 'Cidade deve ser uma string' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Estado deve ser uma string' })
  state?: string;

  @IsOptional()
  @IsString({ message: 'CEP deve ser uma string' })
  zipCode?: string;

  @IsOptional()
  @IsBoolean({ message: 'isDefault deve ser um booleano' })
  isDefault?: boolean;
} 