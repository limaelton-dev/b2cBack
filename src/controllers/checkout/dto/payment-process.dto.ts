import { IsNotEmpty, IsNumber, IsString, IsOptional, IsObject, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class PayerIdentificationDTO {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  number: string;
}

export class PayerDTO {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PayerIdentificationDTO)
  identification?: PayerIdentificationDTO;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;
}

export class PaymentProcessDTO {
  @IsNumber()
  @IsNotEmpty()
  order_id: number;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsString()
  @IsNotEmpty()
  payment_method_id: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsNumber()
  @IsOptional()
  installments?: number;

  @IsNumber()
  @IsOptional()
  card_id?: number;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PayerDTO)
  payer?: PayerDTO;
} 