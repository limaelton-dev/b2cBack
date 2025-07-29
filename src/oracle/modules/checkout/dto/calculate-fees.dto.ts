import { IsNumber, IsNotEmpty } from 'class-validator';

export class CalculateFeesDto {
  @IsNumber()
  @IsNotEmpty()
  PRO_CODIGO: number;

  @IsNumber()
  @IsNotEmpty()
  NAT_CODIGO: number;

  @IsNumber()
  @IsNotEmpty()
  PRP_FINALIDADE: number;

  @IsNumber()
  @IsNotEmpty()
  CLI_CODIGO: number;

  @IsNumber()
  @IsNotEmpty()
  PRI_VALORTOTAL: number;

  @IsNumber()
  @IsNotEmpty()
  PRI_QUANTIDADE: number;
}

export class CalculateFeesResponseDto {
  VALOR_TOTAL: number;
  VALOR_DESCONTO: number;
  PERCENTUAL_IPI: number;
  VALOR_IPI: number;
  VALOR_ICMSST: number;
  VALOR_ICMSST_BASE: number;
  VALOR_ICMS: number;
  VALOR_ICMS_BASE: number;
  PERCENTUAL_ICMS: number;
  VALOR_UNITARIO: number;
  VALOR_FCPST: number;
} 