import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString({ message: 'Nome do titular deve ser uma string' })
  holderName?: string;

  @IsOptional()
  @IsBoolean({ message: 'Padrão deve ser um booleano' })
  isDefault?: boolean;
}
