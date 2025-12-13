import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, ValidateNested } from 'class-validator';

class ShippingAddressOverrideDto {
  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  reference?: string;
}

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  shippingAddressId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingAddressOverrideDto)
  shippingAddressOverride?: ShippingAddressOverrideDto;

  @IsOptional()
  @IsNumber()
  billingAddressId?: number;

  @IsOptional()
  @IsString()
  shippingOptionCode?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}

export interface OrderResult {
  orderId: number;
  partnerOrderId: string;
  status: string;
  itemsTotal: string;
  shippingTotal: string;
  discountTotal: string;
  grandTotal: string;
}
