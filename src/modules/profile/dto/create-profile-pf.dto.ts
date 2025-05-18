import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProfilePfDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  firstName: string;

  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  @IsString({ message: 'Sobrenome deve ser uma string' })
  lastName: string;

  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString({ message: 'CPF deve ser uma string' })
  cpf: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @Type(() => Date)
  @IsDate({ message: 'Data de nascimento inválida. Utilize o formato YYYY-MM-DD com valores válidos' })
  birthDate: Date;

  @IsOptional()
  @IsString({ message: 'Gênero deve ser uma string' })
  gender?: string;
} 