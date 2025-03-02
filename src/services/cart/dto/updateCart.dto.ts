import { IsArray, IsOptional, IsNumber, IsObject, ValidateNested, Min, IsString, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
    @IsNumber()
    @IsNotEmpty({ message: 'O ID do produto é obrigatório' })
    produto_id: number;

    @IsNumber()
    @Min(1, { message: 'A quantidade deve ser pelo menos 1' })
    @IsNotEmpty({ message: 'A quantidade é obrigatória' })
    quantity: number;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsObject()
    @IsOptional()
    product?: any;
}

export class UpdateCartDto {
    @IsArray({ message: 'cart_data deve ser um array' })
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    @ArrayNotEmpty({ message: 'O carrinho não pode estar vazio' })
    cart_data: CartItemDto[];
}

export class CartDataDto {
    cart_data: CartItemDto[];
}