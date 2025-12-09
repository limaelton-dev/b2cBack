import {
    IsArray,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export enum CheckoutPaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    PIX = 'PIX',
    BOLETO = 'BOLETO',
  }
  
  export class CheckoutCustomerDocumentDto {
    @IsOptional()
    @IsString()
    documentType?: string;
  
    @IsOptional()
    @IsString()
    documentNumber?: string;
  }
  
  export class CheckoutAddressDto {
    @IsString()
    @IsNotEmpty()
    state: string;
  
    @IsString()
    @IsNotEmpty()
    city: string;
  
    @IsString()
    @IsNotEmpty()
    zipCode: string;
  
    @IsString()
    @IsNotEmpty()
    neighborhood: string;
  
    @IsString()
    @IsNotEmpty()
    address: string;
  
    @IsOptional()
    @IsString()
    number?: string;
  
    @IsOptional()
    @IsString()
    complement?: string;
  
    @IsOptional()
    @IsString()
    reference?: string;
  }
  
  export class CheckoutCustomerDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEmail()
    email: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsString()
    cellPhone?: string;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => CheckoutCustomerDocumentDto)
    document?: CheckoutCustomerDocumentDto;
  
    @ValidateNested()
    @Type(() => CheckoutAddressDto)
    shippingAddress: CheckoutAddressDto;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => CheckoutAddressDto)
    billingAddress?: CheckoutAddressDto;
  }
  
  export class CheckoutItemDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    productId: number;
  
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    skuId: number;
  
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    quantity: number;
  }
  
  export class CheckoutPaymentDto {
    @IsEnum(CheckoutPaymentMethod)
    paymentMethod: CheckoutPaymentMethod;
  
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    installments?: number;
  }
  
  export class CheckoutDto {
    // Estratégia simples: o checkout recebe os itens.
    // Caso prefira usar apenas o carrinho do servidor,
    // você pode remover este campo e buscar os itens pelo Cart.
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CheckoutItemDto)
    items: CheckoutItemDto[];
  
    @ValidateNested()
    @Type(() => CheckoutCustomerDto)
    customer: CheckoutCustomerDto;
  
    @ValidateNested()
    @Type(() => CheckoutPaymentDto)
    payment: CheckoutPaymentDto;
  
    @IsOptional()
    @IsString()
    marketplace?: string;
  }
  