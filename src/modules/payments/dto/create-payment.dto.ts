import { IsNotEmpty, IsInt, IsNumber, IsString, IsEmail, MinLength, IsOptional, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'ID do pedido é obrigatório' })
  @IsInt({ message: 'ID do pedido deve ser um número inteiro' })
  orderId: number;

  @IsNotEmpty({ message: 'Valor da transação é obrigatório' })
  @IsNumber({}, { message: 'Valor da transação deve ser um número' })
  @Min(0.01, { message: 'Valor da transação deve ser maior que zero' })
  transactionAmount: number;

  @IsNotEmpty({ message: 'ID do método de pagamento é obrigatório' })
  @IsInt({ message: 'ID do método de pagamento deve ser um número inteiro' })
  paymentMethodId: number;

  @IsOptional()
  @IsString({ message: 'Token deve ser uma string' })
  token?: string;

  @IsNotEmpty({ message: 'Número de parcelas é obrigatório' })
  @IsInt({ message: 'Número de parcelas deve ser um número inteiro' })
  @Min(1, { message: 'Número de parcelas deve ser pelo menos 1' })
  installments: number;

  @IsOptional()
  @IsString({ message: 'Referência externa deve ser uma string' })
  externalReference?: string;

  @IsNotEmpty({ message: 'Email do pagador é obrigatório' })
  @IsEmail({}, { message: 'Email do pagador deve ser um email válido' })
  payerEmail: string;

  @IsNotEmpty({ message: 'Tipo de identificação do pagador é obrigatório' })
  @IsString({ message: 'Tipo de identificação do pagador deve ser uma string' })
  payerIdentificationType: string;

  @IsNotEmpty({ message: 'Número de identificação do pagador é obrigatório' })
  @IsString({ message: 'Número de identificação do pagador deve ser uma string' })
  payerIdentificationNumber: string;

  @IsNotEmpty({ message: 'Nome do pagador é obrigatório' })
  @IsString({ message: 'Nome do pagador deve ser uma string' })
  payerFirstName: string;

  @IsNotEmpty({ message: 'Sobrenome do pagador é obrigatório' })
  @IsString({ message: 'Sobrenome do pagador deve ser uma string' })
  payerLastName: string;
} 