import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreatePropostaProcedureDto {
    @IsNumber()
    cliCodigo: number; // V_CLI_CODIGO

    @IsNumber()
    @IsOptional()
    oriCodigo?: number; // V_ORI_CODIGO

    @IsNumber()
    @IsOptional()
    traCodigo?: number; // V_TRA_CODIGO

    @IsNumber()
    cpgCodigo: number; // V_CPG_CODIGO

    @IsNumber()
    @IsOptional()
    endCodigo?: number; // V_END_CODIGO

    @IsNumber()
    ptpCodigo: number; // V_PTP_CODIGO

    @IsEnum(['CA', 'FT', 'OK', 'PE', 'PK', 'PN', 'PR'])
    prpSituacao: string; // V_PRP_SITUACAO

    @IsString()
    prpNome: string; // V_PRP_NOME

    @IsString()
    prpEndereco: string; // V_PRP_ENDERECO

    @IsString()
    prpBairro: string; // V_PRP_BAIRRO

    @IsString()
    prpCidade: string; // V_PRP_CIDADE

    @IsString()
    prpUf: string; // V_PRP_UF

    @IsString()
    prpCep: string; // V_PRP_CEP

    @IsString()
    @IsOptional()
    prpFone?: string; // V_PRP_FONE

    @IsString()
    @IsOptional()
    prpFax?: string; // V_PRP_FAX

    @IsNumber()
    @IsOptional()
    ratCodigo?: number; // V_RAT_CODIGO

    @IsString()
    @IsOptional()
    prpEmail?: string; // V_PRP_EMAIL

    @IsString()
    @IsOptional()
    prpAosCuidados?: string; // V_PRP_AOSCUIDADOS

    @IsString()
    @IsOptional()
    prpDepartamento?: string; // V_PRP_DEPARTAMENTO

    @IsNumber()
    prpVendedorInterno: number; // V_PRP_VENDEDORINTERNO

    @IsNumber()
    @IsOptional()
    prpVendedorExterno?: number; // V_PRP_VENDEDOREXTERNO

    @IsNumber()
    @IsOptional()
    prpVendedorOperacional?: number; // V_PRP_VENDEDOROPERACIONAL

    @IsDateString()
    @IsOptional()
    prpDataEmissao?: string; // V_PRP_DATAEMISSAO

    @IsDateString()
    @IsOptional()
    prpDataConfirmacao?: string; // V_PRP_DATACONFIRMACAO

    @IsDateString()
    @IsOptional()
    prpDataFaturamento?: string; // V_PRP_DATAFATURAMENTO

    @IsString()
    @IsOptional()
    prpObservacaoNota?: string; // V_PRP_OBSERVACAONOTA

    @IsNumber()
    @IsOptional()
    prpValidade?: number; // V_PRP_VALIDADE

    @IsDateString()
    @IsOptional()
    prpDataValidade?: string; // V_PRP_DATAVALIDADE

    @IsString()
    @IsOptional()
    prpEntrega?: string; // V_PRP_ENTREGA

    @IsDateString()
    @IsOptional()
    prpDataEntrega?: string; // V_PRP_DATAENTREGA

    @IsDateString()
    @IsOptional()
    prpShipDate?: string; // V_PRP_SHIPDATE

    @IsString()
    @IsOptional()
    prpPais?: string; // V_PRP_PAIS

    @IsString()
    @IsOptional()
    prpFob?: string; // V_PRP_FOB

    @IsString()
    @IsOptional()
    prpProject?: string; // V_PRP_PROJECT

    @IsString()
    @IsOptional()
    prpImpostos?: string; // V_PRP_IMPOSTOS

    @IsNumber()
    @IsOptional()
    prpValorFrete?: number; // V_PRP_VALORFRETE

    @IsEnum(['S', 'N'])
    @IsOptional()
    prpFretePago?: string; // V_PRP_FRETEPAGO

    @IsNumber()
    @IsOptional()
    prpValorTotal?: number; // V_PRP_VALORTOTAL

    @IsNumber()
    @IsOptional()
    prpValorTotalTabela?: number; // V_PRP_VALORTOTALTABELA

    @IsNumber()
    @IsOptional()
    prpValorTotalIpi?: number; // V_PRP_VALORTOTALIPI

    @IsNumber()
    @IsOptional()
    prpValorTotalDesconto?: number; // V_PRP_VALORTOTALDESCONTO

    @IsNumber()
    @IsOptional()
    prpOverDesconto?: number; // V_PRP_OVERDESCONTO

    @IsString()
    @IsOptional()
    prpFormaConfirma?: string; // V_PRP_FORMACONFIRMA

    @IsString()
    @IsOptional()
    prpTipoFaturamento?: string; // V_PRP_TIPOFATURAMENTO

    @IsString()
    @IsOptional()
    prpTipoEntrega?: string; // V_PRP_TIPOENTREGA

    @IsString()
    @IsOptional()
    prpNumeroPedidoCliente?: string; // V_PRP_NUMEROPEDIDOCLIENTE

    @IsNumber()
    @IsOptional()
    prpMediaMarkup?: number; // V_PRP_MEDIAMARKUP

    @IsNumber()
    @IsOptional()
    prpPropostaPai?: number; // V_PRP_PROPOSTAPAI

    @IsEnum(['S', 'N'])
    @IsOptional()
    prpControleCredito?: string; // V_PRP_CONTROLECREDITO

    @IsEnum(['S', 'N'])
    @IsOptional()
    prpIsoAceiteProposta?: string; // V_PRP_ISOACEITEPROPOSTA

    @IsEnum(['S', 'N'])
    @IsOptional()
    prpIsoAceitePedido?: string; // V_PRP_ISOACEITEPEDIDO

    @IsNumber()
    @IsOptional()
    tipo?: number; // V_TIPO

    @IsEnum(['S', 'N'])
    @IsOptional()
    commit?: string; // V_COMMIT

    @IsString()
    @IsOptional()
    controle?: string; // V_CONTROLE

    @IsNumber()
    @IsOptional()
    prpValorTotalIcmsSt?: number; // V_PRP_VALORTOTALICMSST

    @IsNumber()
    @IsOptional()
    prpTotalBaseCalculoIcmsSt?: number; // V_PRP_TOTALBASECALCICMSST

    @IsNumber()
    @IsOptional()
    prpBaseCalculoIcms?: number; // V_PRP_BASECALCULOICMS

    @IsNumber()
    @IsOptional()
    prpValorTotalIcms?: number; // V_PRP_VALORTOTALICMS

    @IsNumber()
    @IsOptional()
    prpComplementar?: number; // V_PRP_COMPLEMENTAR

    @IsNumber()
    @IsOptional()
    prpAbateCredito?: number; // V_PRP_ABATECRED

    @IsNumber()
    @IsOptional()
    prpValorCredito?: number; // V_PRP_VALORCREDITO

    @IsNumber()
    @IsOptional()
    prpTriangulacao?: number; // V_PRP_TRIANGULACAO

    @IsNumber()
    @IsOptional()
    prtCodigo?: number; // V_PRT_CODIGO

    @IsString()
    @IsOptional()
    prpTid?: string; // V_PRP_TID

    @IsNumber()
    @IsOptional()
    traPrazoEntrega?: number; // V_TRA_PRAZO_ENTREGA

    @IsNumber()
    @IsOptional()
    icmsDesonTotal?: number; // V_ICMSDESONTOTAL

    @IsNumber()
    @IsOptional()
    prpValorOutros?: number; // V_PRP_VALOROUTROS

    @IsNumber()
    @IsOptional()
    prpFinalidade?: number; // V_PRP_FINALIDADE

    @IsNumber()
    @IsOptional()
    natCodigo?: number; // V_NAT_CODIGO

    @IsNumber()
    @IsOptional()
    prpSeqPropostaVendaDireta?: number; // V_PRP_SEQPROPVENDIRETA
} 