import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfilePfDto {
  @IsOptional()
  @IsString({ message: 'Nome completo deve ser uma string' })
  fullName?: string;

  @IsOptional()
  @IsString({ message: 'CPF deve ser uma string' })
  cpf?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data de nascimento inválida. Utilize o formato YYYY-MM-DD com valores válidos' })
  birthDate?: Date;

  @IsOptional()
  @IsString({ message: 'Gênero deve ser uma string' })
  gender?: string;
} 