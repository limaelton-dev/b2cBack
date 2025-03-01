import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CheckoutDto {
  @IsNumber()
  @IsNotEmpty()
  shipping_address_id: number;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsNumber()
  @IsOptional()
  card_id?: number;
} 