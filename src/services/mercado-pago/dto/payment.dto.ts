import { IsNotEmpty, IsNumber, IsString, IsObject, IsOptional, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class PayerDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsObject()
  identification?: {
    type: string;
    number: string;
  };

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;
}

export class PaymentDTO {
  @IsNumber()
  @IsNotEmpty()
  transaction_amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  payment_method_id: string;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  installments?: number;

  @IsOptional()
  @IsString()
  external_reference?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayerDTO)
  payer: PayerDTO;
} 