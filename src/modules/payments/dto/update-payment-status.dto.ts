import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsNotEmpty({ message: 'Status é obrigatório' })
  @IsString({ message: 'Status deve ser uma string' })
  status: string;
} 