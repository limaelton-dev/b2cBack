import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IsCnpj } from 'src/common/validators/document.validator';

export class CreateProfilePjDto {
  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  @IsString({ message: 'Razão social deve ser uma string' })
  companyName: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @IsCnpj({ message: 'CNPJ inválido' })
  cnpj: string;

  @IsOptional()
  @IsString({ message: 'Nome fantasia deve ser uma string' })
  tradingName?: string;

  @IsOptional()
  @IsString({ message: 'Inscrição estadual deve ser uma string' })
  stateRegistration?: string;

  @IsOptional()
  @IsString({ message: 'Inscrição municipal deve ser uma string' })
  municipalRegistration?: string;
} 