import { IsString, IsOptional } from 'class-validator';

export class UpdateProfilePjDto {
  @IsOptional()
  @IsString({ message: 'Razão social deve ser uma string' })
  companyName?: string;

  @IsOptional()
  @IsString({ message: 'CNPJ deve ser uma string' })
  cnpj?: string;

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