import { IsString, IsOptional, IsDate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { IsCpf } from 'src/common/validators/document.validator';

export class UpdateProfilePfDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Sobrenome deve ser uma string' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'CPF deve ser uma string' })
  @ValidateIf((o) => o.cpf !== undefined)
  @IsCpf({ message: 'CPF inválido' })
  cpf?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data de nascimento inválida. Utilize o formato YYYY-MM-DD com valores válidos' })
  birthDate?: Date;

  @IsOptional()
  @IsString({ message: 'Gênero deve ser uma string' })
  gender?: string;
} 