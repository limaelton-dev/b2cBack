import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  @IsString({ message: 'Rua deve ser uma string' })
  street: string;

  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString({ message: 'Número deve ser uma string' })
  number: string;

  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  complement?: string;

  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @IsString({ message: 'Bairro deve ser uma string' })
  neighborhood: string;

  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString({ message: 'Cidade deve ser uma string' })
  city: string;

  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString({ message: 'Estado deve ser uma string' })
  state: string;

  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString({ message: 'CEP deve ser uma string' })
  zipCode: string;

  @IsOptional()
  @IsBoolean({ message: 'isDefault deve ser um booleano' })
  isDefault?: boolean;
} 