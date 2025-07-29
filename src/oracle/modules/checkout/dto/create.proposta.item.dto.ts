import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsIn, MaxLength, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePropostaItemDto {
  @IsNumber()
  @IsNotEmpty()
  PRP_CODIGO: number;

  @IsNumber()
  @IsNotEmpty()
  PRI_SEQUENCIA: number;

  @IsNumber()
  @IsNotEmpty()
  PRO_CODIGO: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  PRI_TABELAVENDA: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_QUANTIDADE: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  PRI_UNIDADE: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  PRI_DESCRICAO: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  PRI_DESCRICAOTECNICA: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  PRI_REFERENCIA: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_DESCONTO: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORDESCONTO: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORUNITARIO: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORUNITARIOTABELA: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORUNITARIOMAIOR: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_IPI: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORIPI: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORTOTAL: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  PRI_ENTREGA: string;

  @IsDateString()
  @IsOptional()
  PRI_DATAENTREGA: Date;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  PRI_CODIGOPEDIDOCLIENTE: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  PRI_CODIGOPRODUTOCLIENTE: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_CUSTO: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_CUSTOMEDIO: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_CUSTOMARKUP: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORULTIMACOMPRA: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_PERCENTUALMARKUP: number;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  PRI_TIPOIMPRESSAO: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  PRI_MALA: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  PRI_TIPOMALA: string;

  @IsString()
  @IsOptional()
  @IsIn(['S', 'N'])
  @MaxLength(1)
  PRI_FLAGVALE: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  PRI_USUARIO: string; // quem incluiu

  @IsNumber()
  @IsNotEmpty()
  @IsIn([1, 2, 3])
  TIPO: number; // 1 = incluir, 2 = alterar, 3 = excluir

  @IsString()
  @IsNotEmpty()
  @IsIn(['S', 'N'])
  @MaxLength(1)
  COMMIT: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORICMSST: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_BASECALCULOICMSST: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_BASECALCULOICMS: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORICMS: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_ICMSVENDA: number;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  PRI_TIPOFISCAL: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_DESCONTOESPECIAL: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORDESCESP: number;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  PRI_TIPODESC: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  PRP_TRIANGULACAO: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  PRI_TIPOVPC: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  PRI_VALORCREDVPC: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value || 0)
  PRI_PERDESCIN?: number = 0; // default 0

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value || 0)
  PRI_VLRDESCIN?: number = 0; // default 0

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value || 0)
  PRI_ICMSDESON?: number = 0; // default 0

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value || 0)
  PRI_VALORFRETE?: number = 0; // default 0

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value || 0)
  PRI_VALOROUTRO?: number = 0; // default 0

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value || 0)
  PRI_VALOR_UNITARIO_FINAL?: number = 0; // default 0

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value || 0)
  PRI_VALORSEMDIFAL?: number = 0; // default 0
}