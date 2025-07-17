import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsIn, MaxLength, IsEmail, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePropostaDto {
    @IsNumber()
    @IsNotEmpty()
    prpCodigo: number; // Codigo da proposta

    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => value || 2) // sempre 2
    ratCodigo: number = 2; // Código do estoque de rateio

    @IsNumber()
    @IsNotEmpty()
    cliCodigo: number; // Código do cliente

    @IsNumber()
    @IsNotEmpty()
    oriCodigo?: number; // Codigo da origem

    @IsNumber()
    @IsNotEmpty()
    traCodigo?: number; // Codigo da transportadora

    @IsNumber()
    @IsNotEmpty()
    cpgCodigo: number; // Codigo do pagamento

    @IsNumber()
    @IsNotEmpty()
    ptpCodigo: number; // Proposta tipo

    @IsString()
    @IsNotEmpty()
    @IsIn(['CA', 'FT', 'OK', 'PE', 'PK', 'PN', 'PR'])
    prpSituacao: string; // Situação da proposta

    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    prpNome: string; // Nome da cliente(B2C ou nome do cliente)

    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    prpEndereco: string; // Endereço da cliente(RUA + NUMERO + COMPLEMENTO)

    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    prpBairro: string; // Bairro da cliente

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    prpCidade: string; // Cidade da cliente

    @IsString()
    @IsNotEmpty()
    @MaxLength(2)
    prpUf: string; // Estado da cliente

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{8}$/, { message: 'CEP deve conter exatamente 8 dígitos numéricos' })
    prpCep: string; // CEP da cliente

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    prpFone?: string; // Telefone da cliente

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(70)
    prpEmail?: string; // Email da cliente

    @IsNumber()
    @IsNotEmpty()
    prpVendedorInterno: number; // Código Vendedor interno

    @IsNumber()
    @IsNotEmpty()
    prpVendedorExterno: number; // Código Vendedor externo

    @IsDateString()
    @IsNotEmpty()
    prpDataEmissao: string; // Data de emissão da proposta

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    prpObservacaoNota?: string; // Observação da nota fiscal

    @IsDateString()
    @IsNotEmpty()
    prpDataEntrega?: string; // Data de entrega

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @Type(() => Number)
    prpValorFrete?: number; // Valor do frete

    @IsString()
    @IsNotEmpty()
    @IsIn(['S', 'N'])
    prpFretePago: string; // Frete pago

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @Type(() => Number)
    prpValorTotal?: number; // Valor total da proposta

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @Type(() => Number)
    prpValorTotalDesconto?: number; // Valor total do desconto

    @IsString()
    @IsNotEmpty()
    @IsIn(['V', 'F', 'E', 'O'])
    @MaxLength(1)
    prpFormaConfirmacao?: string; // Forma de confirmacao da proposta (V, F, E ou O)

    @IsString()
    @IsNotEmpty()
    @IsIn(['V', 'F', 'D'])
    @MaxLength(1)
    prpTipoFaturamento?: string; // Tipo de faturamento da proposta (V, F, D)

    @IsString()
    @IsNotEmpty()
    @IsIn(['E', 'R'])
    @MaxLength(1)
    prpTipoEntrega?: string; // Tipo de entrega da proposta (E ou R)

    @IsDateString()
    @IsNotEmpty()
    prpShipDate?: string; // Data de envio da proposta

    @IsDateString()
    @IsNotEmpty()
    prpIncluidaData: string; // Data da inclusão da proposta

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    prpIncluidoPor: string; // Nome do usuário que incluiu a proposta

    @IsDateString()
    @IsNotEmpty()
    prpAlteradaData: string; // Data da última alteração da proposta

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    prpAlteradaPor: string; // Nome do usuário que alterou a proposta

    @IsNumber()
    @IsNotEmpty()
    @IsIn([0, 1, 2, 3, 4])
    @Transform(({ value }) => value || 0) // DEFAULT 0
    prpTriangulacao: number = 0; // Triangulação
}
