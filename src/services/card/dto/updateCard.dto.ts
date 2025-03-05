import { IsString, IsOptional, IsBoolean, Length, Matches } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  @Length(16, 16)
  card_number?: string;

  @IsString()
  @IsOptional()
  holder_name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'O formato da data de expiração deve ser MM/YY' })
  expiration_date?: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;

  @IsString()
  @IsOptional()
  card_type?: string;

  @IsString()
  @IsOptional()
  @Length(4, 4)
  last_four_digits?: string;

  @IsString()
  @IsOptional()
  cvv?: string;
} 