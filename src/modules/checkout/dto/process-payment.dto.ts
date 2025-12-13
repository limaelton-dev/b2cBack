import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max, ValidateNested } from 'class-validator';

export enum PaymentType {
  CREDIT_CARD = 'credit-card',
  DEBIT_CARD = 'debit-card',
  PIX = 'pix',
}

export enum GatewayType {
  MERCADO_PAGO = 'mercado-pago',
  CIELO = 'cielo',
}

class PayerIdentificationDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  number: string;
}

class CardDataDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  brand: string;
}

export class ProcessPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CardDataDto)
  card?: CardDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PayerIdentificationDto)
  payerIdentification?: PayerIdentificationDto;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  installments?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
