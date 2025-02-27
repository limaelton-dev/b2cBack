import { IsOptional, IsString } from 'class-validator';

export class CreateProfilePJDto {
  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  trading_name?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsOptional()
  @IsString()
  state_registration?: string;

  @IsOptional()
  @IsString()
  municipal_registration?: string;
} 