import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  payment_method?: string;

  @IsNumber()
  @IsOptional()
  shipping_address_id?: number;
} 