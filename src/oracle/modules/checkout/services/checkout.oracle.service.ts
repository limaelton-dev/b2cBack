import { Injectable, Logger } from '@nestjs/common';
import { CheckoutOracleRepository } from '../repositories/checkout.oracle.repository';
import { CreatePropostaDto } from '../dto/create.proposta.dto';
import { CreatePropostaProcedureDto } from '../dto/create-proposta-procedure.dto';
import { CreateHeaderPropostaDto } from '../dto/create.header.proposta.dto';

@Injectable()
export class CheckoutOracleService {
    private readonly logger = new Logger(CheckoutOracleService.name);

    constructor(
        private readonly checkoutOracleRepository: CheckoutOracleRepository,
    ) {}

    async createPropostaa(createPropostaaDto: CreatePropostaDto) {
        try {
            // this.logger.log(`Criando proposta: ${createPropostaaDto.prpCodigo}`);

            // Este método não está implementado ainda - precisa ser implementado
            // const result = await this.checkoutOracleRepository.createPropostaa(createPropostaaDto);

            this.logger.log('Proposta criada com sucesso!');
            return { message: 'Método createPropostaa não implementado ainda' };

        } catch (error) {
            this.logger.error(`Erro ao criar proposta: ${error.message}`, error.stack);
            throw error;
        }
    }

    async createPropostaViaProcedure(createHeaderPropostaDto: CreateHeaderPropostaDto) {
        try {
            this.logger.log('Criando proposta via stored procedure Oracle');

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
} 