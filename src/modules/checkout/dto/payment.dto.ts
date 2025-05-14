import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CustomerDataDto {
  @ApiProperty({ description: 'Nome do cliente' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Email do cliente' })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class ProcessCreditCardDto {
  @ApiProperty({ description: 'Número do cartão de crédito', example: '4012001038443335' })
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @ApiProperty({ description: 'Nome do titular do cartão', example: 'NOME DO TITULAR' })
  @IsString()
  @IsNotEmpty()
  holder: string;

  @ApiProperty({ description: 'Data de validade do cartão (MM/AAAA)', example: '12/2030' })
  @IsString()
  @IsNotEmpty()
  expirationDate: string;

  @ApiProperty({ description: 'Código de segurança do cartão (CVV)', example: '123' })
  @IsString()
  @IsNotEmpty()
  securityCode: string;

  @ApiProperty({ description: 'Bandeira do cartão', example: 'Visa' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiPropertyOptional({ description: 'Descrição da compra', example: 'Compra online' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Número de parcelas', minimum: 1, maximum: 12, default: 1 })
  @IsNumber()
  @Min(1)
  @Max(12)
  @IsOptional()
  installments?: number;

  @ApiPropertyOptional({ description: 'Dados do cliente' })
  @IsOptional()
  customerData?: CustomerDataDto;

  @ApiProperty({ description: 'Endereço completo para entrega do pedido' })
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class ProcessTokenizedCardDto {
  @ApiProperty({ description: 'Token do cartão' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'Bandeira do cartão', example: 'Visa' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiPropertyOptional({ description: 'Descrição da compra', example: 'Compra online (token)' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Número de parcelas', minimum: 1, maximum: 12, default: 1 })
  @IsNumber()
  @Min(1)
  @Max(12)
  @IsOptional()
  installments?: number;

  @ApiPropertyOptional({ description: 'Dados do cliente' })
  @IsOptional()
  customerData?: CustomerDataDto;

  @ApiProperty({ description: 'Endereço completo para entrega do pedido' })
  @IsString()
  @IsNotEmpty()
  address: string;
} 