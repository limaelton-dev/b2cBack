import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, Length, Matches } from 'class-validator';

export class CreateCardDto {
  @IsNumber()
  @IsNotEmpty()
  profile_id: number;

  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  card_number: string;

  @IsString()
  @IsNotEmpty()
  holder_name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'O formato da data de expiração deve ser MM/YY' })
  expiration_date: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;

  @IsString()
  @IsNotEmpty()
  card_type: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  last_four_digits: string;
  
  @IsString()
  @IsOptional()
  cvv?: string;
} 