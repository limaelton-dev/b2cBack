import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';

export class UpdatePhoneDto {
  @IsString()
  @IsOptional()
  @Matches(/^[0-9+()-\s]+$/, { message: 'O número de telefone deve conter apenas números, +, (), - e espaços' })
  number?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
} 