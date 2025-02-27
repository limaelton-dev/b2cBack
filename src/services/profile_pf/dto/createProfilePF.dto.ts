import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateProfilePFDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsString()
  gender?: string;
} 