import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, IsDecimal } from 'class-validator';
import { PaymentMethod } from 'src/models/order_payment/order_payment';

export class CreateOrderPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  order_id: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  payment_method: PaymentMethod;

  @IsNumber()
  @IsOptional()
  card_id?: number;

  @IsString()
  @IsOptional()
  pix_txid?: string;

  @IsString()
  @IsOptional()
  pix_qrcode?: string;

  @IsString()
  @IsOptional()
  boleto_code?: string;

  @IsString()
  @IsOptional()
  boleto_url?: string;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  status: string;
} 