import { Injectable, Logger } from '@nestjs/common';
import { CheckoutOracleRepository } from '../repositories/checkout.oracle.repository';
import { CreatePropostaDto } from '../dto/create.proposta.dto';
import { CreatePropostaProcedureDto } from '../dto/create-proposta-procedure.dto';
import { CreateHeaderPropostaDto } from '../dto/create.header.proposta.dto';
import { CreatePropostaItemDto } from '../dto/create.proposta.item.dto';
import { CalculateFeesDto, CalculateFeesResponseDto } from '../dto/calculate-fees.dto';
import { CalculateNatCodigoDto } from '../dto/calculate.nat.codigo';
import { CheckoutBkpOracleRepository } from '../repositories/checkout.bkp.oracle.repository';

@Injectable()
export class CheckoutOracleService {
    private readonly logger = new Logger(CheckoutOracleService.name);

    constructor(
        private readonly checkoutOracleRepository: CheckoutBkpOracleRepository,
    ) {}

    async createPropostaViaProcedure(createHeaderPropostaDto: CreateHeaderPropostaDto) {
        try {
            this.logger.log('Criando proposta via stored procedure Oracle');

            const operationNature = await this.calculateOperationNature({
                CLI_CODIGO: createHeaderPropostaDto.CLI_CODIGO,
                PRP_TRIANGULACAO: 2, //linkmarket
                PRP_FINALIDADE: 5 //Nesta finalidade somente CPF e CNPJ (com IE Isento) poderão estar habilitados.
            });

            if (!operationNature.NAT_CODIGO) {
                throw new Error('Não foi possível calcular a natureza de operação');
            }

            createHeaderPropostaDto.NAT_CODIGO = operationNature.NAT_CODIGO;

            const result = await this.checkoutOracleRepository.createHeaderProposta(createHeaderPropostaDto);

            this.logger.log('Proposta criada com sucesso via stored procedure!');
            return result;

        } catch (error) {
            this.logger.error(`Erro ao criar proposta via stored procedure: ${error.message}`, error.stack);
            throw error;
        }
    }

    async createProposta(createPropostaDto: CreatePropostaDto) {
        try {
            this.logger.log(`Criando proposta: ${createPropostaDto.prpCodigo}`);
            
            // Verifica se a proposta já existe
            const existingProposta = await this.getProposta(createPropostaDto.prpCodigo);
            if (existingProposta) {
                throw new Error(`Proposta com código ${createPropostaDto.prpCodigo} já existe`);
            }

            const result = await this.checkoutOracleRepository.createProposta(createPropostaDto);
            
            this.logger.log(`Proposta criada com sucesso: ${createPropostaDto.prpCodigo}`);
            return result;
        } catch (error) {
            this.logger.error(`Erro ao criar proposta: ${error.message}`, error.stack);
            throw error;
        }
    }

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

    async createPropostaItem(createPropostaItemDto: CreatePropostaItemDto) {
        //verificar se a proposta existe
        const propostaDto = await this.getProposta(createPropostaItemDto.PRP_CODIGO);

        //verificar disponibilidade do produto
        // const available = await this.checkoutOracleRepository.getAvaliableProduct();
        // if (!available) {
        //     throw new Error('Não conseguimos finalizar a compra, pois esse produto não está mais disponível');
        // }

        //calcular o preço e impostos
        const fees = await this.calculateFees({
            PRO_CODIGO: createPropostaItemDto.PRO_CODIGO,
            NAT_CODIGO: propostaDto.NAT_CODIGO,
            PRP_FINALIDADE: propostaDto.PRP_FINALIDADE,
            CLI_CODIGO: propostaDto.CLI_CODIGO,
            PRI_VALORTOTAL: createPropostaItemDto.PRI_VALORTOTAL,
            PRI_QUANTIDADE: createPropostaItemDto.PRI_QUANTIDADE
        });


        /*
            -- SQL_CODIGO 116: Valor produto
            -- Chama função :CLI_EMPRESA.FNC_IMPOSTOS_NFE para calcular

            Impostos calculados:
            VLR_PROD: Valor base do produto
            VLR_IPI: Valor do IPI
            VLR_ICMSST: Valor do ICMS ST + FCP
            VLR_ICMS: Valor do ICMS
            VLR_UNIT: Valor unitário final
        */ 

        //Verificar se o produto existe na proposta(futuro) e atualizar o item da proposta


        try {
            this.logger.log(`Criando item da proposta: ${createPropostaItemDto.PRP_CODIGO} - Sequência: ${createPropostaItemDto.PRI_SEQUENCIA}`);
            
            const result = await this.checkoutOracleRepository.createPropostaItem(createPropostaItemDto);
            
            this.logger.log(`Item da proposta criado com sucesso: ${createPropostaItemDto.PRP_CODIGO} - Sequência: ${createPropostaItemDto.PRI_SEQUENCIA}`);
            return result;
        } catch (error) {
            this.logger.error(`Erro ao criar item da proposta: ${error.message}`, error.stack);
            throw error;
        }
    }

    async calculateFees(calculateFeesDto: CalculateFeesDto) {
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

    async calculateOperationNature(calculateNatCodigoDto: CalculateNatCodigoDto) {
        try {
            this.logger.log(`Buscando natureza de operação: ${calculateNatCodigoDto.PRP_TRIANGULACAO}`);
            const result = await this.checkoutOracleRepository.calculateOperationNature(calculateNatCodigoDto);
            return result;
        } catch (error) {
            this.logger.error(`Erro ao buscar natureza de operação: ${error.message}`, error.stack);
            throw error;
        }
    }
} 