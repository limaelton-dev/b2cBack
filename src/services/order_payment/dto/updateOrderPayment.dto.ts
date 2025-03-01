import { IsOptional, IsNumber, IsString, IsEnum, IsDecimal } from 'class-validator';
import { PaymentMethod } from 'src/models/order_payment/order_payment';

export class UpdateOrderPaymentDto {
  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method?: PaymentMethod;

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
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  status?: string;
} 