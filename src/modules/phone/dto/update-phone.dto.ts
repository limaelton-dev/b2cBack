import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePhoneDto {
  @IsOptional()
  @IsString({ message: 'DDD deve ser uma string' })
  ddd?: string;

  @IsOptional()
  @IsString({ message: 'Número do telefone deve ser uma string' })
  number?: string;

  @IsOptional()
  @IsBoolean({ message: 'Padrão deve ser um booleano' })
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Verificado deve ser um booleano' })
  verified?: boolean;
} 