import { IsString, IsNumber, IsArray, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsNumber()
  skuId: number;

  @IsString()
  partnerId: string;

  @IsNumber()
  quantity: number;
}

export class CartShippingRequestDto {
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  destinationZipCode: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

export { CartItemDto };
