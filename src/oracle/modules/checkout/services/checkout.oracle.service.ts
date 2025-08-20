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

    async buscarProposta(prpCodigo: number) {
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

    async buscarTodasPropostas() {
        try {
            this.logger.log('Buscando todas as propostas');
            // Método simples para listar propostas (pode ser otimizado com paginação)
            const query = `SELECT * FROM PROPOSTA WHERE ORI_CODIGO = '20' ORDER BY PRP_INCLUIDATA DESC`;
            const result = await this.checkoutOracleRepository['oracleDataSource'].query(query);
            
            this.logger.log(`Encontradas ${result.length} propostas`);
            return result;
        } catch (error) {
            this.logger.error(`Erro ao buscar propostas: ${error.message}`, error.stack);
            throw error;
        }
    }

    async criarProposta(proposta: CreateCabecalhoPropostaDto & { PRP_CODIGO?: number }) {
        console.log('Dados recebidos na proposta:', proposta);

        this.logger.log(`Criando proposta: ${proposta}`);

        try {
            //criação de cabeçalho
            const prpCodigoGerado = await this.criarCabecalhoPropostaB2B(proposta);
            this.logger.log(`Código da proposta gerado: ${prpCodigoGerado}`);
            
            proposta.PRP_CODIGO = prpCodigoGerado;
            
            await this.adicionarProdutosProposta(proposta.PRODUTOS, proposta.PRP_CODIGO);

            const cabecalhoProposta = await this.checkoutOracleRepository.buscarCabecalhoProposta(proposta.CLI_CODIGO);
            cabecalhoProposta.PRP_CODIGO = proposta.PRP_CODIGO;
            console.log('cabecalhoProposta', cabecalhoProposta);

            await this.checkoutOracleRepository.confirmarProposta(cabecalhoProposta);

            return {
                prpCodigo: proposta.PRP_CODIGO,
                cabecalho: 'Criado com sucesso'
            };
        } catch (error) {
            this.logger.error(`Erro ao criar proposta: ${error.message}`, error.stack);
            throw error;
        }
    }

    async adicionarProdutosProposta(produtos: { PRO_CODIGO: number; IMPOSTOS?: any }[], prpCodigo: number) {
        // await this.verificarDisponibilidadeEstoque(produtos);
        const produtosComImpostos = await this.calcularTarifas2(produtos)

        console.log('produtosComImpostos', produtosComImpostos);

        let result = [];

        for (const produto of produtosComImpostos) {
            // let prp_item = await this.checkoutOracleRepository.verficarSeProdutoExisteNaProposta({ PRO_CODIGO: produto.PRO_CODIGO, PRP_CODIGO: prpCodigo });
            
            // if(prp_item.length > 0) {
            //     await this.checkoutOracleRepository.atualizarPropostaItem(produto);
            //     continue;
            // }

            // Formatar dados do produto para inserção
            const propostaItem = this.formatarDadosPropostaItem(produto, prpCodigo);
            console.log('propostaItem-->', propostaItem);
            
            try {
                const resultItem = await this.checkoutOracleRepository.criarPropostaItem(propostaItem);
                this.logger.log(`Item inserido com sucesso para produto ${produto.PRO_CODIGO}`);
                result.push(resultItem);
            } catch (error) {
                this.logger.error(`Erro ao inserir produto ${produto.PRO_CODIGO}: ${error.message}`);
                throw error;
            }
        }

        return result;
    }

    private formatarDadosPropostaItem(produto: any, prpCodigo: number) {
        const impostos = produto.IMPOSTOS || {};
        
        return {
            // Códigos de identificação
            PRP_CODIGO: prpCodigo,
            PRO_CODIGO: produto.PRO_CODIGO,
            
            // Dados do item (valores padrão se não fornecidos)
            PRI_QUANTIDADE: produto.PRI_QUANTIDADE || 1,
            PRI_UNIDADE: produto.PRI_UNIDADE || 'UN',
            PRI_DESCRICAO: produto.PRI_DESCRICAO || `Produto ${produto.PRO_CODIGO}`,
            PRI_DESCRICAOTECNICA: produto.PRI_DESCRICAOTECNICA || '',
            PRI_REFERENCIA: produto.PRI_REFERENCIA || '',
            
            // Valores de produto (usando impostos calculados)
            VLR_UNITARIO: impostos.VALOR_UNITARIO || produto.VLR_UNITARIO || 0,
            VLR_UNITARIOMAIOR: impostos.VALOR_UNITARIO || produto.VLR_UNITARIO || 0,
            VLR_COMIMP: impostos.VALOR_TOTAL || produto.VLR_COMIMP || produto.VLR_UNITARIO || 0,
            
            // Impostos - IPI
            P_IPI: impostos.PERCENTUAL_IPI || 0,
            VLR_IPI: impostos.VALOR_IPI || 0,
            
            // Impostos - ICMS
            VLR_ICMS: impostos.VALOR_ICMS || 0,
            BC_ICMS: impostos.VALOR_ICMS_BASE || 0,
            P_ICMS: impostos.PERCENTUAL_ICMS || 0,
            
            // Impostos - ICMS-ST
            VLR_ICMSST: impostos.VALOR_ICMSST || 0,
            BC_ICMSST: impostos.VALOR_ICMSST_BASE || 0,
            
            // Outros impostos e valores
            PRI_FCP: impostos.VALOR_FCPST || 0,
            PRI_VALORTOTALCIMP: impostos.VALOR_TOTAL || 0,
            PRI_VALOR_UNITARIO_FINAL: impostos.VALOR_UNITARIO || produto.VLR_UNITARIO || 0
        };
    }

    async calcularTarifas(calculateFeesDto: CalculateFeesDto) {
        try {
            this.logger.log(`Calculando tarifas para produto: ${calculateFeesDto.PRO_CODIGO}`);
            
            const result = await this.checkoutOracleRepository.calcularTarifas(calculateFeesDto);

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

    async calcularTarifas2(produtos: any) {
        for (const produto of produtos) {
            const imposto = await this.calcularTarifas({
                PRO_CODIGO: produto.PRO_CODIGO,
                NAT_CODIGO: 456,
                PRP_FINALIDADE: 5,
                CLI_CODIGO: 39413,
                PRI_VALORTOTAL: produto.PRI_VALORTOTAL,
                PRI_QUANTIDADE: produto.PRI_QUANTIDADE
            });

            produto.IMPOSTOS = imposto;
        }

        this.logger.log(`Calculando tarifas para produtos: ${produtos.map(produto => produto.PRO_CODIGO).join(', ')}`);
        return produtos;
    }

    async calcularNaturezaOperacao(calculateNatCodigoDto: CalculateNatCodigoDto) {
        try {
            this.logger.log(`Buscando natureza de operação: ${calculateNatCodigoDto.PRP_TRIANGULACAO}`);
            const result = await this.checkoutOracleRepository.calcularNaturezaOperacao(calculateNatCodigoDto);
            return result;
        } catch (error) {
            this.logger.error(`Erro ao buscar natureza de operação: ${error.message}`, error.stack);
            throw error;
        }
    }

    async criarCabecalhoPropostaB2B(createPropostaDto: CreateCabecalhoPropostaDto): Promise<number> {
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

        return this.checkoutOracleRepository.criarCabecalhoPropostaB2B(cabecalhoProposta);
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