import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import * as oracledb from 'oracledb';
import { CreatePropostaDto } from "../dto/create.proposta.dto";
import { CreateHeaderPropostaDto } from "../dto/create.header.proposta.dto";
import { CreatePropostaItemDto } from "../dto/create.proposta.item.dto";
import { CalculateFeesDto } from "../dto/calculate-fees.dto";
import { CalculateNatCodigoDto } from "../dto/calculate.nat.codigo";

@Injectable()
export class CheckoutBkpOracleRepository {
    private readonly logger = new Logger(CheckoutBkpOracleRepository.name);

    constructor(
        @InjectDataSource('oracle') private readonly oracleDataSource: DataSource,
    ) { }

    private logQueryWithParameters(query: string, parameters: any): void {
        let finalQuery = query;
      
        const formatValue = (val: any): string => {
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'string') 
            // escapa apóstrofos internos
            return `'${val.replace(/'/g, "''")}'`;
          if (val instanceof Date) {
            // converte para TO_DATE no formato Oracle
            const ts = val.toISOString().slice(0,19).replace('T',' ');
            return `TO_DATE('${ts}','YYYY-MM-DD HH24:MI:SS')`;
          }
          return String(val);
        };
      
        if (Array.isArray(parameters)) {
          // binds posicional :1, :2, …
          parameters.forEach((param, idx) => {
            const re = new RegExp(`:${idx+1}\\b`, 'g');
            finalQuery = finalQuery.replace(re, formatValue(param));
          });
        } else {
          // binds nomeados :cliCodigo, :prpNome, …
          Object.entries(parameters).forEach(([key, val]) => {
            const re = new RegExp(`:${key}\\b`, 'g');
            finalQuery = finalQuery.replace(re, formatValue(val));
          });
        }
      
        this.logger.log('=== QUERY COM PARÂMETROS ===');
        this.logger.log(finalQuery);
        this.logger.log('=============================');
    }

    async getNlsSession(): Promise<any> {
        const query = `SELECT * FROM NLS_SESSION_PARAMETERS`;
        return await this.oracleDataSource.query(query);
    }

    async getProposta(prpCodigo: number): Promise<any> {
        const query = `SELECT * FROM PROPOSTA WHERE PRP_CODIGO = :1`;
        const parameters = [prpCodigo];

        this.logQueryWithParameters(query, parameters);
        return await this.oracleDataSource.query(query, parameters);
    }

    /*
    * @param TRA_CODIGO:
    * 153 = CORREIOS - PAC
    * 5 = CORREIOS - SEDEX
    */
    async createProposta(proposta: CreatePropostaDto): Promise<any> {
        const query = `
            INSERT INTO PROPOSTA 
            (
                PRP_CODIGO, -- Codigo da proposta 
                RAT_CODIGO, -- Código do estoque de rateio(sempre 2)
                CLI_CODIGO, -- Código do cliente NN
                ORI_CODIGO, -- Codigo da origem
                TRA_CODIGO, -- Codigo da transportadora
                CPG_CODIGO, -- Codigo do pagamento CONDICAO_PAGAMENTO NN
                PTP_CODIGO, -- Proposta tipo NN
                PRP_SITUACAO, -- Situação da proposta('CA', 'FT', 'OK', 'PE', 'PK', 'PN', 'PR') NN
                PRP_NOME, -- Nome da cliente(B2C ou nome do cliente) VARCHAR(60)
                PRP_ENDERECO, -- Endereço da cliente(RUA + NUMERO + COMPLEMENTO) VARCHAR(80)
                PRP_BAIRRO, -- Bairro da cliente VARCHAR(60)
                PRP_CIDADE, -- Cidade da cliente VARCHAR(30)
                PRP_UF, -- Estado da cliente VARCHAR(2)
                PRP_CEP, -- CEP da cliente VARCHAR(8)
                PRP_FONE, -- Telefone da cliente VARCHAR(20)
                PRP_EMAIL, -- Email da cliente VARCHAR(70)
                PRP_VENDEDORINTERNO, -- Código Vendedor interno NN NUMBER(6,0)
                PRP_VENDEDOREXTERNO, -- Código Vendedor externo NN NUMBER(6,0)
                PRP_DATAEMISSAO, -- Data de emissão da proposta NN DATE
                PRP_OBSERVACAONOTA, -- Observação da nota fiscal VARCHAR(200)
                PRP_DATAENTREGA, -- Data de entrega DATE
                PRP_VALORFRETE, -- Valor do frete NUMBER(14,2)
                PRP_FRETEPAGO, -- Frete pago('S' ou 'N') NN VARCHAR(1)
                PRP_VALORTOTAL, -- Valor total da proposta NUMBER(14,2)
                PRP_VALORTOTALDESCONTO, -- Valor total do desconto NUMBER(14,2)
                PRP_FORMACONFIRMA, -- Forma de confirmacao da proposta V, F, E ou O verbalmente, por fax, email ou outras. VARCHAR(1)
                PRP_TIPOFATURAMENTO, -- Tipo de faturamento da proposta vale, fatura, a definir V, F, D VARCHAR(1)
                PRP_TIPOENTREGA, -- Tipo de entrega da proposta E ou R entrega ou retira VARCHAR(1)
                PRP_SHIPDATE, -- Data de envio da proposta DATE
                PRP_INCLUIDATA, -- Data da inclusão da proposta NN DATE
                PRP_INCLUIPOR, -- Nome do usuário que incluiu a proposta B2C VARCHAR(40)
                PRP_ALTERADATA, -- Data da última alteração da proposta NN DATE
                PRP_ALTERAPOR, -- Nome do usuário que alterou a proposta B2C VARCHAR(40)
                PRP_TRIANGULACAO -- Triangulação: 0-Não; 1) Strategy B2B; 2) Licitações LMF; 3) Strategy B2C; 4) B2C-LMF. DEFAULT 0 NN NUMBER(1,0)
            ) VALUES (
                :prpCodigo,
                :ratCodigo,
                :cliCodigo,
                :oriCodigo,
                :traCodigo,
                :cpgCodigo,
                :ptpCodigo,
                :prpSituacao,
                :prpNome,
                :prpEndereco,
                :prpBairro,
                :prpCidade,
                :prpUf,
                :prpCep,
                :prpFone,
                :prpEmail,
                :prpVendedorInterno,
                :prpVendedorExterno,
                :prpDataEmissao,
                :prpObservacaoNota,
                :prpDataEntrega,
                :prpValorFrete,
                :prpFretePago,
                :prpValorTotal,
                :prpValorTotalDesconto,
                :prpFormaConfirmacao,
                :prpTipoFaturamento,
                :prpTipoEntrega,
                :prpShipDate,
                :prpIncluidaData,
                :prpIncluidoPor,
                :prpAlteradaData,
                :prpAlteradaPor,
                :prpTriangulacao
            )
        `;

        const parameters = [
            proposta.prpCodigo,
            proposta.ratCodigo,
            proposta.cliCodigo,
            proposta.oriCodigo,
            proposta.traCodigo,
            proposta.cpgCodigo,
            proposta.ptpCodigo,
            proposta.prpSituacao,
            proposta.prpNome,
            proposta.prpEndereco,
            proposta.prpBairro,
            proposta.prpCidade,
            proposta.prpUf,
            proposta.prpCep,
            proposta.prpFone,
            proposta.prpEmail,
            proposta.prpVendedorInterno,
            proposta.prpVendedorExterno,
            new Date(proposta.prpDataEmissao),
            proposta.prpObservacaoNota,
            new Date(proposta.prpDataEntrega),
            proposta.prpValorFrete,
            proposta.prpFretePago,
            proposta.prpValorTotal,
            proposta.prpValorTotalDesconto,
            proposta.prpFormaConfirmacao,
            proposta.prpTipoFaturamento,
            proposta.prpTipoEntrega,
            new Date(proposta.prpShipDate),
            new Date(proposta.prpIncluidaData),
            proposta.prpIncluidoPor,
            new Date(proposta.prpAlteradaData),
            proposta.prpAlteradaPor,
            proposta.prpTriangulacao ?? 2 //2 linkmarket
        ];

        try {
            this.logQueryWithParameters(query, parameters);
            const result = await this.oracleDataSource.query(query, parameters);
            return {
                success: true,
                message: 'Proposta criada com sucesso',
                data: result
            };
        } catch (error) {
            throw new Error(`Erro ao criar proposta: ${error.message}`);
        }
    }

    /*
    * @param TRA_CODIGO:
    * 153 = CORREIOS - PAC
    * 5 = CORREIOS - SEDEX
    */
    async createHeaderProposta(proposta: CreateHeaderPropostaDto): Promise<number> {
        const sql = `
            DECLARE
                v_prp_codigo   PROPOSTA.PRP_CODIGO%TYPE;
            BEGIN
            -- gera o código da nova proposta
            SELECT SQN_PROPOSTA.NEXTVAL
                INTO v_prp_codigo
            FROM DUAL;

            PCK_PROPOSTA.PRC_GRAVA_PROPOSTA(
                V_PRP_CODIGO                       => v_prp_codigo,       -- OUT: código gerado
                V_CLI_CODIGO                       => :cliCodigo,         -- cliente
                V_ORI_CODIGO                       => 20,                 -- origem 20 = B2C
                V_TRA_CODIGO                       => 3,                  -- 3 CORREIOS PAC 
                V_CPG_CODIGO                       => 1,                  -- condição de pagamento, USANDO 1 POR ENQUANTO
                V_END_CODIGO                       => NULL,               -- endereço de entrega(TABELA VAZIA)
                V_PTP_CODIGO                       => 1,                  -- tipo de proposta
                V_PRP_SITUACAO                     => 'OK',               -- situação - ('CA', 'FT', 'OK', 'PE', 'PK', 'PN', 'PR')
                V_PRP_NOME                         => :prpNome,           -- nome(deve ser exatamente igual a CLI_NOME)
                V_PRP_ENDERECO                     => :prpEndereco,       -- rua x, 150
                V_PRP_BAIRRO                       => :prpBairro,
                V_PRP_CIDADE                       => :prpCidade,
                V_PRP_UF                           => :prpUf,
                V_PRP_CEP                          => :prpCep, 
                V_PRP_FONE                         => :prpFone,
                V_PRP_FAX                          => NULL,
                V_RAT_CODIGO                       => 2,
                V_PRP_EMAIL                        => :prpEmail,
                V_PRP_AOSCUIDADOS                  => NULL,
                V_PRP_DEPARTAMENTO                 => NULL,
                V_PRP_VENDEDORINTERNO              => 3,
                V_PRP_VENDEDOREXTERNO              => 3,
                V_PRP_VENDEDOROPERACIONAL          => 3,
                V_PRP_DATAEMISSAO                  => SYSDATE,
                V_PRP_DATACONFIRMACAO              => SYSDATE,
                V_PRP_DATAFATURAMENTO              => NULL,
                V_PRP_OBSERVACAONOTA               => NULL,
                V_PRP_VALIDADE                     => NULL,
                V_PRP_DATAVALIDADE                 => NULL,
                V_PRP_ENTREGA                      => NULL,
                V_PRP_DATAENTREGA                  => NULL,
                V_PRP_SHIPDATE                     => NULL,
                V_PRP_PAIS                         => NULL,
                V_PRP_FOB                          => NULL,
                V_PRP_PROJECT                      => NULL,
                V_PRP_IMPOSTOS                     => NULL,
                V_PRP_VALORFRETE                   => :valorFrete,
                V_PRP_FRETEPAGO                    => 'S',
                V_PRP_VALORTOTAL                   => :valorTotal,
                V_PRP_VALORTOTALTABELA             => NULL,
                V_PRP_VALORTOTALIPI                => 0,
                V_PRP_VALORTOTALDESCONTO           => NULL, --Talvez colocar desconto aqui
                V_PRP_OVERDESCONTO                 => NULL,
                V_PRP_FORMACONFIRMA                => 'V',
                V_PRP_TIPOFATURAMENTO              => 'F',
                V_PRP_TIPOENTREGA                  => 'E',
                V_PRP_NUMEROPEDIDOCLIENTE          => NULL,
                V_PRP_MEDIAMARKUP                  => NULL,
                V_PRP_PROPOSTAPAI                  => NULL,
                V_PRP_CONTROLECREDITO              => NULL,
                V_PRP_USUARIO                      => 'B2C',
                V_PRP_ISOACEITEPROPOSTA            => NULL,
                V_PRP_ISOACEITEPEDIDO              => NULL,
                V_TIPO                             => 1,
                V_COMMIT                           => 'S',
                V_CONTROLE                         => 0,
                V_PRP_VALORTOTALICMSST             => 0,
                V_PRP_TOTALBASECALCICMSST          => 0,
                V_PRP_BASECALCULOICMS              => 0,
                V_PRP_VALORTOTALICMS               => 0,
                V_PRP_COMPLEMENTAR                 => 0,
                V_PRP_ABATECRED                    => 'N',
                V_PRP_VALORCREDITO                 => 0,
                V_PRP_TRIANGULACAO                 => 2, --2 linkmarket
                V_PRT_CODIGO                       => :prtCodigo, -- deve ser aparantemente 1
                V_PRP_TID                          => NULL,
                V_TRA_PRAZO_ENTREGA                => :prazoEntrega, --0
                V_ICMSDESONTOTAL                   => 0,
                V_PRP_VALOROUTROS                  => 0,
                V_PRP_FINALIDADE                   => 5,
                V_NAT_CODIGO                       => :natCodigo
            );

            :prpCodigoGerado := v_prp_codigo;
            END;
        `;

        const binds = {
            prpCodigoGerado:  { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            cliCodigo:        proposta.CLI_CODIGO,
            prpNome:          proposta.PRP_NOME,
            prpEndereco:      proposta.PRP_ENDERECO,
            prpBairro:        proposta.PRP_BAIRRO,
            prpCidade:        proposta.PRP_CIDADE,
            prpUf:            proposta.PRP_UF,
            prpCep:           proposta.PRP_CEP,
            prpFone:          proposta.PRP_FONE,
            prpEmail:         proposta.PRP_EMAIL,
            valorFrete:       proposta.PRP_VALOR_FRETE,
            valorTotal:       proposta.PRP_VALOR_TOTAL,
            prtCodigo:        proposta.PRP_CODIGO,
            prazoEntrega:     proposta.TRA_PRAZO_ENTREGA,
            natCodigo:        proposta.NAT_CODIGO
          };

        try {
            this.logQueryWithParameters(sql, binds);

            const result = await this.oracleDataSource.query(sql, binds as any);

            
            // O código gerado será retornado no bind de output
            const prpCodigoGerado = result.outBinds?.prpCodigoGerado || result[result.length - 1];
            
            this.logger.log(`Proposta criada com sucesso. Código gerado: ${prpCodigoGerado}`);
            return prpCodigoGerado;
        } catch (error) {
            this.logger.error(`Erro ao criar proposta via procedure: ${error.message}`);
            throw new Error(`Erro ao criar proposta via procedure: ${error.message}`);
        }
    }

    async createPropostaItem(propostaItem: CreatePropostaItemDto): Promise<any> {
        const sql = `
            BEGIN 
                PCK_PROPOSTA.PRC_GRAVA_PROPOSTA_ITEM(
                    V_PRP_CODIGO               => :prpCodigo,
                    V_PRI_SEQUENCIA            => :priSequencia,
                    V_PRO_CODIGO               => :proCodigo,
                    V_PRI_TABELAVENDA          => :priTabelaVenda,
                    V_PRI_QUANTIDADE           => :priQuantidade,
                    V_PRI_UNIDADE              => :priUnidade,
                    V_PRI_DESCRICAO            => :priDescricao,
                    V_PRI_DESCRICAOTECNICA     => :priDescricaoTecnica,
                    V_PRI_REFERENCIA           => :priReferencia,
                    V_PRI_DESCONTO             => :priDesconto,
                    V_PRI_VALORDESCONTO        => :priValorDesconto,
                    V_PRI_VALORUNITARIO        => :priValorUnitario,
                    V_PRI_VALORUNITARIOTABELA  => :priValorUnitarioTabela,
                    V_PRI_VALORUNITARIOMAIOR   => :priValorUnitarioMaior,
                    V_PRI_IPI                  => :priIpi,
                    V_PRI_VALORIPI             => :priValorIpi,
                    V_PRI_VALORTOTAL           => :priValorTotal,
                    V_PRI_ENTREGA              => :priEntrega,
                    V_PRI_DATAENTREGA          => :priDataEntrega,
                    V_PRI_CODIGOPEDIDOCLIENTE  => :priCodigoPedidoCliente,
                    V_PRI_CODIGOPRODUTOCLIENTE => :priCodigoProdutoCliente,
                    V_PRI_CUSTO                => :priCusto,
                    V_PRI_CUSTOMEDIO           => :priCustoMedio,
                    V_PRI_CUSTOMARKUP          => :priCustoMarkup,
                    V_PRI_VALORULTIMACOMPRA    => :priValorUltimaCompra,
                    V_PRI_PERCENTUALMARKUP     => :priPercentualMarkup,
                    V_PRI_TIPOIMPRESSAO        => :priTipoImpressao,
                    V_PRI_MALA                 => :priMala,
                    V_PRI_TIPOMALA             => :priTipoMala,
                    V_PRI_FLAGVALE             => :priFlagVale,
                    V_PRI_USUARIO              => :priUsuario,
                    V_TIPO                     => :tipo,
                    V_COMMIT                   => :commit,
                    V_PRI_VALORICMSST          => :priValorIcmsSt,
                    V_PRI_BASECALCULOICMSST    => :priBaseCalculoIcmsSt,
                    V_PRI_BASECALCULOICMS      => :priBaseCalculoIcms,
                    V_PRI_VALORICMS            => :priValorIcms,
                    V_PRI_ICMSVENDA            => :priIcmsVenda,
                    V_PRI_TIPOFISCAL           => :priTipoFiscal,
                    V_PRI_DESCONTOESPECIAL     => :priDescontoEspecial,
                    V_PRI_VALORDESCESP         => :priValorDescEsp,
                    V_PRI_TIPODESC             => :priTipoDesc,
                    V_PRP_TRIANGULACAO         => :prpTriangulacao,
                    V_PRI_TIPOVPC              => :priTipoVpc,
                    V_PRI_VALORCREDVPC         => :priValorCredVpc,
                    V_PRI_PERDESCIN            => :priPerDescIn,
                    V_PRI_VLRDESCIN            => :priVlrDescIn,
                    V_PRI_ICMSDESON            => :priIcmsDesOn,
                    V_PRI_VALORFRETE           => :priValorFrete,
                    V_PRI_VALOROUTRO           => :priValorOutro,
                    V_PRI_VALOR_UNITARIO_FINAL => :priValorUnitarioFinal,
                    V_PRI_VALORSEMDIFAL        => :priValorSemDifal
                );
            END;
        `;

        const binds = {
            prpCodigo: propostaItem.PRP_CODIGO,
            priSequencia: propostaItem.PRI_SEQUENCIA,
            proCodigo: propostaItem.PRO_CODIGO,
            priTabelaVenda: propostaItem.PRI_TABELAVENDA,
            priQuantidade: propostaItem.PRI_QUANTIDADE,
            priUnidade: propostaItem.PRI_UNIDADE,
            priDescricao: propostaItem.PRI_DESCRICAO,
            priDescricaoTecnica: propostaItem.PRI_DESCRICAOTECNICA,
            priReferencia: propostaItem.PRI_REFERENCIA,
            priDesconto: propostaItem.PRI_DESCONTO,
            priValorDesconto: propostaItem.PRI_VALORDESCONTO,
            priValorUnitario: propostaItem.PRI_VALORUNITARIO,
            priValorUnitarioTabela: propostaItem.PRI_VALORUNITARIOTABELA,
            priValorUnitarioMaior: propostaItem.PRI_VALORUNITARIOMAIOR,
            priIpi: propostaItem.PRI_IPI,
            priValorIpi: propostaItem.PRI_VALORIPI,
            priValorTotal: propostaItem.PRI_VALORTOTAL,
            priEntrega: propostaItem.PRI_ENTREGA,
            priDataEntrega: propostaItem.PRI_DATAENTREGA,
            priCodigoPedidoCliente: propostaItem.PRI_CODIGOPEDIDOCLIENTE,
            priCodigoProdutoCliente: propostaItem.PRI_CODIGOPRODUTOCLIENTE,
            priCusto: propostaItem.PRI_CUSTO,
            priCustoMedio: propostaItem.PRI_CUSTOMEDIO,
            priCustoMarkup: propostaItem.PRI_CUSTOMARKUP,
            priValorUltimaCompra: propostaItem.PRI_VALORULTIMACOMPRA,
            priPercentualMarkup: propostaItem.PRI_PERCENTUALMARKUP,
            priTipoImpressao: propostaItem.PRI_TIPOIMPRESSAO,
            priMala: propostaItem.PRI_MALA,
            priTipoMala: propostaItem.PRI_TIPOMALA,
            priFlagVale: propostaItem.PRI_FLAGVALE,
            priUsuario: propostaItem.PRI_USUARIO,
            tipo: propostaItem.TIPO,
            commit: propostaItem.COMMIT,
            priValorIcmsSt: propostaItem.PRI_VALORICMSST,
            priBaseCalculoIcmsSt: propostaItem.PRI_BASECALCULOICMSST,
            priBaseCalculoIcms: propostaItem.PRI_BASECALCULOICMS,
            priValorIcms: propostaItem.PRI_VALORICMS,
            priIcmsVenda: propostaItem.PRI_ICMSVENDA,
            priTipoFiscal: propostaItem.PRI_TIPOFISCAL,
            priDescontoEspecial: propostaItem.PRI_DESCONTOESPECIAL,
            priValorDescEsp: propostaItem.PRI_VALORDESCESP,
            priTipoDesc: propostaItem.PRI_TIPODESC,
            prpTriangulacao: propostaItem.PRP_TRIANGULACAO,
            priTipoVpc: propostaItem.PRI_TIPOVPC,
            priValorCredVpc: propostaItem.PRI_VALORCREDVPC,
            priPerDescIn: propostaItem.PRI_PERDESCIN || 0,
            priVlrDescIn: propostaItem.PRI_VLRDESCIN || 0,
            priIcmsDesOn: propostaItem.PRI_ICMSDESON || 0,
            priValorFrete: propostaItem.PRI_VALORFRETE || 0,
            priValorOutro: propostaItem.PRI_VALOROUTRO || 0,
            priValorUnitarioFinal: propostaItem.PRI_VALOR_UNITARIO_FINAL || 0,
            priValorSemDifal: propostaItem.PRI_VALORSEMDIFAL || 0
        }

        this.logQueryWithParameters(sql, binds);

        try {
            const result = await this.oracleDataSource.query(sql, binds as any);
            return result;
        } catch (error) {
            throw new Error(`Erro ao criar item da proposta: ${error.message}`);
        }
    }

    async calculateFees(calculateFeesDto: CalculateFeesDto): Promise<any> {
        const sql = `SELECT
            ROUND(VLR_PROD, 2) VLR_PROD,
            ROUND(VLR_DESC, 2) VLR_DESC,
            ROUND(P_IPI, 2) P_IPI,
            ROUND(VLR_IPI, 2) VLR_IPI,
            ROUND(VLR_ICMSST, 2)VLR_ICMSST,
            ROUND(BC_ICMSST, 2) BC_ICMSST,
            ROUND(VLR_ICMS, 2) VLR_ICMS,
            ROUND(BC_ICMS, 2) BC_ICMS,
            ROUND(P_ICMS, 2) P_ICMS, 
            ROUND(VLR_UNIT, 2) VLR_UNIT,
            ROUND(VLR_FCPST, 2) VLR_FCPST
            FROM
            TABLE (
                ORACLC.FNC_IMPOSTOS_NFE(
                :PRO_CODIGO,
                :NAT_CODIGO,
                :PRP_FINALIDADE,
                :CLI_CODIGO,
                :PRI_VALORTOTAL,
                :PRI_QUANTIDADE,
                0
                )
            )
        `;

        const binds = {
            PRO_CODIGO: calculateFeesDto.PRO_CODIGO,
            NAT_CODIGO: calculateFeesDto.NAT_CODIGO,
            PRP_FINALIDADE: calculateFeesDto.PRP_FINALIDADE,
            CLI_CODIGO: calculateFeesDto.CLI_CODIGO,
            PRI_VALORTOTAL: calculateFeesDto.PRI_VALORTOTAL,
            PRI_QUANTIDADE: calculateFeesDto.PRI_QUANTIDADE
        };

        this.logQueryWithParameters(sql, binds);

        try {
            const result = await this.oracleDataSource.query(sql, binds as any);
            
            // Retorna o primeiro resultado da função de impostos
            return result[0] || null;
        } catch (error) {
            throw new Error(`Erro ao calcular tarifas: ${error.message}`);
        }
    }

    async calculateOperationNature(operationNature: CalculateNatCodigoDto): Promise<any> {
        const sql = `
            SELECT ORACLC.FNC_BUSCA_NATUREZA_OPERACAO(
                    :CLI_CODIGO, 
                    :PRP_TRIANGULACAO, 
                    :PRP_FINALIDADE
                ) AS NAT_CODIGO 
            FROM DUAL
        `;
        const binds = { 
            CLI_CODIGO: operationNature.CLI_CODIGO,
            PRP_TRIANGULACAO: operationNature.PRP_TRIANGULACAO,
            PRP_FINALIDADE: operationNature.PRP_FINALIDADE
        };

        this.logQueryWithParameters(sql, binds);

        const result = await this.oracleDataSource.query(sql, binds as any);
        const response = {
            NAT_CODIGO: result[0]?.NAT_CODIGO ?? null
        }

        return response;
    }
}