import { IsNotEmpty, IsString, IsOptional, IsISO8601 } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProfilePfDto {
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @IsString({ message: 'Nome completo deve ser uma string' })
  fullName: string;

  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString({ message: 'CPF deve ser uma string' })
  cpf: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @IsISO8601({}, { message: 'Data de nascimento deve estar no formato ISO8601 (YYYY-MM-DD)' })
  @Transform(({ value }) => new Date(value))
  birthDate: Date;

  @IsOptional()
  @IsString({ message: 'Gênero deve ser uma string' })
  gender?: string;
} 