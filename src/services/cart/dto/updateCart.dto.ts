import { IsArray, IsOptional } from 'class-validator';

export class UpdateCartDto {
    @IsArray()
    @IsOptional()
    cart_data?: any;
}

export class CartDataDto {
    cart_data: any;
}