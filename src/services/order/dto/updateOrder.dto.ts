import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  @IsOptional()
  address_id?: number;

  @IsString()
  @IsOptional()
  status?: string;
} 