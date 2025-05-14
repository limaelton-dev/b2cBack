import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePhoneDto {
  @IsOptional()
  @IsNumber({}, { message: 'ID do perfil deve ser um número' })
  profileId?: number;

  @IsNotEmpty({ message: 'DDD é obrigatório' })
  @IsString({ message: 'DDD deve ser uma string' })
  ddd: string;

  @IsNotEmpty({ message: 'Número do telefone é obrigatório' })
  @IsString({ message: 'Número do telefone deve ser uma string' })
  number: string;

  @IsOptional()
  @IsBoolean({ message: 'Padrão deve ser um booleano' })
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Verificado deve ser um booleano' })
  verified?: boolean;
} 