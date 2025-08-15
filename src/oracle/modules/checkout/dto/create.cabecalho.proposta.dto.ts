import { IsNotEmpty, IsNumber, IsString, IsEmail, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProdutoPropostaDto {
    @IsNotEmpty({ message: 'PRO_CODIGO é obrigatório' })
    @IsNumber({}, { message: 'PRO_CODIGO deve ser um número' })
    PRO_CODIGO: number;

    @IsOptional()
    @IsNumber({}, { message: 'PRI_QUANTIDADE deve ser um número' })
    PRI_QUANTIDADE?: number;

    @IsOptional()
    @IsString({ message: 'PRI_UNIDADE deve ser uma string' })
    PRI_UNIDADE?: string;

    @IsOptional()
    @IsString({ message: 'PRI_DESCRICAO deve ser uma string' })
    PRI_DESCRICAO?: string;

    @IsOptional()
    @IsString({ message: 'PRI_DESCRICAOTECNICA deve ser uma string' })
    PRI_DESCRICAOTECNICA?: string;

    @IsOptional()
    @IsString({ message: 'PRI_REFERENCIA deve ser uma string' })
    PRI_REFERENCIA?: string;

    @IsOptional()
    @IsNumber({}, { message: 'PRI_VALORTOTAL deve ser um número' })
    PRI_VALORTOTAL?: number;

    @IsOptional()
    @IsNumber({}, { message: 'PRI_VALORUNITARIO deve ser um número' })
    PRI_VALORUNITARIO?: number;
}

export class CreateCabecalhoPropostaDto {
    @IsNotEmpty({ message: 'CLI_CODIGO é obrigatório' })
    @IsNumber({}, { message: 'CLI_CODIGO deve ser um número' })
    CLI_CODIGO: number;

    @IsNotEmpty({ message: 'CLI_NOME é obrigatório' })
    @IsString({ message: 'CLI_NOME deve ser uma string' })
    CLI_NOME: string;

    @IsNotEmpty({ message: 'CLI_ENDERECO é obrigatório' })
    @IsString({ message: 'CLI_ENDERECO deve ser uma string' })
    CLI_ENDERECO: string;

    @IsNotEmpty({ message: 'CLI_BAIRRO é obrigatório' })
    @IsString({ message: 'CLI_BAIRRO deve ser uma string' })
    CLI_BAIRRO: string;

    @IsNotEmpty({ message: 'CLI_CIDADE é obrigatório' })
    @IsString({ message: 'CLI_CIDADE deve ser uma string' })
    CLI_CIDADE: string;

    @IsNotEmpty({ message: 'CLI_UF é obrigatório' })
    @IsString({ message: 'CLI_UF deve ser uma string' })
    CLI_UF: string;

    @IsNotEmpty({ message: 'CLI_CEP é obrigatório' })
    @IsString({ message: 'CLI_CEP deve ser uma string' })
    CLI_CEP: string;

    @IsOptional()
    @IsString({ message: 'CLI_FONE deve ser uma string' })
    CLI_FONE?: string;

    @IsNotEmpty({ message: 'CLI_EMAIL é obrigatório' })
    @IsEmail({}, { message: 'CLI_EMAIL deve ser um email válido' })
    CLI_EMAIL: string;

    @IsNotEmpty({ message: 'NAT_CODIGO é obrigatório' })
    @IsNumber({}, { message: 'NAT_CODIGO deve ser um número' })
    NAT_CODIGO: number;

    @IsOptional()
    @IsArray({ message: 'PRODUTOS deve ser um array' })
    @ValidateNested({ each: true })
    @Type(() => ProdutoPropostaDto)
    PRODUTOS?: ProdutoPropostaDto[];

    @IsOptional()
    @IsNumber({}, { message: 'PRP_CODIGO deve ser um número' })
    PRP_CODIGO?: number;
}