import { IsString, IsNumber } from 'class-validator';

export class CreateHeaderPropostaDto {
    @IsNumber()
    cliCodigo: number; // V_CLI_CODIGO

    @IsNumber()
    traCodigo: number; // V_TRA_CODIGO

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
    prpFone: string; // V_PRP_FONE

    @IsString()
    prpEmail: string; // V_PRP_EMAIL

    @IsNumber()
    prpValorFrete: number; 

    @IsNumber()
    prpValorTotal: number;

    @IsNumber()
    prtCodigo: number;

    @IsNumber()
    natCodigo: number;

    @IsNumber()
    traPrazoEntrega: number;
} 