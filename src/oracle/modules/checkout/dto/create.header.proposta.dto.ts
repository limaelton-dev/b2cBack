import { IsString, IsNumber } from 'class-validator';

export class CreateHeaderPropostaDto {
    @IsNumber()
    CLI_CODIGO: number; // V_CLI_CODIGO

    @IsNumber()
    TRA_CODIGO: number; // V_TRA_CODIGO

    @IsString()
    PRP_NOME: string; // V_PRP_NOME

    @IsString()
    PRP_ENDERECO: string; // V_PRP_ENDERECO

    @IsString()
    PRP_BAIRRO: string; // V_PRP_BAIRRO

    @IsString()
    PRP_CIDADE: string; // V_PRP_CIDADE

    @IsString()
    PRP_UF: string; // V_PRP_UF

    @IsString()
    PRP_CEP: string; // V_PRP_CEP

    @IsString()
    PRP_FONE: string; // V_PRP_FONE

    @IsString()
    PRP_EMAIL: string; // V_PRP_EMAIL

    @IsNumber()
    PRP_VALOR_FRETE: number; 

    @IsNumber()
    PRP_VALOR_TOTAL: number;

    @IsNumber()
    PRP_CODIGO: number;

    @IsNumber()
    NAT_CODIGO: number;

    @IsNumber()
    TRA_PRAZO_ENTREGA: number;
} 