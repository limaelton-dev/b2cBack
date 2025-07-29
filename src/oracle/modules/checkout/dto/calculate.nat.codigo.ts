import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CalculateNatCodigoDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  CLI_CODIGO: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  PRP_TRIANGULACAO: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  PRP_FINALIDADE: number;
} 