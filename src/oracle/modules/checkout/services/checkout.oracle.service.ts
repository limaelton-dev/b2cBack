import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CheckoutOracleRepository } from '../repositories/checkout.oracle.repository';
import { CreatePropostaDto } from '../dto/create.proposta.dto';
import { CreatePropostaProcedureDto } from '../dto/create-proposta-procedure.dto';
import { CreateHeaderPropostaDto } from '../dto/create.header.proposta.dto';
import { CreatePropostaItemDto } from '../dto/create.proposta.item.dto';
import { CalculateFeesDto, CalculateFeesResponseDto } from '../dto/calculate-fees.dto';
import { CalculateNatCodigoDto } from '../dto/calculate.nat.codigo';
import { CreateCabecalhoPropostaDto } from '../dto/create.cabecalho.proposta.dto';

@Injectable()
export class CheckoutOracleService {
    private readonly logger = new Logger(CheckoutOracleService.name);

    constructor(
        private readonly checkoutOracleRepository: CheckoutOracleRepository,
    ) {}

    async getProposta(prpCodigo: number) {
        try {
            this.logger.log(`Buscando proposta: ${prpCodigo}`);
            const result = await this.checkoutOracleRepository.getProposta(prpCodigo);

            const nlsSession = await this.checkoutOracleRepository.getNlsSession();
            this.logger.log(`NLS_SESSION_PARAMETERS: ${JSON.stringify(nlsSession)}`);
            
            if (!result || result.length === 0) {
                this.logger.warn(`Proposta não encontrada: ${prpCodigo}`);
                return null;
            }

            this.logger.log(`Proposta encontrada: ${prpCodigo}`);
            return result[0]; // Retorna apenas o primeiro resultado
        } catch (error) {
            this.logger.error(`Erro ao buscar proposta: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getAllPropostas() {
        try {
            this.logger.log('Buscando todas as propostas');
            // Método simples para listar propostas (pode ser otimizado com paginação)
            const query = 'SELECT * FROM PROPOSTA ORDER BY PRP_INCLUIDATA DESC';
            const result = await this.checkoutOracleRepository['oracleDataSource'].query(query);
            
            this.logger.log(`Encontradas ${result.length} propostas`);
            return result;
        } catch (error) {
            this.logger.error(`Erro ao buscar propostas: ${error.message}`, error.stack);
            throw error;
        }
    }

    async createProposta(proposta: CreateCabecalhoPropostaDto & { PRP_CODIGO?: number }) {
        this.logger.log(`Criando proposta: ${proposta.CLI_CODIGO}`);
        try {
            //criação de cabeçalho
            // const proposta.PRP_CODIGO = await this.criarCabecalhoProposta(proposta);
            //cli_codigo = 39413
            proposta.PRP_CODIGO = 555405;

            const produtos = [
                {
                    PRO_CODIGO: 25238
                },
                {
                    PRO_CODIGO: 25230
                },
                {
                    PRO_CODIGO: 48267 //deve existir na proposta
                }
            ];
            
            const resultItens = await this.adicionarProdutosProposta(produtos, proposta.PRP_CODIGO);

            return resultItens;
        } catch (error) {
            this.logger.error(`Erro ao criar proposta: ${error.message}`, error.stack);
            throw error;
        }
    }

    async adicionarProdutosProposta(produtos: { PRO_CODIGO: number; IMPOSTOS?: any }[], prpCodigo: number) {
        // await this.verificarDisponibilidadeEstoque(produtos);
        produtos = await this.calcularTarifas2(produtos);
        let result = [];

        for (const produto of produtos) {
            let prp_item = await this.checkoutOracleRepository.verficarSeProdutoExisteNaProposta({ PRO_CODIGO: produto.PRO_CODIGO, PRP_CODIGO: prpCodigo });
            
            if(prp_item.length > 0) {
                await this.checkoutOracleRepository.atualizarPropostaItem(produto);
                continue;
            }

            await this.checkoutOracleRepository.criarPropostaItem(produto);
        }

        return result;
    }

    async calcularTarifas(calculateFeesDto: CalculateFeesDto) {
        try {
            this.logger.log(`Calculando tarifas para produto: ${calculateFeesDto.PRO_CODIGO}`);
            
            const result = await this.checkoutOracleRepository.calculateFees(calculateFeesDto);

            const fees: CalculateFeesResponseDto = {
                VALOR_TOTAL: result.VLR_PROD,
                VALOR_DESCONTO: result.VLR_DESC,
                PERCENTUAL_IPI: result.P_IPI,
                VALOR_IPI: result.VLR_IPI,
                VALOR_ICMSST: result.VLR_ICMSST,
                VALOR_ICMSST_BASE: result.BC_ICMSST,
                VALOR_ICMS: result.VLR_ICMS,
                VALOR_ICMS_BASE: result.BC_ICMS,
                PERCENTUAL_ICMS: result.P_ICMS,
                VALOR_UNITARIO: result.VLR_UNIT,
                VALOR_FCPST: result.VLR_FCPST
            }
            
            this.logger.log(`Tarifas calculadas com sucesso para produto: ${calculateFeesDto.PRO_CODIGO}`);
            return fees;
        } catch (error) {
            this.logger.error(`Erro ao calcular tarifas: ${error.message}`, error.stack);
            throw error;
        }
    }

async calcularTarifas2(produtos: { PRO_CODIGO: number; IMPOSTOS?: any }[]) {
    for (const produto of produtos) {
        const imposto = await this.calcularTarifas({
            PRO_CODIGO: produto.PRO_CODIGO,
            NAT_CODIGO: 456,
            PRP_FINALIDADE: 5,
            CLI_CODIGO: 39413,
            PRI_VALORTOTAL: 100,
            PRI_QUANTIDADE: 3
        });

        produto.IMPOSTOS = imposto;
    }

    this.logger.log(`Calculando tarifas para produtos: ${produtos.map(produto => produto.PRO_CODIGO).join(', ')}`);
    return produtos;
}

    async calcularNaturezaOperacao(calculateNatCodigoDto: CalculateNatCodigoDto) {
        try {
            this.logger.log(`Buscando natureza de operação: ${calculateNatCodigoDto.PRP_TRIANGULACAO}`);
            const result = await this.checkoutOracleRepository.calculateOperationNature(calculateNatCodigoDto);
            return result;
        } catch (error) {
            this.logger.error(`Erro ao buscar natureza de operação: ${error.message}`, error.stack);
            throw error;
        }
    }

    async criarCabecalhoProposta(createPropostaDto: CreateCabecalhoPropostaDto) {
        const cabecalhoProposta: CreateCabecalhoPropostaDto = {
            CLI_CODIGO: createPropostaDto.CLI_CODIGO,
            CLI_NOME: createPropostaDto.CLI_NOME,
            CLI_ENDERECO: createPropostaDto.CLI_ENDERECO,
            CLI_BAIRRO: createPropostaDto.CLI_BAIRRO,
            CLI_CIDADE: createPropostaDto.CLI_CIDADE,
            CLI_UF: createPropostaDto.CLI_UF,
            CLI_CEP: createPropostaDto.CLI_CEP,
            CLI_EMAIL: createPropostaDto.CLI_EMAIL,
            NAT_CODIGO: createPropostaDto.NAT_CODIGO
        }
        return this.checkoutOracleRepository.createHeaderProposal(cabecalhoProposta);
    }

    async verificarDisponibilidadeEstoque(produtos: { PRO_CODIGO: number }[]) {
        this.logger.log(`Verificando disponibilidade de estoque para o produtos`);
        let avaliable = [];
        let unavaliable = [];
        try {
            for (const produto of produtos) {
                const result = await this.checkoutOracleRepository.verificarDisponibilidadeEstoque(produto);
                if(result) {
                    avaliable.push(produto.PRO_CODIGO);
                } else {
                    unavaliable.push(produto.PRO_CODIGO);
                }
            }

            //TODO:comparar com a quantidade por produto..
            return {
                avaliable: avaliable,
                unavaliable: unavaliable
            };
        } catch (error) {
            this.logger.error(`Erro ao verificar disponibilidade: ${error.message}`);
            return {
                errorText: 'deu pau',
                ERROR: error.message
            };
        }
    }
} 