import { IsNotEmpty, IsNumber, IsString, IsEmail } from 'class-validator';

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

    @IsNotEmpty({ message: 'CLI_EMAIL é obrigatório' })
    @IsEmail({}, { message: 'CLI_EMAIL deve ser um email válido' })
    CLI_EMAIL: string;

    @IsNotEmpty({ message: 'NAT_CODIGO é obrigatório' })
    @IsNumber({}, { message: 'NAT_CODIGO deve ser um número' })
    NAT_CODIGO: number;
}