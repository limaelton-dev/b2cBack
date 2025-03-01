import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from 'src/models/order_payment/order_payment';

export class CheckoutDto {
  @IsNumber()
  @IsNotEmpty()
  address_id: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  payment_method: PaymentMethod;

  @IsNumber()
  @IsOptional()
  card_id?: number;
} 