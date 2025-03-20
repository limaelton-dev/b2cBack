import { IsString, IsOptional, IsISO8601 } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfilePfDto {
  @IsOptional()
  @IsString({ message: 'Nome completo deve ser uma string' })
  fullName?: string;

  @IsOptional()
  @IsString({ message: 'CPF deve ser uma string' })
  cpf?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'Data de nascimento deve estar no formato ISO8601 (YYYY-MM-DD)' })
  @Transform(({ value }) => value ? new Date(value) : undefined)
  birthDate?: Date;

  @IsOptional()
  @IsString({ message: 'Gênero deve ser uma string' })
  gender?: string;
} 