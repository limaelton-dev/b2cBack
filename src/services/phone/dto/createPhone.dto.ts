import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, Matches } from 'class-validator';

export class CreatePhoneDto {
  @IsNumber()
  @IsNotEmpty()
  profile_id: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9+()-\s]+$/, { message: 'O número de telefone deve conter apenas números, +, (), - e espaços' })
  number: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
} 