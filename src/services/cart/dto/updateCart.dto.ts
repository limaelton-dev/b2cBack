import { IsArray, IsOptional, IsNumber, IsObject, ValidateNested, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
    @IsNumber()
    produto_id: number;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsObject()
    @IsOptional()
    product?: any;
}

export class UpdateCartDto {
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    cart_data?: CartItemDto[];
}

export class CartDataDto {
    cart_data: CartItemDto[];
}