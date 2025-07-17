import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import * as oracledb from 'oracledb';
import { CreatePropostaDto } from "../dto/create.proposta.dto";
import { CreatePropostaProcedureDto } from "../dto/create-proposta-procedure.dto";
import { CreateHeaderPropostaDto } from "../dto/create.header.proposta.dto";

@Injectable()
export class CheckoutOracleRepository {
    private readonly logger = new Logger(CheckoutOracleRepository.name);

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
            proposta.prpTriangulacao ?? 0
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
                V_PRP_TRIANGULACAO                 => 4,
                V_PRT_CODIGO                       => :prtCodigo, -- deve ser aparantemente 1
                V_PRP_TID                          => NULL,
                V_TRA_PRAZO_ENTREGA                => :prazoEntrega, --0
                V_ICMSDESONTOTAL                   => 0,
                V_PRP_VALOROUTROS                  => 0,
                V_PRP_FINALIDADE                   => 11,
                V_NAT_CODIGO                       => :natCodigo
            );

            :prpCodigoGerado := v_prp_codigo;
            END;
        `;

        const binds = {
            prpCodigoGerado:  { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            cliCodigo:        proposta.cliCodigo,
            prpNome:          proposta.prpNome,
            prpEndereco:      proposta.prpEndereco,
            prpBairro:        proposta.prpBairro,
            prpCidade:        proposta.prpCidade,
            prpUf:            proposta.prpUf,
            prpCep:           proposta.prpCep,
            prpFone:          proposta.prpFone,
            prpEmail:         proposta.prpEmail,
            valorFrete:       proposta.prpValorFrete,
            valorTotal:       proposta.prpValorTotal,
            prtCodigo:        proposta.prtCodigo,
            prazoEntrega:     proposta.traPrazoEntrega,
            natCodigo:        proposta.natCodigo
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
}