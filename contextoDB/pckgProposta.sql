CREATE OR REPLACE PACKAGE BODY ORACLC.PCK_PROPOSTA IS
  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PACKAGE BODY PROPOSTA
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 30/01/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PRC_COPIA_CABECALHO (DIVISAO AUTOMATICA DE PROPOSTA)
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 30/01/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_COPIA_CABECALHO(V_PROPOSTA    IN OUT PROPOSTA.PRP_CODIGO %TYPE,
                                V_PROPOSTAPAI IN PROPOSTA.PRP_CODIGO %TYPE) IS
    CURSOR CUR_PROPOSTA IS
      SELECT * FROM PROPOSTA WHERE PRP_CODIGO = V_PROPOSTA;
    CURSOR CUR_OBSERVACAO IS
      SELECT * FROM PROPOSTA_MEMO WHERE PRP_CODIGO = V_PROPOSTA;
    REC_OBSERVACAO    CUR_OBSERVACAO%ROWTYPE;
    REC_PROPOSTA      CUR_PROPOSTA%ROWTYPE;
    V_PROXIMAPROPOSTA INTEGER;
    E_SEQUENCIA_NAO_ENCONTRADA EXCEPTION;
  BEGIN
    SELECT SQN_PROPOSTA.NEXTVAL -- ATRIBUI NOVO NUMERO DE PROPOSTA A VARIAVEL
      INTO V_PROXIMAPROPOSTA
      FROM DUAL;

    IF SQL%NOTFOUND THEN
      RAISE E_SEQUENCIA_NAO_ENCONTRADA;
    END IF;
    /*****************************************************************
    GERA NOVA PROPOSTA COM A DIVIS?O
    ******************************************************************/
    FOR REC_PROPOSTA IN CUR_PROPOSTA LOOP
      INSERT INTO PROPOSTA
        (PRP_CODIGO,
         RAT_CODIGO,
         CLI_CODIGO,
         ORI_CODIGO,
         TRA_CODIGO,
         CPG_CODIGO,
         END_CODIGO,
         PTP_CODIGO,
         PRP_SITUACAO,
         PRP_NOME,
         PRP_ENDERECO,
         PRP_BAIRRO,
         PRP_CIDADE,
         PRP_UF,
         PRP_CEP,
         PRP_FONE,
         PRP_FAX,
         PRP_EMAIL,
         PRP_AOSCUIDADOS,
         PRP_DEPARTAMENTO,
         PRP_VENDEDORINTERNO,
         PRP_VENDEDOREXTERNO,
         PRP_VENDEDOROPERACIONAL,
         PRP_DATAEMISSAO,
         PRP_DATACONFIRMACAO,
         PRP_DATAFATURAMENTO,
         PRP_OBSERVACAONOTA,
         PRP_VALIDADE,
         PRP_DATAVALIDADE,
         PRP_ENTREGA,
         PRP_DATAENTREGA,
         PRP_IMPOSTOS,
         PRP_VALORFRETE,
         PRP_FRETEPAGO,
         PRP_VALORTOTAL,
         PRP_VALORTOTALTABELA,
         PRP_VALORTOTALIPI,
         PRP_VALORTOTALDESCONTO,
         PRP_OVERDESCONTO,
         PRP_FORMACONFIRMA,
         PRP_TIPOFATURAMENTO,
         PRP_TIPOENTREGA,
         PRP_NUMEROPEDIDOCLIENTE,
         PRP_PROPOSTAPAI,
         PRP_CONTROLECREDITO,
         PRP_ISOACEITEPROPOSTA,
         PRP_ISOACEITEPEDIDO,
         PRP_TIPOCONFIRMACAO,
         PRP_INCLUIDATA,
         PRP_INCLUIPOR,
         PRP_ALTERADATA,
         PRP_ALTERAPOR,
         PRP_CONTROLAPRN)
      VALUES
        (V_PROXIMAPROPOSTA,
         REC_PROPOSTA.RAT_CODIGO,
         REC_PROPOSTA.CLI_CODIGO,
         REC_PROPOSTA.ORI_CODIGO,
         REC_PROPOSTA.TRA_CODIGO,
         REC_PROPOSTA.CPG_CODIGO,
         REC_PROPOSTA.END_CODIGO,
         REC_PROPOSTA.PTP_CODIGO,
         REC_PROPOSTA.PRP_SITUACAO,
         REC_PROPOSTA.PRP_NOME,
         REC_PROPOSTA.PRP_ENDERECO,
         REC_PROPOSTA.PRP_BAIRRO,
         REC_PROPOSTA.PRP_CIDADE,
         REC_PROPOSTA.PRP_UF,
         REC_PROPOSTA.PRP_CEP,
         REC_PROPOSTA.PRP_FONE,
         REC_PROPOSTA.PRP_FAX,
         REC_PROPOSTA.PRP_EMAIL,
         REC_PROPOSTA.PRP_AOSCUIDADOS,
         REC_PROPOSTA.PRP_DEPARTAMENTO,
         REC_PROPOSTA.PRP_VENDEDORINTERNO,
         REC_PROPOSTA.PRP_VENDEDOREXTERNO,
         REC_PROPOSTA.PRP_VENDEDOROPERACIONAL,
         REC_PROPOSTA.PRP_DATAEMISSAO,
         REC_PROPOSTA.PRP_DATACONFIRMACAO,
         REC_PROPOSTA.PRP_DATAFATURAMENTO,
         REC_PROPOSTA.PRP_OBSERVACAONOTA,
         REC_PROPOSTA.PRP_VALIDADE,
         REC_PROPOSTA.PRP_DATAVALIDADE,
         REC_PROPOSTA.PRP_ENTREGA,
         REC_PROPOSTA.PRP_DATAENTREGA,
         REC_PROPOSTA.PRP_IMPOSTOS,
         REC_PROPOSTA.PRP_VALORFRETE,
         REC_PROPOSTA.PRP_FRETEPAGO,
         REC_PROPOSTA.PRP_VALORTOTAL,
         REC_PROPOSTA.PRP_VALORTOTALTABELA,
         REC_PROPOSTA.PRP_VALORTOTALIPI,
         REC_PROPOSTA.PRP_VALORTOTALDESCONTO,
         REC_PROPOSTA.PRP_OVERDESCONTO,
         REC_PROPOSTA.PRP_FORMACONFIRMA,
         REC_PROPOSTA.PRP_TIPOFATURAMENTO,
         REC_PROPOSTA.PRP_TIPOENTREGA,
         REC_PROPOSTA.PRP_NUMEROPEDIDOCLIENTE,
         V_PROPOSTAPAI,
         REC_PROPOSTA.PRP_CONTROLECREDITO,
         REC_PROPOSTA.PRP_ISOACEITEPROPOSTA,
         REC_PROPOSTA.PRP_ISOACEITEPEDIDO,
         REC_PROPOSTA.PRP_TIPOCONFIRMACAO,
         REC_PROPOSTA.PRP_INCLUIDATA,
         REC_PROPOSTA.PRP_INCLUIPOR,
         REC_PROPOSTA.PRP_ALTERADATA,
         REC_PROPOSTA.PRP_ALTERAPOR,
         0);
    END LOOP;
    /*****************************************************************
    GERA AS OBSERVAC?ES DA NOVA PROPOSTA COM A DIVIS?O
    ******************************************************************/
    FOR REC_OBSERVACAO IN CUR_OBSERVACAO LOOP
      INSERT INTO PROPOSTA_MEMO
        (PRP_CODIGO,
         PPM_TIPOTEXTO,
         PPM_TEXTO,
         PPM_INCLUIDATA,
         PPM_INCLUIPOR,
         PPM_ALTERADATA,
         PPM_ALTERAPOR)

      VALUES
        (V_PROXIMAPROPOSTA,
         REC_OBSERVACAO.PPM_TIPOTEXTO,
         REC_OBSERVACAO.PPM_TEXTO,
         REC_OBSERVACAO.PPM_INCLUIDATA,
         REC_OBSERVACAO.PPM_INCLUIPOR,
         REC_OBSERVACAO.PPM_ALTERADATA,
         REC_OBSERVACAO.PPM_ALTERAPOR);
    END LOOP;
    V_PROPOSTA := V_PROXIMAPROPOSTA;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE_APPLICATION_ERROR(-20001, FNC_MENSAGEM_ERRO(20001));
    WHEN E_SEQUENCIA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20049, FNC_MENSAGEM_ERRO(20049));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE
  END PRC_COPIA_CABECALHO;

  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PRC_RECALCULA_MALA
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 08/07/2002
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES : Recalcula os itens colocando valor na mala de ferramenta
  --------------------------------------------------------------------------------
  PROCEDURE PRC_RECALCULA_MALA(V_PROPOSTA IN PROPOSTA.PRP_CODIGO %TYPE) IS
  BEGIN
    UPDATE PROPOSTA_ITEM
       SET PRI_VALORTOTAL                = NULL,
           PRI_DESCONTO                  = NULL,
           PRI_VALORDESCONTO             = NULL,
           PRI_VALORUNITARIO             = NULL,
           PRI_VALORUNITARIOTABELA       = NULL,
           PRI_VALORIPI                  = NULL,
           PRI_IPI                       = NULL,
           PRI_PERCENTUALMARKUP          = NULL,
           PROPOSTA_ITEM.PRI_CUSTO       = NULL,
           PROPOSTA_ITEM.PRI_CUSTOMEDIO  = NULL,
           PROPOSTA_ITEM.PRI_CUSTOMARKUP = NULL
     WHERE PRP_CODIGO = V_PROPOSTA
       AND PRI_MALA = 'M';
    /*****************************************************************
     RECALCULA A PROPOSTA ORIGEM
    ******************************************************************/
    DECLARE
      V_PRP_VALORTOTAL         PROPOSTA.PRP_VALORTOTAL%TYPE;
      V_PRP_MEDIAMARKUP        PROPOSTA.PRP_MEDIAMARKUP%TYPE;
      V_PRP_VALORTOTALTABELA   PROPOSTA.PRP_VALORTOTALTABELA%TYPE;
      V_PRP_VALORTOTALIPI      PROPOSTA.PRP_VALORTOTALIPI%TYPE;
      V_PRP_VALORTOTALDESCONTO PROPOSTA.PRP_VALORTOTALDESCONTO%TYPE;
      V_PRP_OVERDESCONTO       PROPOSTA.PRP_OVERDESCONTO%TYPE;
    BEGIN
      SELECT SUM(PRI_VALORTOTAL),
             SUM(PRI_PERCENTUALMARKUP),
             SUM(PRI_VALORDESCONTO),
             SUM(PRI_VALORIPI),
             SUM(PRI_QUANTIDADE * PRI_VALORUNITARIOTABELA)
        INTO V_PRP_VALORTOTAL,
             V_PRP_MEDIAMARKUP,
             V_PRP_VALORTOTALDESCONTO,
             V_PRP_VALORTOTALIPI,
             V_PRP_VALORTOTALTABELA
        FROM PROPOSTA_ITEM
       WHERE PRP_CODIGO = V_PROPOSTA;
      -- CALCULA A MEDIA DE MARKUP
      DECLARE
        N_ITEM INTEGER;
      BEGIN
        SELECT COUNT(*)
          INTO N_ITEM
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PROPOSTA
           AND (PRI_MALA <> 'M' OR PRI_MALA IS NULL);
        V_PRP_MEDIAMARKUP := V_PRP_MEDIAMARKUP / N_ITEM;
      END;
      -----------------------------------------------------
      IF (V_PRP_VALORTOTAL > V_PRP_VALORTOTALTABELA) AND
         (V_PRP_VALORTOTALTABELA > 0) THEN
        V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTAL - V_PRP_VALORTOTALTABELA) /
                              V_PRP_VALORTOTAL) * 100;
      ELSIF (V_PRP_VALORTOTALTABELA > V_PRP_VALORTOTAL) AND
            (V_PRP_VALORTOTAL > 0) THEN
        V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTALTABELA - V_PRP_VALORTOTAL) /
                              V_PRP_VALORTOTALTABELA) * 100;
      END IF;
      UPDATE PROPOSTA
         SET PRP_VALORTOTAL         = V_PRP_VALORTOTAL,
             PRP_VALORTOTALTABELA   = V_PRP_VALORTOTALTABELA,
             PRP_VALORTOTALIPI      = V_PRP_VALORTOTALIPI,
             PRP_VALORTOTALDESCONTO = V_PRP_VALORTOTALDESCONTO,
             PRP_MEDIAMARKUP        = V_PRP_MEDIAMARKUP,
             PRP_OVERDESCONTO       = V_PRP_OVERDESCONTO
       WHERE PRP_CODIGO = V_PROPOSTA;
    END;
  END PRC_RECALCULA_MALA;
  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PRC_GRAVA_PROPOSTA
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 30/01/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_GRAVA_PROPOSTA(V_PRP_CODIGO              IN OUT PROPOSTA.PRP_CODIGO %TYPE,
                               V_CLI_CODIGO              IN PROPOSTA.CLI_CODIGO %TYPE,
                               V_ORI_CODIGO              IN PROPOSTA.ORI_CODIGO %TYPE,
                               V_TRA_CODIGO              IN PROPOSTA.TRA_CODIGO %TYPE,
                               V_CPG_CODIGO              IN PROPOSTA.CPG_CODIGO %TYPE,
                               V_END_CODIGO              IN PROPOSTA.END_CODIGO %TYPE,
                               V_PTP_CODIGO              IN PROPOSTA.PTP_CODIGO %TYPE,
                               V_PRP_SITUACAO            IN PROPOSTA.PRP_SITUACAO %TYPE,
                               V_PRP_NOME                IN PROPOSTA.PRP_NOME %TYPE,
                               V_PRP_ENDERECO            IN PROPOSTA.PRP_ENDERECO %TYPE,
                               V_PRP_BAIRRO              IN PROPOSTA.PRP_BAIRRO %TYPE,
                               V_PRP_CIDADE              IN PROPOSTA.PRP_CIDADE %TYPE,
                               V_PRP_UF                  IN PROPOSTA.PRP_UF %TYPE,
                               V_PRP_CEP                 IN PROPOSTA.PRP_CEP %TYPE,
                               V_PRP_FONE                IN PROPOSTA.PRP_FONE %TYPE,
                               V_PRP_FAX                 IN PROPOSTA.PRP_FAX %TYPE,
                               V_RAT_CODIGO              IN PROPOSTA.RAT_CODIGO %TYPE,
                               V_PRP_EMAIL               IN PROPOSTA.PRP_EMAIL %TYPE,
                               V_PRP_AOSCUIDADOS         IN PROPOSTA.PRP_AOSCUIDADOS %TYPE,
                               V_PRP_DEPARTAMENTO        IN PROPOSTA.PRP_DEPARTAMENTO %TYPE,
                               V_PRP_VENDEDORINTERNO     IN PROPOSTA.PRP_VENDEDORINTERNO %TYPE,
                               V_PRP_VENDEDOREXTERNO     IN PROPOSTA.PRP_VENDEDOREXTERNO %TYPE,
                               V_PRP_VENDEDOROPERACIONAL IN PROPOSTA.PRP_VENDEDOROPERACIONAL %TYPE,
                               V_PRP_DATAEMISSAO         IN PROPOSTA.PRP_DATAEMISSAO %TYPE,
                               V_PRP_DATACONFIRMACAO     IN PROPOSTA.PRP_DATACONFIRMACAO %TYPE,
                               V_PRP_DATAFATURAMENTO     IN PROPOSTA.PRP_DATAFATURAMENTO %TYPE,
                               V_PRP_OBSERVACAONOTA      IN PROPOSTA.PRP_OBSERVACAONOTA %TYPE,
                               V_PRP_VALIDADE            IN PROPOSTA.PRP_VALIDADE %TYPE,
                               V_PRP_DATAVALIDADE        IN PROPOSTA.PRP_DATAVALIDADE %TYPE,
                               V_PRP_ENTREGA             IN PROPOSTA.PRP_ENTREGA %TYPE,
                               V_PRP_DATAENTREGA         IN PROPOSTA.PRP_DATAENTREGA %TYPE,
                               V_PRP_SHIPDATE            IN PROPOSTA.PRP_SHIPDATE %TYPE,
                               V_PRP_PAIS                IN PROPOSTA.PRP_PAIS %TYPE,
                               V_PRP_FOB                 IN PROPOSTA.PRP_FOB %TYPE,
                               V_PRP_PROJECT             IN PROPOSTA.PRP_PROJECT %TYPE,
                               V_PRP_IMPOSTOS            IN PROPOSTA.PRP_IMPOSTOS %TYPE,
                               V_PRP_VALORFRETE          IN PROPOSTA.PRP_VALORFRETE %TYPE,
                               V_PRP_FRETEPAGO           IN PROPOSTA.PRP_FRETEPAGO %TYPE,
                               V_PRP_VALORTOTAL          IN PROPOSTA.PRP_VALORTOTAL %TYPE,
                               V_PRP_VALORTOTALTABELA    IN PROPOSTA.PRP_VALORTOTALTABELA %TYPE,
                               V_PRP_VALORTOTALIPI       IN PROPOSTA.PRP_VALORTOTALIPI %TYPE,
                               V_PRP_VALORTOTALDESCONTO  IN PROPOSTA.PRP_VALORTOTALDESCONTO %TYPE,
                               V_PRP_OVERDESCONTO        IN PROPOSTA.PRP_OVERDESCONTO %TYPE,
                               V_PRP_FORMACONFIRMA       IN PROPOSTA.PRP_FORMACONFIRMA %TYPE,
                               V_PRP_TIPOFATURAMENTO     IN PROPOSTA.PRP_TIPOFATURAMENTO %TYPE,
                               V_PRP_TIPOENTREGA         IN PROPOSTA.PRP_TIPOENTREGA %TYPE,
                               V_PRP_NUMEROPEDIDOCLIENTE IN PROPOSTA.PRP_NUMEROPEDIDOCLIENTE %TYPE,
                               V_PRP_MEDIAMARKUP         IN PROPOSTA.PRP_MEDIAMARKUP %TYPE,
                               V_PRP_PROPOSTAPAI         IN PROPOSTA.PRP_PROPOSTAPAI %TYPE,
                               V_PRP_CONTROLECREDITO     IN PROPOSTA.PRP_CONTROLECREDITO %TYPE,
                               V_PRP_USUARIO             IN PROPOSTA.PRP_INCLUIPOR %TYPE,
                               V_PRP_ISOACEITEPROPOSTA   IN PROPOSTA.PRP_ISOACEITEPROPOSTA %TYPE,
                               V_PRP_ISOACEITEPEDIDO     IN PROPOSTA.PRP_ISOACEITEPEDIDO %TYPE,
                               V_TIPO                    IN PLS_INTEGER,
                               V_COMMIT                  IN CHAR,
                               V_CONTROLE                IN PROPOSTA.PRP_CONTROLAPRN %TYPE,
                               V_PRP_VALORTOTALICMSST    IN PROPOSTA.PRP_VALORTOTALICMSST %TYPE,
                               V_PRP_TOTALBASECALCICMSST IN PROPOSTA.PRP_TOTALBASECALCICMSST %TYPE,
                               V_PRP_BASECALCULOICMS     IN PROPOSTA.PRP_BASECALCULOICMS %TYPE,
                               V_PRP_VALORTOTALICMS      IN PROPOSTA.PRP_VALORTOTALICMS %TYPE,
                               V_PRP_COMPLEMENTAR        IN PROPOSTA.PRP_COMPLEMENTAR%TYPE,
                               V_PRP_ABATECRED           IN PROPOSTA.PRP_ABATECRED%TYPE,
                               V_PRP_VALORCREDITO        IN PROPOSTA.PRP_VALORCREDITO%TYPE,
                               V_PRP_TRIANGULACAO        IN PROPOSTA.PRP_TRIANGULACAO%TYPE,
                               V_PRT_CODIGO              IN PROPOSTA.PRT_CODIGO%TYPE,
                               V_PRP_TID                 IN PROPOSTA.PRP_TID%TYPE,
                               V_TRA_PRAZO_ENTREGA       IN PROPOSTA.TRA_PRAZO_ENTREGA%TYPE  /*default 0*/,
                               V_ICMSDESONTOTAL          IN PROPOSTA.PRP_ICMSDESONTOTAL%TYPE /*default 0*/,
                               V_PRP_VALOROUTROS         IN PROPOSTA.PRP_VALOROUTROS%TYPE    /*default 0*/,
                               V_PRP_FINALIDADE          IN PROPOSTA.PRP_FINALIDADE%TYPE     /*default 0*/,
                               V_NAT_CODIGO              IN PROPOSTA.NAT_CODIGO%TYPE         /*default 0*/,
                               V_PRP_SEQPROPVENDIRETA IN PROPOSTA.PRP_SEQPROPVENDIRETA%TYPE DEFAULT -1)
   IS

    V_SITUACAO         VARCHAR2(2); -- PARA VERIFICAR ALTERACAO (DEVOLVE RESERVA)
    V_TRANSP           NUMBER(6);
    V_TRANPS_ENTREGA   NUMBER;
    V_TRA_PRP          NUMBER(6);
    V_CNPJ             PROPOSTA.PRP_CNPJ%TYPE;
    V_CHK_NOME_CLIENTE PROPOSTA.PRP_NOME%TYPE;
    V_CHK_VENDADIRETA CLIENTE.CLI_TRIANGVDIRETA%TYPE;
    V_DEF_VENDADIRETA NUMBER(6);
    E_PREENCHIMENTO_OBRIGATORIO EXCEPTION;
    E_SEQUENCIA_NAO_ENCONTRADA EXCEPTION;
    E_PROPOSTA_NAO_ENCONTRADA EXCEPTION;
    E_CLIENTE_NAO_LOCALIZADO EXCEPTION;
    E_CLIENTE_NOME_INCORRETO EXCEPTION;
    E_CLIENTE_CODIGO_INCORRETO EXCEPTION;
    V_EXISTE Integer;

  BEGIN
    IF V_PRP_CODIGO IS NULL OR -- VERIFICA COLUNAS DE PREENCHIMENTO OBRIGATORIO DETERMINADO EM CONSTRAINT
       V_CPG_CODIGO IS NULL OR V_PRP_NOME IS NULL OR
       V_PRP_DATAEMISSAO IS NULL OR V_PRP_FRETEPAGO IS NULL OR
       V_PRP_FORMACONFIRMA IS NULL OR V_PRP_TIPOFATURAMENTO IS NULL OR
       V_PRP_TIPOENTREGA IS NULL OR V_PRP_USUARIO IS NULL  OR
       V_NAT_CODIGO IS NULL OR (nvl(V_NAT_CODIGO, 0) <= 0) or
       V_PRP_FINALIDADE IS NULL  OR (to_number(V_PRP_FINALIDADE) not between 1 and 11) or
       V_PRT_CODIGO IS NULL THEN
      --
      raise_application_error(-20000, 'Campo de Preenchimento Obrigatório não informado, verifique!'||chr(10)||
                                      'V_PRP_CODIGO:'||V_PRP_CODIGO||chr(10)||';'||
                                      'V_CPG_CODIGO:'||V_CPG_CODIGO||chr(10)||';'||
                                      'V_CLI_CODIGO:'||V_CLI_CODIGO||chr(10)||';'||
                                      'V_PRP_NOME:'||V_PRP_NOME||chr(10)||';'||
                                      'V_PRP_DATAEMISSAO:'||V_PRP_DATAEMISSAO||chr(10)||';'||
                                      'V_PRP_FRETEPAGO:'||V_PRP_FRETEPAGO||chr(10)||';'||
                                      'V_PRP_FORMACONFIRMA:'||V_PRP_FORMACONFIRMA||chr(10)||';'||
                                      'V_PRP_FORMACONFIRMA:'||V_PRP_FORMACONFIRMA||chr(10)||';'||
                                      'V_PRP_TIPOFATURAMENTO:'||V_PRP_TIPOFATURAMENTO||chr(10)||';'||
                                      'V_PRP_TIPOENTREGA:'||V_PRP_TIPOENTREGA||chr(10)||';'||
                                      'V_PRP_USUARIO:'||V_PRP_USUARIO||chr(10)||';'||
                                      'V_NAT_CODIGO:'||V_NAT_CODIGO||chr(10)||';'||
                                      'V_PRP_FINALIDADE:'||V_PRP_FINALIDADE||chr(10)||';'||
                                      'V_PRT_CODIGO:'||V_PRT_CODIGO);
      --RAISE E_PREENCHIMENTO_OBRIGATORIO;
    END IF;

    -- revalidar Natureza de Operação
    if V_PRP_FINALIDADE between 1 and 10 then
      declare
        v_Nat_Correta natureza_operacao.nat_codigo %type;
      begin
        select fnc_busca_natureza_operacao(V_CLI_CODIGO, V_PRP_TRIANGULACAO, V_PRP_FINALIDADE)
          into v_Nat_Correta
          from dual;

        if v_Nat_Correta != V_NAT_CODIGO then
          raise_application_error(-20000, 'Natureza de Operação incorreta para esse pedido, verifique!');
        end if;

        exception
          when others then
            raise_application_error(-20000, 'Erro na validação da Natureza de Operação!'||chr(10)||sqlerrm);
      end;
    elsif V_PRP_FINALIDADE = 11 then --finalidade 11=Outros
      declare
        v_ValidaCFOP  natureza_operacao.nat_numero %type;
        v_UFEmp       empresa.emp_uf %type;
      begin
        select n.nat_numero, e.emp_uf
          into v_ValidaCFOP, v_UFEmp
          from natureza_operacao n, empresa e
         where n.nat_codigo = V_NAT_CODIGO
           and n.NAT_FINALIDADENFE > 0;

        if V_PRP_UF = 'EX' then
          if (substr(v_ValidaCFOP, 1, 1) != '7') then
            raise_application_error(-20000, 'Natureza de Operação incorreta para esse pedido, verifique!');
          end if;
        else
          if (
             (substr(v_ValidaCFOP, 1, 1) not in ('1', '2', '5', '6')) or
             ((substr(v_ValidaCFOP, 1, 1) in ('2', '6')) and (v_UFEmp = V_PRP_UF)) OR
             ((substr(v_ValidaCFOP, 1, 1) in ('1', '5')) and (v_UFEmp != V_PRP_UF))
             ) then
            raise_application_error(-20000, 'Natureza de Operação incorreta para esse pedido tverifique!');
          end if;
        end if;

        exception
          when others then
            raise_application_error(-20000, 'Erro na validação da Natureza de Operação!'||chr(10)||sqlerrm);
      end;
    end if;

    V_SITUACAO := V_PRP_SITUACAO;
    IF V_SITUACAO IS NULL THEN
      V_SITUACAO := 'PN';
    END IF;

    -- Verifica se o cliente da proposta, esta consistente c/ o cadastro de clientes...
    -- Elio Junior: 07/07/2010
    IF V_TIPO in (1, 2) THEN
      IF NVL(V_CLI_CODIGO, -1) <= 0 THEN
        RAISE E_CLIENTE_CODIGO_INCORRETO;
      END IF;

      BEGIN
        V_CHK_NOME_CLIENTE := null;

        SELECT CLI_NOME, CLI_CNPJ,  CLI_TRIANGVDIRETA
          INTO V_CHK_NOME_CLIENTE, V_CNPJ, V_CHK_VENDADIRETA
          FROM CLIENTE
         WHERE CLI_CODIGO = V_CLI_CODIGO;
      EXCEPTION
        WHEN OTHERS THEN
          -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
          RAISE E_CLIENTE_NAO_LOCALIZADO;
      END;     

      IF V_CHK_NOME_CLIENTE IS NULL THEN
        RAISE E_CLIENTE_NAO_LOCALIZADO;
      ELSIF TRIM(V_CHK_NOME_CLIENTE) <> TRIM(V_PRP_NOME) THEN
        RAISE E_CLIENTE_NOME_INCORRETO;
      END IF;
    END IF;
 
     V_DEF_VENDADIRETA:=V_PRP_SEQPROPVENDIRETA;
     IF V_CHK_VENDADIRETA=1 THEN
         V_DEF_VENDADIRETA:=0;
     END IF;

    -- Roberto Marujo - 10/03/2012
    -- Verificac?o de existencia da proposta complementar quando existente
/*    if V_PRP_COMPLEMENTAR <> 0 then
      begin
        select CLI_CODIGO
          into V_EXISTE
          from PROPOSTA P
         where P.PRP_CODIGO = V_PRP_COMPLEMENTAR
           and P.PTP_CODIGO = 2;
      exception
        when NO_DATA_FOUND then
          raise_application_error(-20001, 'Proposta complementar inexistente ou n?o do tipo 2 - Reserva do vendedor');
      end;

      if V_PRP_VENDEDORINTERNO <> TO_NUMBER(FNC_BUSCAREGRA('RMA', 'CODIGO_VENDEDOR')) then
        if V_EXISTE <> V_CLI_CODIGO then
          raise_application_error(-20001, 'Proposta complementar n?o e do mesmo cliente');
        end if;
      end if;
      ---------------------------------------------------------------------
    end if;
*/
    IF V_TIPO = 1 THEN
      -- INCLUSAO

      SELECT SQN_PROPOSTA.NEXTVAL -- ATRIBUI NOVO NUMERO DE PROPOSTA A VARIAVEL
        INTO V_PRP_CODIGO
        FROM DUAL;

      IF SQL%NOTFOUND THEN
        RAISE E_SEQUENCIA_NAO_ENCONTRADA;
      END IF;

      INSERT INTO PROPOSTA
        (PRP_CODIGO,
         CLI_CODIGO,
         ORI_CODIGO,
         TRA_CODIGO,
         CPG_CODIGO,
         END_CODIGO,
         PTP_CODIGO,
         PRP_SITUACAO,
         PRP_NOME,
         PRP_ENDERECO,
         PRP_BAIRRO,
         PRP_CIDADE,
         PRP_UF,
         PRP_CEP,
         PRP_FONE,
         PRP_FAX,
         RAT_CODIGO,
         PRP_EMAIL,
         PRP_AOSCUIDADOS,
         PRP_DEPARTAMENTO,
         PRP_VENDEDORINTERNO,
         PRP_VENDEDOREXTERNO,
         PRP_VENDEDOROPERACIONAL,
         PRP_DATAEMISSAO,
         PRP_DATACONFIRMACAO,
         PRP_DATAFATURAMENTO,
         PRP_OBSERVACAONOTA,
         PRP_VALIDADE,
         PRP_DATAVALIDADE,
         PRP_ENTREGA,
         PRP_DATAENTREGA,
         PRP_SHIPDATE,
         PRP_PAIS,
         PRP_FOB,
         PRP_PROJECT,
         PRP_IMPOSTOS,
         PRP_VALORFRETE,
         PRP_FRETEPAGO,
         PRP_VALORTOTAL,
         PRP_VALORTOTALTABELA,
         PRP_VALORTOTALIPI,
         PRP_VALORTOTALDESCONTO,
         PRP_OVERDESCONTO,
         PRP_FORMACONFIRMA,
         PRP_TIPOFATURAMENTO,
         PRP_TIPOENTREGA,
         PRP_NUMEROPEDIDOCLIENTE,
         PRP_MEDIAMARKUP,
         PRP_PROPOSTAPAI,
         PRP_CONTROLECREDITO,
         PRP_ISOACEITEPROPOSTA,
         PRP_ISOACEITEPEDIDO,
         PRP_TICKETPRN,
         PRP_CONTROLAPRN,
         PRP_INCLUIDATA,
         PRP_INCLUIPOR,
         PRP_ALTERADATA,
         PRP_ALTERAPOR,
         PRP_VALORTOTALICMSST,
         PRP_TOTALBASECALCICMSST,
         PRP_BASECALCULOICMS,
         PRP_VALORTOTALICMS,
         PRP_COMPLEMENTAR,
         PRP_ABATECRED,
         PRP_VALORCREDITO,
         PRP_TRIANGULACAO,
         PRT_CODIGO,
         PRP_TID,
         TRA_PRAZO_ENTREGA,
         PRP_ICMSDESONTOTAL,
         PRP_VALOROUTROS,
         PRP_FINALIDADE,
         NAT_CODIGO,
         PRP_CNPJ,
         PRP_SEQPROPVENDIRETA
         )
      VALUES
        (V_PRP_CODIGO,
         V_CLI_CODIGO,
         V_ORI_CODIGO,
         V_TRA_CODIGO,
         V_CPG_CODIGO,
         V_END_CODIGO,
         V_PTP_CODIGO,
         V_SITUACAO,
         V_PRP_NOME,
         V_PRP_ENDERECO,
         V_PRP_BAIRRO,
         V_PRP_CIDADE,
         V_PRP_UF,
         V_PRP_CEP,
         V_PRP_FONE,
         V_PRP_FAX,
         V_RAT_CODIGO,
         V_PRP_EMAIL,
         V_PRP_AOSCUIDADOS,
         V_PRP_DEPARTAMENTO,
         V_PRP_VENDEDORINTERNO,
         V_PRP_VENDEDOREXTERNO,
         V_PRP_VENDEDOROPERACIONAL,
         TO_date(SYSDATE, 'DD/MM/RRRR'),
         V_PRP_DATACONFIRMACAO,
         V_PRP_DATAFATURAMENTO,
         V_PRP_OBSERVACAONOTA,
         V_PRP_VALIDADE,
         V_PRP_DATAVALIDADE,
         V_PRP_ENTREGA,
         V_PRP_DATAENTREGA,
         V_PRP_SHIPDATE,
         V_PRP_PAIS,
         V_PRP_FOB,
         V_PRP_PROJECT,
         V_PRP_IMPOSTOS,
         V_PRP_VALORFRETE,
         V_PRP_FRETEPAGO,
         V_PRP_VALORTOTAL,
         V_PRP_VALORTOTALTABELA,
         V_PRP_VALORTOTALIPI,
         V_PRP_VALORTOTALDESCONTO,
         V_PRP_OVERDESCONTO,
         V_PRP_FORMACONFIRMA,
         V_PRP_TIPOFATURAMENTO,
         V_PRP_TIPOENTREGA,
         V_PRP_NUMEROPEDIDOCLIENTE,
         V_PRP_MEDIAMARKUP,
         V_PRP_PROPOSTAPAI,
         V_PRP_CONTROLECREDITO,
         V_PRP_ISOACEITEPROPOSTA,
         V_PRP_ISOACEITEPEDIDO,
         'N',
         V_CONTROLE,
         SYSDATE,
         V_PRP_USUARIO,
         SYSDATE,
         V_PRP_USUARIO,
         V_PRP_VALORTOTALICMSST,
         V_PRP_TOTALBASECALCICMSST,
         V_PRP_BASECALCULOICMS,
         V_PRP_VALORTOTALICMS,
         V_PRP_COMPLEMENTAR,
         V_PRP_ABATECRED,
         V_PRP_VALORCREDITO,
         V_PRP_TRIANGULACAO,
         V_PRT_CODIGO,
         V_PRP_TID,
         V_TRA_PRAZO_ENTREGA,
         V_ICMSDESONTOTAL,
         V_PRP_VALOROUTROS,
         V_PRP_FINALIDADE,
         V_NAT_CODIGO,
         V_CNPJ,
         V_DEF_VENDADIRETA   
);

    ELSIF V_TIPO = 2 THEN
      -- ALTERACAO
      UPDATE PROPOSTA
         SET CLI_CODIGO              = V_CLI_CODIGO,
             ORI_CODIGO              = V_ORI_CODIGO,
             TRA_CODIGO              = V_TRA_CODIGO,
             CPG_CODIGO              = V_CPG_CODIGO,
             END_CODIGO              = V_END_CODIGO,
             PTP_CODIGO              = V_PTP_CODIGO,
             PRP_SITUACAO            = V_SITUACAO,
             PRP_NOME                = V_PRP_NOME,
             PRP_ENDERECO            = V_PRP_ENDERECO,
             PRP_BAIRRO              = V_PRP_BAIRRO,
             PRP_CIDADE              = V_PRP_CIDADE,
             PRP_UF                  = V_PRP_UF,
             PRP_CEP                 = V_PRP_CEP,
             PRP_FONE                = V_PRP_FONE,
             PRP_FAX                 = V_PRP_FAX,
             RAT_CODIGO              = V_RAT_CODIGO,
             PRP_EMAIL               = V_PRP_EMAIL,
             PRP_AOSCUIDADOS         = V_PRP_AOSCUIDADOS,
             PRP_DEPARTAMENTO        = V_PRP_DEPARTAMENTO,
             PRP_VENDEDORINTERNO     = V_PRP_VENDEDORINTERNO,
             PRP_VENDEDOREXTERNO     = V_PRP_VENDEDOREXTERNO,
             PRP_VENDEDOROPERACIONAL = V_PRP_VENDEDOROPERACIONAL,
             PRP_DATAEMISSAO         = V_PRP_DATAEMISSAO,
             PRP_DATACONFIRMACAO     = V_PRP_DATACONFIRMACAO,
             PRP_DATAFATURAMENTO     = V_PRP_DATAFATURAMENTO,
             PRP_OBSERVACAONOTA      = V_PRP_OBSERVACAONOTA,
             PRP_VALIDADE            = V_PRP_VALIDADE,
             PRP_DATAVALIDADE        = V_PRP_DATAVALIDADE,
             PRP_ENTREGA             = V_PRP_ENTREGA,
             PRP_DATAENTREGA         = V_PRP_DATAENTREGA,
             PRP_SHIPDATE            = V_PRP_SHIPDATE,
             PRP_PAIS                = V_PRP_PAIS,
             PRP_FOB                 = V_PRP_FOB,
             PRP_PROJECT             = V_PRP_PROJECT,
             PRP_IMPOSTOS            = V_PRP_IMPOSTOS,
             PRP_VALORFRETE          = V_PRP_VALORFRETE,
             PRP_FRETEPAGO           = V_PRP_FRETEPAGO,
             PRP_VALORTOTAL          = V_PRP_VALORTOTAL,
             PRP_VALORTOTALTABELA    = V_PRP_VALORTOTALTABELA,
             PRP_VALORTOTALIPI       = V_PRP_VALORTOTALIPI,
             PRP_VALORTOTALDESCONTO  = V_PRP_VALORTOTALDESCONTO,
             PRP_OVERDESCONTO        = V_PRP_OVERDESCONTO,
             PRP_FORMACONFIRMA       = V_PRP_FORMACONFIRMA,
             PRP_TIPOFATURAMENTO     = V_PRP_TIPOFATURAMENTO,
             PRP_TIPOENTREGA         = V_PRP_TIPOENTREGA,
             PRP_NUMEROPEDIDOCLIENTE = V_PRP_NUMEROPEDIDOCLIENTE,
             PRP_MEDIAMARKUP         = V_PRP_MEDIAMARKUP,
             PRP_PROPOSTAPAI         = V_PRP_PROPOSTAPAI,
             PRP_CONTROLECREDITO     = V_PRP_CONTROLECREDITO,
             PRP_ISOACEITEPROPOSTA   = V_PRP_ISOACEITEPROPOSTA,
             PRP_ISOACEITEPEDIDO     = V_PRP_ISOACEITEPEDIDO,
             PRP_ALTERADATA          = SYSDATE,
             PRP_ALTERAPOR           = V_PRP_USUARIO,
             PRP_VALORTOTALICMSST    = V_PRP_VALORTOTALICMSST,
             PRP_TOTALBASECALCICMSST = V_PRP_TOTALBASECALCICMSST,
             PRP_COMPLEMENTAR        = V_PRP_COMPLEMENTAR,
             PRP_ABATECRED           = V_PRP_ABATECRED,
             PRP_VALORCREDITO        = V_PRP_VALORCREDITO,
             PRP_TRIANGULACAO        = V_PRP_TRIANGULACAO,
             PRT_CODIGO              = V_PRT_CODIGO,
             PRP_TID                 = V_PRP_TID,
             TRA_PRAZO_ENTREGA       = V_TRA_PRAZO_ENTREGA,
             PRP_ICMSDESONTOTAL      = V_ICMSDESONTOTAL,
             PRP_VALOROUTROS         = V_PRP_VALOROUTROS,
             PRP_FINALIDADE          = V_PRP_FINALIDADE,
             NAT_CODIGO              = V_NAT_CODIGO,
             PRP_SEQPROPVENDIRETA = V_DEF_VENDADIRETA
       WHERE PRP_CODIGO = V_PRP_CODIGO;

      IF SQL%NOTFOUND THEN
        RAISE E_PROPOSTA_NAO_ENCONTRADA;
      END IF;

    ELSIF V_TIPO = 3 THEN
      -- EXCLUSAO

      DELETE FROM PROPOSTA WHERE PRP_CODIGO = V_PRP_CODIGO;
      COMMIT;
      IF SQL%NOTFOUND THEN
        RAISE E_PROPOSTA_NAO_ENCONTRADA;
      END IF;


    END IF;

    pck_sysope.PRC_TMP_TRANSFERE(V_PRP_CODIGO, V_COMMIT); -- add V_COMMIT tratamento Sol Fatura em duplicidade

    IF V_COMMIT = 'S' THEN
      COMMIT;
    END IF;

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE_APPLICATION_ERROR(-20001, FNC_MENSAGEM_ERRO(20001));
    WHEN E_PREENCHIMENTO_OBRIGATORIO THEN
      RAISE_APPLICATION_ERROR(-20048, FNC_MENSAGEM_ERRO(20048));
    WHEN E_SEQUENCIA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20049, FNC_MENSAGEM_ERRO(20049));
    WHEN E_PROPOSTA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20050, FNC_MENSAGEM_ERRO(20050));
    WHEN E_CLIENTE_NAO_LOCALIZADO THEN
      RAISE_APPLICATION_ERROR(-20060, 'Cliente n?o foi localizado...');
    WHEN E_CLIENTE_NOME_INCORRETO THEN
      RAISE_APPLICATION_ERROR(-20061,
                              'Nome do cliente n?o esta correto...');
    WHEN E_CLIENTE_CODIGO_INCORRETO THEN
      RAISE_APPLICATION_ERROR(-20062,
                              'Codigo do cliente n?o esta correto...');
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE

  END PRC_GRAVA_PROPOSTA;
  --------------------------------------------------------------------------------
  PROCEDURE PRC_GRAVA_PROPOSTA_MEMO(V_PRP_CODIGO    IN PROPOSTA_MEMO.PRP_CODIGO%TYPE,
                                    V_PPM_TIPOTEXTO IN PROPOSTA_MEMO.PPM_TIPOTEXTO%TYPE,
                                    V_PPM_TEXTO     IN PROPOSTA_MEMO.PPM_TEXTO%TYPE,
                                    V_PPM_USUARIO   IN PROPOSTA_MEMO.PPM_INCLUIPOR%TYPE,
                                    V_TIPO          IN INTEGER,
                                    V_COMMIT        IN CHAR) IS
    ERR_TEXT_NULL EXCEPTION; -- ERRO OCORRIDO QUANDO O TEXTO ESTIVER NULO.
    ERR_PRODUTO_NULL EXCEPTION; -- ERRO OCORRIDO QUANDO O NOME DO CLIENTE ESTIVER NULO.
    ERR_TIPO_INVALIDO EXCEPTION; -- ERRO OCORRIDO QUANDO O PRODUTO INDICADO N?O FOR ENCONTRADO.
    ERR_PRODUTO_INVALIDO EXCEPTION; -- ERRO OCORRIDO QUANDO O PRODUTO INDICADO N?O FOR ENCONTRADO.

    --   CONTA_PRO INTEGER;
    V_ACHOU INTEGER;
  BEGIN
    BEGIN
      -- VERIFICA SE EXISTE ALGUMA OBSERVACAO OU FOLLOW-UP
      SELECT PRP_CODIGO
        INTO V_ACHOU
        FROM PROPOSTA_MEMO
       WHERE (PRP_CODIGO = V_PRP_CODIGO)
         AND (PPM_TIPOTEXTO = V_PPM_TIPOTEXTO);
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        V_ACHOU := 0;
    END;

    IF V_ACHOU = 0 THEN
      -------------------- PARA A OPERAC?O DE INCLUS?O, O V_TIPO E 1
      IF (V_PRP_CODIGO IS NULL) THEN
        ----- SE V_CODIGO ESTIVER NULO
        RAISE ERR_PRODUTO_NULL; -- DISPARA O ERRO
      ELSIF (V_PPM_TEXTO IS NULL) THEN
        -- SE V_TEXTO ESTIVER NULA
        RAISE ERR_TEXT_NULL; -- DISPARA O ERRO
      END IF;

      INSERT INTO PROPOSTA_MEMO
        (PRP_CODIGO,
         PPM_TIPOTEXTO,
         PPM_TEXTO,
         PPM_INCLUIDATA,
         PPM_INCLUIPOR,
         PPM_ALTERADATA,
         PPM_ALTERAPOR)

      VALUES
        (V_PRP_CODIGO,
         V_PPM_TIPOTEXTO,
         V_PPM_TEXTO,
         SYSDATE,
         V_PPM_USUARIO,
         SYSDATE,
         V_PPM_USUARIO);

    ELSIF V_TIPO = 2 THEN
      -- ALTERAC?O
      IF (V_PRP_CODIGO IS NULL) THEN
        ----- SE V_CODIGO ESTIVER NULO
        RAISE ERR_PRODUTO_NULL; -- DISPARA O ERRO
      ELSIF (V_PPM_TEXTO IS NULL) THEN
        -- SE V_TEXTO ESTIVER NULA
        RAISE ERR_TEXT_NULL; -- DISPARA O ERRO
      END IF;

      UPDATE PROPOSTA_MEMO
         SET PPM_TIPOTEXTO  = V_PPM_TIPOTEXTO,
             PPM_TEXTO      = V_PPM_TEXTO,
             PPM_ALTERADATA = SYSDATE,
             PPM_ALTERAPOR  = V_PPM_USUARIO
       WHERE PRP_CODIGO = V_PRP_CODIGO
         AND PPM_TIPOTEXTO = V_PPM_TIPOTEXTO;

    ELSIF V_TIPO = 3 THEN
      -- CANCELA UMA ORDEM DE PRODUCAO
      IF (V_PRP_CODIGO IS NULL) THEN
        ----- SE V_PRODUTO ESTIVER NULO
        RAISE ERR_PRODUTO_NULL; -- DISPARA O ERRO
      END IF;

      DELETE FROM PROPOSTA_MEMO WHERE PRP_CODIGO = V_PRP_CODIGO;

    ELSE
      ------------------------- SE O TIPO DA OPERAC?O N?O FOR NEM UM DOS TRES TIPO POSSIVEIS
      RAISE ERR_TIPO_INVALIDO; -- DISPARA O ERRO DE TIPO INVALIDO
    END IF;
    IF V_COMMIT = 'S' THEN
      COMMIT; -- EFETIVA A OPERAC?O INFORMADA, SE N?O HOUVER ERROS
    END IF;
  EXCEPTION
    ------------------------ INICIO DO BLOCO DE TRATAMENTO DE ERROS
    WHEN ERR_TEXT_NULL THEN
      -- SE OCORRER UM SUB-CODIGO NULO
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE_APPLICATION_ERROR(-20025, FNC_GET_ERROR_MSG(20025));

    WHEN ERR_PRODUTO_NULL THEN
      -- SE OCORRER UMA DESCRIC?O NULA
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE_APPLICATION_ERROR(-20044, FNC_GET_ERROR_MSG(20044));

    WHEN ERR_PRODUTO_INVALIDO THEN
      -- SE OCORRER UMA DESCRIC?O NULA
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE_APPLICATION_ERROR(-20028, FNC_GET_ERROR_MSG(20028));

    WHEN ERR_TIPO_INVALIDO THEN
      -- SE OCORRER UMA CHAMADA COM O TIPO INVALIDO
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE_APPLICATION_ERROR(-20021, FNC_GET_ERROR_MSG(20021));

    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE
  END PRC_GRAVA_PROPOSTA_MEMO;

  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PRC_GRAVA_PROPOSTA_ITEM
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 30/01/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_GRAVA_PROPOSTA_ITEM(V_PRP_CODIGO               IN PROPOSTA_ITEM.PRP_CODIGO %TYPE,
                                    V_PRI_SEQUENCIA            IN PROPOSTA_ITEM.PRI_SEQUENCIA %TYPE,
                                    V_PRO_CODIGO               IN PROPOSTA_ITEM.PRO_CODIGO %TYPE,
                                    V_PRI_TABELAVENDA          IN PROPOSTA_ITEM.PRI_TABELAVENDA %TYPE,
                                    V_PRI_QUANTIDADE           IN PROPOSTA_ITEM.PRI_QUANTIDADE %TYPE,
                                    V_PRI_UNIDADE              IN PROPOSTA_ITEM.PRI_UNIDADE %TYPE,
                                    V_PRI_DESCRICAO            IN PROPOSTA_ITEM.PRI_DESCRICAO %TYPE,
                                    V_PRI_DESCRICAOTECNICA     IN PROPOSTA_ITEM.PRI_DESCRICAOTECNICA %TYPE,
                                    V_PRI_REFERENCIA           IN PROPOSTA_ITEM.PRI_REFERENCIA %TYPE,
                                    V_PRI_DESCONTO             IN PROPOSTA_ITEM.PRI_DESCONTO %TYPE,
                                    V_PRI_VALORDESCONTO        IN PROPOSTA_ITEM.PRI_VALORDESCONTO %TYPE,
                                    V_PRI_VALORUNITARIO        IN PROPOSTA_ITEM.PRI_VALORUNITARIO %TYPE,
                                    V_PRI_VALORUNITARIOTABELA  IN PROPOSTA_ITEM.PRI_VALORUNITARIOTABELA %TYPE,
                                    V_PRI_VALORUNITARIOMAIOR   IN PROPOSTA_ITEM.PRI_VALORUNITARIOMAIOR %TYPE,
                                    V_PRI_IPI                  IN PROPOSTA_ITEM.PRI_IPI %TYPE,
                                    V_PRI_VALORIPI             IN PROPOSTA_ITEM.PRI_VALORIPI %TYPE,
                                    V_PRI_VALORTOTAL           IN PROPOSTA_ITEM.PRI_VALORTOTAL %TYPE,
                                    V_PRI_ENTREGA              IN PROPOSTA_ITEM.PRI_ENTREGA %TYPE,
                                    V_PRI_DATAENTREGA          IN PROPOSTA_ITEM.PRI_DATAENTREGA %TYPE,
                                    V_PRI_CODIGOPEDIDOCLIENTE  IN PROPOSTA_ITEM.PRI_CODIGOPEDIDOCLIENTE %TYPE,
                                    V_PRI_CODIGOPRODUTOCLIENTE IN PROPOSTA_ITEM.PRI_CODIGOPRODUTOCLIENTE %TYPE,
                                    V_PRI_CUSTO                IN PROPOSTA_ITEM.PRI_CUSTO %TYPE,
                                    V_PRI_CUSTOMEDIO           IN PROPOSTA_ITEM.PRI_CUSTOMEDIO %TYPE,
                                    V_PRI_CUSTOMARKUP          IN PROPOSTA_ITEM.PRI_CUSTOMARKUP %TYPE,
                                    V_PRI_VALORULTIMACOMPRA    IN PROPOSTA_ITEM.PRI_VALORULTIMACOMPRA %TYPE,
                                    V_PRI_PERCENTUALMARKUP     IN PROPOSTA_ITEM.PRI_PERCENTUALMARKUP %TYPE,
                                    V_PRI_TIPOIMPRESSAO        IN PROPOSTA_ITEM.PRI_TIPOIMPRESSAO %TYPE,
                                    V_PRI_MALA                 IN PROPOSTA_ITEM.PRI_MALA %TYPE DEFAULT 'C',
                                    V_PRI_TIPOMALA             IN PROPOSTA_ITEM.PRI_TIPOMALA %TYPE,
                                    V_PRI_FLAGVALE             IN PROPOSTA_ITEM.PRI_FLAGVALE %TYPE,
                                    V_PRI_USUARIO              IN PROPOSTA_ITEM.PRI_INCLUIPOR %TYPE,
                                    V_TIPO                     IN PLS_INTEGER,
                                    V_COMMIT                   IN CHAR,
                                    V_PRI_VALORICMSST          IN PROPOSTA_ITEM.PRI_VALORICMSST %TYPE,
                                    V_PRI_BASECALCULOICMSST    IN PROPOSTA_ITEM.PRI_BASECALCULOICMSST %TYPE,
                                    V_PRI_BASECALCULOICMS      IN PROPOSTA_ITEM.PRI_BASECALCULOICMS %TYPE,
                                    V_PRI_VALORICMS            IN PROPOSTA_ITEM.PRI_VALORICMS %TYPE,
                                    V_PRI_ICMSVENDA            IN PROPOSTA_ITEM.PRI_ICMSVENDA %TYPE,
                                    V_PRI_TIPOFISCAL           IN PROPOSTA_ITEM.PRI_TIPOFISCAL %TYPE,
                                    V_PRI_DESCONTOESPECIAL     IN PROPOSTA_ITEM.PRI_DESCONTOESPECIAL %TYPE,
                                    V_PRI_VALORDESCESP         IN PROPOSTA_ITEM.PRI_VALORDESCESP %TYPE,
                                    V_PRI_TIPODESC             IN PROPOSTA_ITEM.PRI_TIPODESC %TYPE,
                                    V_PRP_TRIANGULACAO         IN PROPOSTA.PRP_TRIANGULACAO%TYPE,
                                    V_PRI_TIPOVPC              IN PROPOSTA_ITEM.PRI_TIPOVPC%TYPE,
                                    V_PRI_VALORCREDVPC         IN PROPOSTA_ITEM.PRI_VALORCREDVPC%TYPE,
                                    V_PRI_PERDESCIN            IN PROPOSTA_ITEM.PRI_PERDESCIN%TYPE default 0,
                                    V_PRI_VLRDESCIN            IN PROPOSTA_ITEM.PRI_VLRDESCIN%TYPE default 0,
                                    V_PRI_ICMSDESON            IN PROPOSTA_ITEM.PRI_ICMSDESON %TYPE default 0,
                                    V_PRI_VALORFRETE           IN PROPOSTA_ITEM.PRI_VALORFRETE %TYPE default 0,
                                    V_PRI_VALOROUTRO           IN PROPOSTA_ITEM.PRI_VALOROUTRO %TYPE default 0,
                                    V_PRI_VALOR_UNITARIO_FINAL IN PROPOSTA_ITEM.PRI_VALOR_UNITARIO_FINAL %TYPE default 0,
                                    V_PRI_VALORSEMDIFAL            IN PROPOSTA_ITEM.PRI_VALORSEMDIFAL %TYPE default 0)

   IS
    V_REFERENCIA             PROPOSTA_ITEM.PRI_REFERENCIA%TYPE;
    V_ITEM                   NUMBER;
    V_PRP_SITUACAO           VARCHAR2(2);
    V_RAT_CODIGO             NUMBER;
    /*V_PRP_VALORTOTAL         NUMBER;
    V_PRP_MEDIAMARKUP        NUMBER;
    V_PRP_VALORTOTALDESCONTO NUMBER;
    V_PRP_VALORTOTALIPI      NUMBER;
    V_PRP_VALORTOTALICMS     NUMBER;
    V_PRP_VALORBASE_ST       NUMBER;
    V_PRP_VALORTOTAL_ST      NUMBER;
    V_PRP_VALORTOTALTABELA   NUMBER;
    V_PRP_OVERDESCONTO       NUMBER;
    V_PRP_ICMSDESONTOTAL     NUMBER;
    V_PRP_VALORFRETETOTAL    NUMBER;
    V_PRP_VALOROUTROTOTAL    NUMBER;
    V_PRP_VALORDESCINTOTAL   NUMBER;*/
    V_CREDITO     PROPOSTA_ITEM.PRI_VALORCREDVPC%TYPE;
    V_TIPOVPC     PROPOSTA_ITEM.PRI_TIPOVPC%TYPE;
    CREDITO_TOTAL PROPOSTA.PRP_TOTAL_CRED_VPC%TYPE;
    E_PREENCHIMENTO_OBRIGATORIO EXCEPTION;
    E_ITEM_PROPOSTA_NAO_ENCONTRADO EXCEPTION;
    contador INTEGER;
    v_Vlr_Unit   proposta_item.pri_valorunitario %type := 0;
    v_Vlr_Prod   proposta_item.pri_valortotal    %type := 0;
    v_Perc_Ipi   proposta_item.pri_ipi           %type := 0;
    v_Vlr_Ipi    proposta_item.pri_valoripi      %type := 0;
    v_Perc_Icms  proposta_item.pri_icmsvenda       %type := 0;
    v_Vlr_Icms   proposta_item.pri_valoricms       %type := 0;
    v_Base_ST    proposta_item.pri_basecalculoicmsst %type := 0;
    v_Vlr_ST     proposta_item.pri_valoricmsst       %type := 0;
    v_Vlr_DescIn proposta_item.pri_vlrdescin       %type := 0;
    v_Base_icms  proposta_item.pri_basecalculoicms  %type := 0;
    
    vFab_vpc     fabricante.fab_vpc %type := 0; 
    vFab_precvpc fabricante.fab_percvpc %type := 0;
    
    --v_Cod_TRI    proposta.prp_triangulacao  %type := 0;
    v_Retorno    varchar2(255);
    v_OwnerVenda varchar2(6);
    v_nfe_ativo  empresa.emp_nfe_ativo %type;
    v_SQL        varchar2(4000);    
    --V_CLI_CODIGO proposta.cli_codigo%type := 0;
  BEGIN
    BEGIN
      -- BUSCA PROPOSTA
      SELECT PRP.PRP_SITUACAO, PRP.RAT_CODIGO, nvl(tri.tri_ownervenda, concat('ORA', e.emp_sigla)), nvl(e.emp_nfe_ativo, 0)
        INTO V_PRP_SITUACAO, V_RAT_CODIGO, v_OwnerVenda, v_nfe_ativo
        FROM PROPOSTA PRP, TRIANGULACAO TRI, EMPRESA E
       WHERE PRP.PRP_TRIANGULACAO = TRI.TRI_CODIGO(+)
         AND PRP.PRP_CODIGO = V_PRP_CODIGO;
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        V_PRP_SITUACAO := '';
    END;

    -- Lucas/Rafael/Maicon/Fred/Eloiza 29/11/2018 -> desconto VPC proporcional quando virando faturamento MG para ES
    if (V_PRI_TIPOVPC = 5) then
      v_Vlr_DescIn := abs(v_Vlr_Prod-1);
    else
      v_Vlr_DescIn := nvl(V_PRI_VLRDESCIN, 0);
    end if;

    -- Lucas/Fred 06/07/2016 -> se Triangulação B2B, valor do IPI entra no valor total
    if /*(v_nfe_ativo = 0) and*/ (nvl(V_PRP_TRIANGULACAO, 0) = 1) then -- Strategy B2B/Licitações LMF

      if (V_PRI_TIPOVPC = 5) then
        v_Vlr_Unit := round(V_PRI_VALORUNITARIO, 4);
      else
        v_Vlr_Unit := round(V_PRI_VALORUNITARIO * round(1+(V_PRI_IPI/100), 6), 4); --> retirado o round em 04/03/2022 13:16 (bkp.: round(V_PRI_VALORUNITARIO * trunc((1+(V_PRI_IPI/100)), 4), 8))
               --cast(&V_PRI_VALORUNITARIO * (1+(&V_PRI_IPI/100)) as NUMBER(15,4)) arr_OLD_2
      end if;
      --v_Vlr_Unit := round(V_PRI_VALORUNITARIO * trunc((1+(V_PRI_IPI/100)), 2), 4);
      v_Vlr_Prod := round(v_Vlr_Unit * V_PRI_QUANTIDADE, 2);
      v_Perc_Ipi := 0;
      v_Vlr_Ipi  := 0;
      v_Perc_Icms:= 0;
      v_Vlr_Icms := 0;
      v_Base_ST  := 0; /*V_PRI_BASECALCULOICMSST;*/
      v_Vlr_ST   := 0; /*V_PRI_VALORICMSST;*/
      v_Base_icms:= 0;

      declare
        v_cod_Cli orastr.cliente.cli_codigo %type := 0;
        v_UF_Cli  orastr.cliente.cli_uf %type;
      begin
        select cli_codigo, cli_uf
          into v_cod_Cli , v_UF_Cli
          from orastr.cliente
         where cli_cnpj in (select cli.cli_cnpj
                              from cliente cli, proposta prp
                             where prp.cli_codigo = cli.cli_codigo
                               and prp.prp_codigo = V_PRP_CODIGO);

        select orastr.FNC_CALCULA_IMPOSTOS(v_cod_Cli, V_PRO_CODIGO, v_UF_Cli, /*V_PRI_QUANTIDADE, v_Vlr_Unit*/ 1, (v_Vlr_Prod - v_Vlr_DescIn), '%ICMS')
             , orastr.FNC_CALCULA_IMPOSTOS(v_cod_Cli, V_PRO_CODIGO, v_UF_Cli, /*V_PRI_QUANTIDADE, v_Vlr_Unit*/ 1, (v_Vlr_Prod - v_Vlr_DescIn), 'VALORICMS')
             , orastr.FNC_CALCULA_IMPOSTOS(v_cod_Cli, V_PRO_CODIGO, v_UF_Cli, /*V_PRI_QUANTIDADE, v_Vlr_Unit*/ 1, (v_Vlr_Prod - v_Vlr_DescIn), 'BASEST')
             , orastr.FNC_CALCULA_IMPOSTOS(v_cod_Cli, V_PRO_CODIGO, v_UF_Cli, /*V_PRI_QUANTIDADE, v_Vlr_Unit*/ 1, (v_Vlr_Prod - v_Vlr_DescIn), 'VALORST')
       , orastr.FNC_CALCULA_IMPOSTOS(v_cod_Cli, V_PRO_CODIGO, v_UF_Cli, /*V_PRI_QUANTIDADE, v_Vlr_Unit*/ 1, (v_Vlr_Prod - v_Vlr_DescIn), 'BASEICMS')
          into v_Perc_Icms, v_Vlr_Icms, v_Base_ST, v_Vlr_ST,v_Base_icms
          from dual;
        exception
          when others then
            rollback;
            raise_application_error(-20000, 'Erro no cálculo do ICMS/ICMS ST do item '||V_PRI_SEQUENCIA||'!'||chr(10)||sqlerrm);
      end;

    elsif /*(v_nfe_ativo = 0) and*/ (nvl(V_PRP_TRIANGULACAO, 0) = 2) then -- Linkmarket Licitações LMF
      v_Vlr_Unit := round(V_PRI_VALORUNITARIO * trunc((1+(V_PRI_IPI/100)), 4), 8);
      v_Vlr_Prod := round(v_Vlr_Unit * V_PRI_QUANTIDADE, 2);
      v_Perc_Ipi := 0;
      v_Vlr_Ipi  := 0;
      v_Perc_Icms:= 0;
      v_Vlr_Icms := 0;
      v_Base_ST  := 0; /*V_PRI_BASECALCULOICMSST;*/
      v_Vlr_ST   := 0; /*V_PRI_VALORICMSST;*/
      v_Base_icms:= 0;

      declare
        v_cod_Cli ORALMF.cliente.cli_codigo %type := 0;
        v_UF_Cli  ORALMF.cliente.cli_uf %type;
      begin
        select cli_codigo, cli_uf
          into v_cod_Cli , v_UF_Cli
          from ORALMF.cliente
         where cli_cnpj in (select cli.cli_cnpj
                              from cliente cli, proposta prp
                             where prp.cli_codigo = cli.cli_codigo
                               and prp.prp_codigo = V_PRP_CODIGO);

        select ORALMF.FNC_CALCULA_IMPOSTOS(v_cod_Cli, V_PRO_CODIGO, v_UF_Cli, /*V_PRI_QUANTIDADE, v_Vlr_Unit*/ 1, (v_Vlr_Prod - v_Vlr_DescIn) /*v_Vlr_Prod*/, '%ICMS')
             , ORALMF.FNC_CALCULA_IMPOSTOS(v_cod_Cli, V_PRO_CODIGO, v_UF_Cli, /*V_PRI_QUANTIDADE, v_Vlr_Unit*/ 1, (v_Vlr_Prod - v_Vlr_DescIn) /*v_Vlr_Prod*/, 'VALORICMS')
             , ORALMF.FNC_CALCULA_IMPOSTOS(v_cod_Cli, V_PRO_CODIGO, v_UF_Cli, /*V_PRI_QUANTIDADE, v_Vlr_Unit*/ 1, (v_Vlr_Prod - v_Vlr_DescIn) /*v_Vlr_Prod*/, 'BASEST')
             , ORALMF.FNC_CALCULA_IMPOSTOS(v_cod_Cli, V_PRO_CODIGO, v_UF_Cli, /*V_PRI_QUANTIDADE, v_Vlr_Unit*/ 1, (v_Vlr_Prod - v_Vlr_DescIn) /*v_Vlr_Prod*/, 'VALORST')
       , ORALMF.FNC_CALCULA_IMPOSTOS(v_cod_Cli, V_PRO_CODIGO, v_UF_Cli, /*V_PRI_QUANTIDADE, v_Vlr_Unit*/ 1, (v_Vlr_Prod - v_Vlr_DescIn) /*v_Vlr_Prod*/, 'BASEICMS')
          into v_Perc_Icms, v_Vlr_Icms, v_Base_ST, v_Vlr_ST,v_Base_icms
          from dual;
        exception
          when others then
            rollback;
            raise_application_error(-20000, 'Erro no cálculo do ICMS/ICMS ST do item '||V_PRI_SEQUENCIA||'!'||chr(10)||sqlerrm);
      end;
    else
      v_Vlr_Unit  := V_PRI_VALORUNITARIO;
      v_Vlr_Prod  := V_PRI_VALORTOTAL;
      v_Perc_Ipi  := V_PRI_IPI;
      v_Vlr_Ipi   := V_PRI_VALORIPI;
      v_Perc_Icms := V_PRI_ICMSVENDA;
      v_Vlr_Icms  := V_PRI_VALORICMS;
      v_Base_ST   := V_PRI_BASECALCULOICMSST;
      v_Vlr_ST    := V_PRI_VALORICMSST;
      v_Base_icms := V_PRI_BASECALCULOICMS;
    end if;

    IF V_TIPO = 1 THEN
      -- INCLUSAO
      IF V_PRP_CODIGO IS NULL OR -- VERIFICA COLUNAS DE PREENCHIMENTO OBRIGATORIO DETERMINADO EM CONSTRAINT
         V_PRI_SEQUENCIA IS NULL OR V_PRO_CODIGO IS NULL OR
         V_PRI_TABELAVENDA IS NULL OR V_PRI_QUANTIDADE IS NULL OR
         V_PRI_DESCRICAO IS NULL OR V_PRI_USUARIO IS NULL THEN

        RAISE E_PREENCHIMENTO_OBRIGATORIO;
      END IF;

      BEGIN
        -- ADQUIRE ULTIMO NUMERO DE ITEM OU ATRIBUI 1 (PRIMEIRO)
        SELECT MAX(PRI_ITEM)
          INTO V_ITEM
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PRP_CODIGO;

        V_ITEM := V_ITEM + 1;
      END;

      IF V_ITEM IS NULL THEN
        V_ITEM := 1;
      END IF;

      -- ACHA A REFERENCIA DO PRODUTO
      V_REFERENCIA := V_PRI_REFERENCIA;

      IF V_PRO_CODIGO > 0 THEN
        SELECT PRO.PRO_REFERENCIA, nvl(fab.fab_vpc,'N'), nvl(fab.fab_percvpc,0)
          INTO V_REFERENCIA,  vFab_vpc, vFab_precvpc 
          FROM PRODUTO PRO
          LEFT join fabricante fab on fab.fab_codigo = pro.fab_codigo
         WHERE PRO_CODIGO = V_PRO_CODIGO;
      END IF;

      -- CALCULA VALOR DE VPC NA ALTERAÇÃO
      V_TIPOVPC:=V_PRI_TIPOVPC;
      If ((V_PRI_TIPOVPC > 1) and (V_PRI_TIPOVPC <> 5)) then
         if (vFab_vpc = 'S')  and  (vFab_precvpc > 0) then
            V_CREDITO := v_Vlr_Prod * (vFab_precvpc/100);
         else
            V_CREDITO := 0;
            V_TIPOVPC := 1;
         end if;
      else
         V_CREDITO := V_PRI_VALORCREDVPC;
      end if;

      -------------------------------------------
      INSERT INTO PROPOSTA_ITEM
        (PRP_CODIGO,
         PRI_SEQUENCIA,
         PRI_ITEM,
         PRO_CODIGO,
         PRI_TABELAVENDA,
         PRI_QUANTIDADE,
         PRI_UNIDADE,
         PRI_DESCRICAO,
         PRI_DESCRICAOTECNICA,
         PRI_REFERENCIA,
         PRI_DESCONTO,
         PRI_VALORDESCONTO,
         PRI_VALORUNITARIO,
         PRI_VALORUNITARIOTABELA,
         PRI_VALORUNITARIOMAIOR,
         PRI_IPI,
         PRI_VALORIPI,
         PRI_VALORTOTAL,
         PRI_ENTREGA,
         PRI_DATAENTREGA,
         PRI_CODIGOPEDIDOCLIENTE,
         PRI_CODIGOPRODUTOCLIENTE,
         PRI_CUSTO,
         PRI_CUSTOMEDIO,
         PRI_CUSTOMARKUP,
         PRI_VALORULTIMACOMPRA,
         PRI_PERCENTUALMARKUP,
         PRI_TIPOIMPRESSAO,
         PRI_MALA,
         PRI_TIPOMALA,
         PRI_FLAGVALE,
         PRI_INCLUIDATA,
         PRI_INCLUIPOR,
         PRI_ALTERADATA,
         PRI_ALTERAPOR,
         PRI_VALORICMSST,
         PRI_BASECALCULOICMSST,
         PRI_BASECALCULOICMS,
         PRI_VALORICMS,
         PRI_ICMSVENDA,
         PRI_TIPOFISCAL,
         PRI_DESCONTOESPECIAL,
         PRI_VALORDESCESP,
         PRI_TIPODESC,
         PRI_TIPOVPC,
         PRI_VALORCREDVPC,
         PRI_PERDESCIN,
         PRI_VLRDESCIN,
         PRI_ICMSDESON,
         PRI_VALORFRETE,
         PRI_VALOROUTRO,
         PRI_VALOR_UNITARIO_FINAL,
         PRI_VALORSEMDIFAL
         )
      VALUES
        (V_PRP_CODIGO,
         V_ITEM,
         V_ITEM,
         V_PRO_CODIGO,
         V_PRI_TABELAVENDA,
         V_PRI_QUANTIDADE,
         V_PRI_UNIDADE,
         V_PRI_DESCRICAO,
         V_PRI_DESCRICAOTECNICA,
         V_REFERENCIA,
         V_PRI_DESCONTO,
         V_PRI_VALORDESCONTO,
         v_Vlr_Unit, --V_PRI_VALORUNITARIO,
         V_PRI_VALORUNITARIOTABELA,
         V_PRI_VALORUNITARIOMAIOR,
         v_Perc_Ipi, --V_PRI_IPI,
         v_Vlr_Ipi, --V_PRI_VALORIPI,
         v_Vlr_Prod, --V_PRI_VALORTOTAL,
         V_PRI_ENTREGA,
         V_PRI_DATAENTREGA,
         V_PRI_CODIGOPEDIDOCLIENTE,
         V_PRI_CODIGOPRODUTOCLIENTE,
         V_PRI_CUSTO,
         V_PRI_CUSTOMEDIO,
         V_PRI_CUSTOMARKUP,
         V_PRI_VALORULTIMACOMPRA,
         V_PRI_PERCENTUALMARKUP,
         V_PRI_TIPOIMPRESSAO,
         V_PRI_MALA,
         V_PRI_TIPOMALA,
         V_PRI_FLAGVALE,
         SYSDATE,
         V_PRI_USUARIO,
         SYSDATE,
         V_PRI_USUARIO,
         v_Vlr_ST, --V_PRI_VALORICMSST,
         v_Base_ST, --V_PRI_BASECALCULOICMSST,
         v_Base_icms,
         v_Vlr_Icms, --V_PRI_VALORICMS,
         v_Perc_Icms, --V_PRI_ICMSVENDA,
         V_PRI_TIPOFISCAL,
         V_PRI_DESCONTOESPECIAL,
         V_PRI_VALORDESCESP,
         V_PRI_TIPODESC,
         V_TIPOVPC, --V_PRI_TIPOVPC,
         V_CREDITO,
         V_PRI_PERDESCIN,
         V_PRI_VLRDESCIN, --nvl(v_Vlr_DescIn, 0)
         V_PRI_ICMSDESON,
         V_PRI_VALORFRETE,
         V_PRI_VALOROUTRO,
         V_PRI_VALOR_UNITARIO_FINAL,
         V_PRI_VALORSEMDIFAL
         );
      ------------------------------------------------------------

      SELECT COUNT(*)
        INTO contador
        FROM operacao_rma_defeito opd, operacao_rma ope
       WHERE ope.prp_codigo = V_PRP_CODIGO
         AND ope.ope_situacao != 'CA'
         AND opd.ope_codigo = ope.ope_codigo
         AND opd.ope_subcodigo = ope.ope_subcodigo
         AND opd.opd_procedimento = 7;

      /*-- movido para a Grava_Proposta evitando processamento desnecessário
      /*****************************************************************
      RECALCULA A PROPOSTA ORIGINAL
      ******************************************************************\
      SELECT SUM(PRI_VALORTOTAL),  --(SUM(PRI_VALORTOTAL) - SUM(NVL(PRI_VLRDESCIN,0))),
             SUM(PRI_PERCENTUALMARKUP),
             SUM(PRI_VALORDESCONTO),
             SUM(PRI_VALORIPI),
             SUM(PRI_VALORICMS),
             SUM(PRI_QUANTIDADE * PRI_VALORUNITARIOTABELA)
           , SUM(PRI_BASECALCULOICMSST)
           , SUM(PRI_VALORICMSST)
           , SUM(PRI_ICMSDESON)
           , SUM(PRI_VALORFRETE)
           , SUM(PRI_VALOROUTRO)
           , SUM(Pri_Vlrdescin)
        INTO V_PRP_VALORTOTAL,
             V_PRP_MEDIAMARKUP,
             V_PRP_VALORTOTALDESCONTO,
             V_PRP_VALORTOTALIPI,
             V_PRP_VALORTOTALICMS,
             V_PRP_VALORTOTALTABELA
           , V_PRP_VALORBASE_ST
           , V_PRP_VALORTOTAL_ST
           , V_PRP_ICMSDESONTOTAL
           , V_PRP_VALORFRETETOTAL
           , V_PRP_VALOROUTROTOTAL
           , V_PRP_VALORDESCINTOTAL
        FROM PROPOSTA_ITEM
       WHERE PRP_CODIGO = V_PRP_CODIGO;
      ------------------------------------------------------
      -- FAZ A MEDIA DE MARKUP
      DECLARE
        N_ITEM INTEGER;
      BEGIN
        SELECT COUNT(*)
          INTO N_ITEM
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PRP_CODIGO;
        V_PRP_MEDIAMARKUP := V_PRP_MEDIAMARKUP / N_ITEM;
      END;
      ------------------------------------------------------
      IF (V_PRP_VALORTOTAL > V_PRP_VALORTOTALTABELA) AND
         (V_PRP_VALORTOTALTABELA > 0) THEN
        V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTAL - V_PRP_VALORTOTALTABELA) /
                              V_PRP_VALORTOTAL) * 100;
      ELSIF (V_PRP_VALORTOTALTABELA > V_PRP_VALORTOTAL) AND
            (V_PRP_VALORTOTAL > 0) THEN
        V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTALTABELA - V_PRP_VALORTOTAL) /
                              V_PRP_VALORTOTALTABELA) * 100;
      END IF;


      -- ajuste Frete, se for triangulação 4-B2C consideramos o frete item a item, do contrário inserir o valor cheio direto no cabeçalho da Proposta e da NF
      if nvl(V_PRP_TRIANGULACAO, 0) != 4 then
        SELECT NVL(PRP_VALORFRETE, 0)
          into V_PRP_VALORFRETETOTAL
          FROM PROPOSTA
         WHERE PRP_CODIGO = V_PRP_CODIGO;

        UPDATE PROPOSTA
         SET PRP_VALORTOTAL         = V_PRP_VALORTOTAL,
             PRP_VALORTOTALTABELA   = V_PRP_VALORTOTALTABELA,
             PRP_VALORTOTALIPI      = V_PRP_VALORTOTALIPI,
             PRP_VALORTOTALICMS     = V_PRP_VALORTOTALICMS,
             PRP_VALORTOTALDESCONTO = V_PRP_VALORTOTALDESCONTO,
             PRP_MEDIAMARKUP        = V_PRP_MEDIAMARKUP,
             PRP_OVERDESCONTO       = V_PRP_OVERDESCONTO,
             PRP_TOTALBASECALCICMSST = V_PRP_VALORBASE_ST,
             PRP_VALORTOTALICMSST    = V_PRP_VALORTOTAL_ST,
             PRP_ICMSDESONTOTAL     = V_PRP_ICMSDESONTOTAL,
             PRP_VALORFRETE         = V_PRP_VALORFRETETOTAL,
             PRP_VALOROUTROS        = V_PRP_VALOROUTROTOTAL,
             PRP_VALORTOTALNFE      = (V_PRP_VALORTOTAL + V_PRP_VALORTOTALIPI + V_PRP_VALORTOTAL_ST
                                                        + V_PRP_VALORFRETETOTAL + V_PRP_VALOROUTROTOTAL
                                                        - V_PRP_VALORDESCINTOTAL - V_PRP_ICMSDESONTOTAL)
       WHERE PRP_CODIGO = V_PRP_CODIGO;
      else

        UPDATE PROPOSTA
           SET PRP_VALORTOTAL         = V_PRP_VALORTOTAL,
               PRP_VALORTOTALTABELA   = V_PRP_VALORTOTALTABELA,
               PRP_VALORTOTALIPI      = V_PRP_VALORTOTALIPI,
               PRP_VALORTOTALICMS     = V_PRP_VALORTOTALICMS,
               PRP_VALORTOTALDESCONTO = V_PRP_VALORTOTALDESCONTO,
               PRP_MEDIAMARKUP        = V_PRP_MEDIAMARKUP,
               PRP_OVERDESCONTO       = V_PRP_OVERDESCONTO,
               PRP_TOTALBASECALCICMSST = V_PRP_VALORBASE_ST,
               PRP_VALORTOTALICMSST    = V_PRP_VALORTOTAL_ST,
               PRP_ICMSDESONTOTAL     = V_PRP_ICMSDESONTOTAL,
               PRP_VALORFRETE         = V_PRP_VALORFRETETOTAL,
               PRP_VALOROUTROS        = V_PRP_VALOROUTROTOTAL,
               PRP_VALORTOTALNFE      = (V_PRP_VALORTOTAL + V_PRP_VALORTOTALIPI + V_PRP_VALORTOTAL_ST
                                                          + V_PRP_VALORFRETETOTAL + V_PRP_VALOROUTROTOTAL
                                                          - V_PRP_VALORDESCINTOTAL - V_PRP_ICMSDESONTOTAL)
         WHERE PRP_CODIGO = V_PRP_CODIGO;
      end if; */

      --------------------------------------------------------------------------------------------------
    ELSIF V_TIPO = 2 THEN
      -- EXCLUSAO DOS ITEM

      SELECT PRP_SITUACAO, RAT_CODIGO -- BUSCA PROPOSTA
        INTO V_PRP_SITUACAO, V_RAT_CODIGO
        FROM PROPOSTA
       WHERE PRP_CODIGO = V_PRP_CODIGO;

      IF SQL%NOTFOUND THEN
        RAISE E_ITEM_PROPOSTA_NAO_ENCONTRADO;
      END IF;

      SELECT COUNT(*)
        INTO contador
        FROM operacao_rma_defeito opd, operacao_rma ope
       WHERE ope.prp_codigo = V_PRP_CODIGO
         AND ope.ope_situacao != 'CA'
         AND opd.ope_codigo = ope.ope_codigo
         AND opd.ope_subcodigo = ope.ope_subcodigo
         AND opd.opd_procedimento = 7;

      DELETE FROM PROPOSTA_ITEM WHERE PRP_CODIGO = V_PRP_CODIGO;
      IF SQL%NOTFOUND THEN
        RAISE E_ITEM_PROPOSTA_NAO_ENCONTRADO;
      END IF;

    END IF;

    IF V_COMMIT = 'S' THEN
      COMMIT;

        SELECT SUM(T.PRI_VALORCREDVPC) INTO CREDITO_TOTAL
          FROM PROPOSTA_ITEM T
         WHERE PRP_CODIGO = V_PRP_CODIGO;

        UPDATE PROPOSTA
           SET PRP_TOTAL_CRED_VPC = CREDITO_TOTAL
         WHERE PRP_CODIGO = V_PRP_CODIGO;

      COMMIT;
    END IF;

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE_APPLICATION_ERROR(-20001, FNC_MENSAGEM_ERRO(20001));
    WHEN E_PREENCHIMENTO_OBRIGATORIO THEN
      RAISE_APPLICATION_ERROR(-20048, FNC_MENSAGEM_ERRO(20048));
    WHEN E_ITEM_PROPOSTA_NAO_ENCONTRADO THEN
      RAISE_APPLICATION_ERROR(-20050, FNC_MENSAGEM_ERRO(20050));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE

  END PRC_GRAVA_PROPOSTA_ITEM;

  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PROCEDURE PRC_CONFIRMA_PROPOSTA
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 01/02/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_CONFIRMA_PROPOSTA

  (V_PRP_CODIGO              IN PROPOSTA.PRP_CODIGO %TYPE,
   V_CPG_CODIGO              IN PROPOSTA.CPG_CODIGO %TYPE,
   V_TRA_CODIGO              IN PROPOSTA.TRA_CODIGO %TYPE,
   V_PRP_NUMEROPEDIDOCLIENTE IN PROPOSTA.PRP_NUMEROPEDIDOCLIENTE %TYPE,
   V_PRP_VALORFRETE          IN PROPOSTA.PRP_VALORFRETE %TYPE,
   V_PRP_FRETEPAGO           IN PROPOSTA.PRP_FRETEPAGO %TYPE,
   V_PRP_TIPOFATURAMENTO     IN PROPOSTA.PRP_TIPOFATURAMENTO %TYPE,
   V_PRP_TIPOENTREGA         IN PROPOSTA.PRP_TIPOENTREGA %TYPE,
   V_PRP_OBSERVACAONOTA      IN PROPOSTA.PRP_OBSERVACAONOTA %TYPE,
   V_PRP_TIPOCONFIRMACAO     IN PROPOSTA.PRP_TIPOCONFIRMACAO %TYPE,
   V_PRP_DATACONFIRMACAO     IN PROPOSTA.PRP_DATACONFIRMACAO %TYPE,
   V_PRP_ISOACEITEPEDIDO     IN PROPOSTA.PRP_ISOACEITEPEDIDO %TYPE,
   V_PRP_USUARIO             IN PROPOSTA.PRP_INCLUIPOR %TYPE,
   V_PRP_TRIANGULACAO        IN PROPOSTA.PRP_TRIANGULACAO %TYPE)

   IS
    V_LIMITE_NOTA  INTEGER;
    V_TOTAL_ITEM   INTEGER;
    V_TRAVA        INTEGER;
    V_STATUS       VARCHAR2(2);
    V_PRODUTO      PRODUTO.PRO_CODIGO%TYPE;
    V_PRP_SITUACAO PROPOSTA.PRP_SITUACAO %TYPE;
    V_CLI_CODIGO   PROPOSTA.CLI_CODIGO %TYPE;
    V_RAT_CODIGO   PROPOSTA.RAT_CODIGO %TYPE;
    V_ALTERALIM    VARCHAR2(1);
    E_SITUACAO_NAO_PENDENTE EXCEPTION;
    E_CNPJ_IE_INVALIDOS EXCEPTION;
    E_PROPOSTA_NAO_ENCONTRADA EXCEPTION;
    E_SEQUENCIA_NAO_ENCONTRADA EXCEPTION;
    E_CONDICAO_OBROGATORIO EXCEPTION;
    E_PREENCHIMENTO_OBRIGATORIO EXCEPTION;
    V_DISPONIVEL PROPOSTA_ITEM.PRI_QUANTIDADE%TYPE; --INTEGER;
    contador    INTEGER;
    V_QTD_TMP   INTEGER;
    V_ITEM_MAX  INTEGER;
    V_ITEM_MAX2 INTEGER;
    CURSOR cPropItem IS
      SELECT *
        FROM PROPOSTA_ITEM
       WHERE PRP_CODIGO = V_PRP_CODIGO
       ORDER BY PRI_ITEM;

    rPropItem cPropItem%ROWTYPE;
  BEGIN
    IF V_PRP_CODIGO IS NULL OR -- VERIFICA COLUNAS DE PREENCHIMENTO OBRIGATORIO DETERMINADO EM CONSTRAINT
       V_CPG_CODIGO IS NULL OR
      --        V_TRA_CODIGO     IS NULL OR
       V_PRP_USUARIO IS NULL THEN

      RAISE E_PREENCHIMENTO_OBRIGATORIO;
    END IF;

    SELECT COUNT(*)
      INTO contador
      FROM operacao_rma_defeito opd, operacao_rma ope
     WHERE ope.prp_codigo = V_PRP_CODIGO
       AND ope.ope_situacao != 'CA'
       AND opd.ope_codigo = ope.ope_codigo
       AND opd.ope_subcodigo = ope.ope_subcodigo
       AND opd.opd_procedimento = 7;

    SELECT PRP_SITUACAO, RAT_CODIGO -- BUSCA PROPOSTA
      INTO V_PRP_SITUACAO, V_RAT_CODIGO
      FROM PROPOSTA
     WHERE PRP_CODIGO = V_PRP_CODIGO;

    IF SQL%NOTFOUND THEN
      RAISE E_PROPOSTA_NAO_ENCONTRADA;
    END IF;

    IF V_PRP_SITUACAO = 'PN' THEN
      -- SO CONFIRMA PROPOSTAS PENDENTES
      BEGIN
        SELECT CLI_CODIGO -- VERIFICA SE CLIENTE EXISTE
          INTO V_CLI_CODIGO
          FROM PROPOSTA

         WHERE PRP_CODIGO = V_PRP_CODIGO;

      EXCEPTION
        -- SE CLIENTE NAO EXISTE
        WHEN NO_DATA_FOUND THEN
          RAISE_APPLICATION_ERROR(-20001, FNC_MENSAGEM_ERRO(20001));
        WHEN E_CNPJ_IE_INVALIDOS THEN
          RAISE_APPLICATION_ERROR(-20051, FNC_MENSAGEM_ERRO(20051));
      END;
      /*****************************************************
      PROCESSA A CONFIRMAC?O DA PROPOSTA
      ******************************************************/
      -- PROCURA LIMITE DA NOTA
      V_LIMITE_NOTA := TO_NUMBER(FNC_BUSCAREGRA('PROPOSTA',
                                                'DIVIDE_PROPOSTA_NOTA'));

      -- BUSCA TOTAL DE ITENS DA PROPOSTA
      BEGIN
        --           SELECT COUNT(*) INTO V_TOTAL_ITEM FROM PROPOSTA_ITEM WHERE PRP_CODIGO=V_PRP_CODIGO;
        --Esse cursor seguido de um select multiplica a quantidade de cada item da proposta pela
        --quantidade de itens do KIT para saber o total de itens que vai sair na Nota Fiscal
        --Em V_ITEM_MAX e armazenado o maior item suportado na nota
        V_TOTAL_ITEM := 0;
        V_ITEM_MAX   := 0;
        FOR rPropItem IN cPropItem LOOP
          SELECT DECODE(COUNT(*), 0, 1, COUNT(*))
            INTO V_QTD_TMP
            FROM PRODUTO_KIT
           WHERE PRO_CODIGO = rPropItem.PRO_CODIGO;
          V_TOTAL_ITEM := V_TOTAL_ITEM + V_QTD_TMP;
          IF V_TOTAL_ITEM <= V_LIMITE_NOTA THEN
            --Pega o maior item suportado na nota contando com os itens do KIT
            V_ITEM_MAX := rPropItem.PRI_ITEM;
          END IF;
        END LOOP;
      EXCEPTION
        WHEN NO_DATA_FOUND THEN
          V_TOTAL_ITEM := 0;
      END;
      ----- VERIFICA SE TEM ITEM DE MALA
      -- DECLARE
      --    V_MALA  INTEGER;
      -- BEGIN
      --    SELECT COUNT(*) INTO V_MALA
      --    FROM PROPOSTA_ITEM
      --    WHERE PRP_CODIGO=V_PRP_CODIGO
      --      AND PRI_MALA IN ('M','I');

      --    IF V_MALA>0 THEN
      --       V_TOTAL_ITEM:=0;
      --    END IF;
      -- END;

      ---------------------------------------------------
      -- TRAVA A PROPOSTA
      --V_TRAVA := -1;
      --WHILE V_TRAVA < 0 LOOP
      --  V_TRAVA := FNC_TRAVA_LINHA('SELECT PRP_CODIGO FROM PROPOSTA WHERE PRP_CODIGO=' ||
      --                             TO_CHAR(V_PRP_CODIGO),
      --                             2);
      --END LOOP;
      --
      -- GRAVA CONFIRMACAO NA PROPOSTA
      --IF V_PRP_TIPOFATURAMENTO='V' THEN
      --   V_STATUS:='VL';
      --ELSE
      V_STATUS := 'OK';
      --END IF;

      UPDATE PROPOSTA
         SET PRP_SITUACAO            = V_STATUS,
             PRP_DATACONFIRMACAO     = V_PRP_DATACONFIRMACAO,
             CPG_CODIGO              = V_CPG_CODIGO,
             TRA_CODIGO              = V_TRA_CODIGO,
             PRP_OBSERVACAONOTA      = V_PRP_OBSERVACAONOTA,
             PRP_VALORFRETE          = V_PRP_VALORFRETE,
             PRP_FRETEPAGO           = V_PRP_FRETEPAGO,
             PRP_TIPOFATURAMENTO     = V_PRP_TIPOFATURAMENTO,
             PRP_TIPOENTREGA         = V_PRP_TIPOENTREGA,
             PRP_NUMEROPEDIDOCLIENTE = V_PRP_NUMEROPEDIDOCLIENTE,
             PRP_ALTERADATA          = SYSDATE,
             PRP_ALTERAPOR           = V_PRP_USUARIO,
             PRP_TIPOCONFIRMACAO     = V_PRP_TIPOCONFIRMACAO,
             PRP_ISOACEITEPEDIDO     = V_PRP_ISOACEITEPEDIDO,
             PRP_TRIANGULACAO        = V_PRP_TRIANGULACAO
       WHERE PRP_CODIGO = V_PRP_CODIGO;

      -- GRAVA RESERVA DE VENDA NO CADASTRO DE PRODUTOS
      DECLARE
        CURSOR CUR_ITEMS IS
          SELECT PRO_CODIGO, PRI_QUANTIDADE, PRI_FLAGVALE, PRI_REFERENCIA
            FROM PROPOSTA_ITEM
           WHERE PRP_CODIGO = V_PRP_CODIGO
             AND (PRI_MALA <> 'M' OR PRI_MALA IS NULL);

        REC_ITEMS CUR_ITEMS%ROWTYPE;
      BEGIN
        FOR REC_ITEMS IN CUR_ITEMS LOOP
          IF REC_ITEMS.PRI_FLAGVALE IS NULL THEN
            ----------------------------------------------------------
            -- VERIFICA SE O PRODUTO EXISTE
            ----------------------------------------------------------
            BEGIN
              SELECT PRO_CODIGO
                INTO V_PRODUTO
                FROM PRODUTO
               WHERE PRO_CODIGO = REC_ITEMS.PRO_CODIGO;
            EXCEPTION
              WHEN NO_DATA_FOUND THEN
                RAISE_APPLICATION_ERROR(-20028, FNC_MENSAGEM_ERRO(20028));
            END;
            ----------------------------------------------------------
            -- TRAVA O PRODUTO
            --V_TRAVA := -1;
            --WHILE V_TRAVA < 0 LOOP
            --  V_TRAVA := FNC_TRAVA_LINHA('SELECT PRO_CODIGO FROM PRODUTO WHERE PRO_CODIGO=' ||
            --                             TO_CHAR(REC_ITEMS.PRO_CODIGO),
            --                             2);
            --END LOOP;

            UPDATE PRODUTO
               SET PRO_DATAULTIMAPROPOSTA = TO_DATE(TO_CHAR(SYSDATE))
             WHERE (PRO_CODIGO = REC_ITEMS.PRO_CODIGO);

            -- Checa Saldo da Proposta Qdo for da Web
           -- If V_PRP_ISOACEITEPEDIDO = 'W' Then -- Via Sistema Web , utilizei esse parametropara ganhar tempo
               BEGIN
                 SELECT DISPONIVEL
                   INTO V_DISPONIVEL
                   FROM V$_ESTOQUE_RATEIO --V$_ESTOQUE_RATEIO_COMERCIAL
                  WHERE PRO_CODIGO = REC_ITEMS.PRO_CODIGO
                    AND RAT_CODIGO = V_RAT_CODIGO;
                 EXCEPTION
                   WHEN NO_DATA_FOUND THEN
                     V_DISPONIVEL := -1;
               END;

                /*--IF V_DISPONIVEL <  REC_ITEMS.PRI_QUANTIDADE THEN
                obs.: como após o Trava_Linha V_STATUS := 'OK' e update proposta executado acima, então nesse momento
                     que é feita a checagem de estoque a proposta não está mais "PN" na sessão, logo o saldo
                     da proposta já é considerado como "Reservado" pela V$_ESTOQUE_RATEIO_COMERCIAL, por isso está somando pri_qtde*/
                IF (V_DISPONIVEL+REC_ITEMS.PRI_QUANTIDADE) <  REC_ITEMS.PRI_QUANTIDADE THEN
                   RAISE_APPLICATION_ERROR (-20028, 'EXISTEM PRODUTOS SEM SALDO EM ESTOQUE. REFERENCIA:' || REC_ITEMS.PRI_REFERENCIA);
                END IF;
           -- end if;
          END IF;
        END LOOP;
      END;
      COMMIT;

      IF (V_PRP_TIPOFATURAMENTO = 'F') AND (V_TOTAL_ITEM > V_LIMITE_NOTA) AND
         (V_LIMITE_NOTA > 0) THEN
        -- DIVIDE PARA FATURAMENTO
        DECLARE
          V_PRP_VALORTOTAL         PROPOSTA.PRP_VALORTOTAL%TYPE;
          V_PRP_VALORTOTALTABELA   PROPOSTA.PRP_VALORTOTALTABELA%TYPE;
          V_PRP_VALORTOTALIPI      PROPOSTA.PRP_VALORTOTALIPI%TYPE;
          V_PRP_VALORTOTALDESCONTO PROPOSTA.PRP_VALORTOTALDESCONTO%TYPE;
          V_PRP_MEDIAMARKUP        PROPOSTA.PRP_MEDIAMARKUP%TYPE;
          V_PRP_OVERDESCONTO       PROPOSTA.PRP_OVERDESCONTO%TYPE;
          V_NOVAPROPOSTA           PROPOSTA.PRP_CODIGO%TYPE;
          V_ITEM                   PROPOSTA_ITEM.PRI_ITEM%TYPE;
          V_TRAVA                  INTEGER;

          CURSOR CUR_ITEMS IS
            SELECT *
              FROM PROPOSTA_ITEM
             WHERE (PRP_CODIGO = V_PRP_CODIGO)
               AND (PRI_ITEM > V_ITEM_MAX);

          REC_ITEMS CUR_ITEMS%ROWTYPE;
        BEGIN
          -- TRAVA A PROPOSTA
          --V_TRAVA := -1;
          --WHILE V_TRAVA < 0 LOOP
          --  V_TRAVA := FNC_TRAVA_LINHA('SELECT PRP_CODIGO FROM PROPOSTA WHERE PRP_CODIGO=' ||
          --                             TO_CHAR(V_PRP_CODIGO),
          --                             2);
          --END LOOP;
          --
          V_NOVAPROPOSTA := V_PRP_CODIGO;
          V_ITEM         := 0;
          V_ITEM_MAX2    := 0;
          /*****************************************************************
          GERA O ITEM NA NOVA PROPOSTA_ITEM
          ******************************************************************/
          FOR REC_ITEMS IN CUR_ITEMS LOOP
            IF V_ITEM = 0 THEN
              -- GERA O CABECALHO
              PRC_COPIA_CABECALHO(V_NOVAPROPOSTA, V_PRP_CODIGO);
            END IF;
            -- GERA OS ITENS
            V_ITEM := V_ITEM + 1;
            --SOMANDO A QUANTIDADE TOTAL DE ITENS MULTIPLICADO PELA QUANTIDADE DE ITENS DE CADA KIT PARA SABER O TOTAL
            --REAL QUE SERA IMPRESSO EM CADA NOTA FISCAL
            SELECT DECODE(COUNT(*), 0, 1, COUNT(*))
              INTO V_QTD_TMP
              FROM PRODUTO_KIT
             WHERE PRO_CODIGO = REC_ITEMS.PRO_CODIGO;
            V_ITEM_MAX2 := V_ITEM_MAX2 + V_QTD_TMP;

            INSERT INTO PROPOSTA_ITEM
              (PRP_CODIGO,
               PRI_SEQUENCIA,
               PRI_ITEM,
               PRO_CODIGO,
               PRI_TABELAVENDA,
               PRI_QUANTIDADE,
               PRI_UNIDADE,
               PRI_DESCRICAO,
               PRI_DESCRICAOTECNICA,
               PRI_REFERENCIA,
               PRI_DESCONTO,
               PRI_VALORDESCONTO,
               PRI_VALORUNITARIO,
               PRI_VALORUNITARIOTABELA,
               PRI_VALORUNITARIOMAIOR,
               PRI_VALORIPI,
               PRI_VALORTOTAL,
               PRI_ENTREGA,
               PRI_DATAENTREGA,
               PRI_CODIGOPRODUTOCLIENTE,
               PRI_CUSTO,
               PRI_CUSTOMEDIO,
               PRI_VALORULTIMACOMPRA,
               PRI_PERCENTUALMARKUP,
               PRI_TIPOIMPRESSAO,
               PRI_CODIGOPEDIDOCLIENTE,
               PRI_INCLUIDATA,
               PRI_IPI,
               PRI_INCLUIPOR,
               PRI_ALTERADATA,
               PRI_ALTERAPOR)
            VALUES
              (V_NOVAPROPOSTA,
               V_ITEM,
               V_ITEM,
               REC_ITEMS.PRO_CODIGO,
               REC_ITEMS.PRI_TABELAVENDA,
               REC_ITEMS.PRI_QUANTIDADE,
               REC_ITEMS.PRI_UNIDADE,
               REC_ITEMS.PRI_DESCRICAO,
               REC_ITEMS.PRI_DESCRICAOTECNICA,
               REC_ITEMS.PRI_REFERENCIA,
               REC_ITEMS.PRI_DESCONTO,
               REC_ITEMS.PRI_VALORDESCONTO,
               REC_ITEMS.PRI_VALORUNITARIO,
               REC_ITEMS.PRI_VALORUNITARIOTABELA,
               REC_ITEMS.PRI_VALORUNITARIOMAIOR,
               REC_ITEMS.PRI_VALORIPI,
               REC_ITEMS.PRI_VALORTOTAL,
               REC_ITEMS.PRI_ENTREGA,
               REC_ITEMS.PRI_DATAENTREGA,
               REC_ITEMS.PRI_CODIGOPRODUTOCLIENTE,
               REC_ITEMS.PRI_CUSTO,
               REC_ITEMS.PRI_CUSTOMEDIO,
               REC_ITEMS.PRI_VALORULTIMACOMPRA,
               REC_ITEMS.PRI_PERCENTUALMARKUP,
               REC_ITEMS.PRI_TIPOIMPRESSAO,
               REC_ITEMS.PRI_CODIGOPEDIDOCLIENTE,
               REC_ITEMS.PRI_INCLUIDATA,
               REC_ITEMS.PRI_IPI,
               REC_ITEMS.PRI_INCLUIPOR,
               REC_ITEMS.PRI_ALTERADATA,
               REC_ITEMS.PRI_ALTERAPOR);
            --Se ainda existir outro item alem do cursor atual, verifica se a soma dos itens de kit
            --n?o ultrapassa a quantidade permitida na nota fiscal
            IF CUR_ITEMS%ROWCOUNT > (REC_ITEMS.PRI_ITEM - V_ITEM_MAX2) THEN
              SELECT DECODE(COUNT(*), 0, 1, COUNT(*))
                INTO V_QTD_TMP
                FROM PRODUTO_KIT
               WHERE PRO_CODIGO = (SELECT PRO_CODIGO
                                     FROM PROPOSTA_ITEM
                                    WHERE PRP_CODIGO = V_PRP_CODIGO
                                      AND PRI_ITEM > REC_ITEMS.PRI_ITEM
                                      AND ROWNUM = 1);
            END IF;
            --Se ja atingiu o total de itens suportado na nota ou se o proximo item for
            --estrapolar a quantidade permitida, ent?o gera nova proposta
            IF ((V_ITEM_MAX2 + V_QTD_TMP) > V_LIMITE_NOTA) OR
               (V_ITEM_MAX2 = V_LIMITE_NOTA) THEN
              V_ITEM      := 0;
              V_ITEM_MAX2 := 0;
              /*****************************************************************
              RECALCULA A PROPOSTA
              ******************************************************************/
              SELECT SUM(PRI_VALORTOTAL),
                     SUM(PRI_PERCENTUALMARKUP),
                     SUM(PRI_VALORDESCONTO),
                     SUM(PRI_VALORIPI),
                     SUM(PRI_QUANTIDADE * PRI_VALORUNITARIOTABELA)
                INTO V_PRP_VALORTOTAL,
                     V_PRP_MEDIAMARKUP,
                     V_PRP_VALORTOTALDESCONTO,
                     V_PRP_VALORTOTALIPI,
                     V_PRP_VALORTOTALTABELA
                FROM PROPOSTA_ITEM
               WHERE PRP_CODIGO = V_NOVAPROPOSTA;
              ------------------------------------------------------
              -- FAZ A MEDIA DE MARKUP
              DECLARE
                N_ITEM INTEGER;
              BEGIN
                SELECT COUNT(*)
                  INTO N_ITEM
                  FROM PROPOSTA_ITEM
                 WHERE PRP_CODIGO = V_NOVAPROPOSTA;
                V_PRP_MEDIAMARKUP := V_PRP_MEDIAMARKUP / N_ITEM;
              END;
              ------------------------------------------------------
              IF (V_PRP_VALORTOTAL > V_PRP_VALORTOTALTABELA) AND
                 (V_PRP_VALORTOTALTABELA > 0) THEN
                V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTAL -
                                      V_PRP_VALORTOTALTABELA) /
                                      V_PRP_VALORTOTAL) * 100;
              ELSIF (V_PRP_VALORTOTALTABELA > V_PRP_VALORTOTAL) AND
                    (V_PRP_VALORTOTAL > 0) THEN
                V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTALTABELA -
                                      V_PRP_VALORTOTAL) /
                                      V_PRP_VALORTOTALTABELA) * 100;
              END IF;

              UPDATE PROPOSTA
                 SET PRP_VALORTOTAL         = V_PRP_VALORTOTAL,
                     PRP_VALORTOTALTABELA   = V_PRP_VALORTOTALTABELA,
                     PRP_VALORTOTALIPI      = V_PRP_VALORTOTALIPI,
                     PRP_VALORTOTALDESCONTO = V_PRP_VALORTOTALDESCONTO,
                     PRP_MEDIAMARKUP        = V_PRP_MEDIAMARKUP,
                     PRP_OVERDESCONTO       = V_PRP_OVERDESCONTO
               WHERE PRP_CODIGO = V_NOVAPROPOSTA;
            END IF;
          END LOOP;

          /*****************************************************************
          RECALCULA A PROPOSTA OS ULTIMOS ITEMS NA SAIDA DO FOR
          ******************************************************************/
          SELECT SUM(PRI_VALORTOTAL),
                 SUM(PRI_PERCENTUALMARKUP),
                 SUM(PRI_VALORDESCONTO),
                 SUM(PRI_VALORIPI),
                 SUM(PRI_QUANTIDADE * PRI_VALORUNITARIOTABELA)
            INTO V_PRP_VALORTOTAL,
                 V_PRP_MEDIAMARKUP,
                 V_PRP_VALORTOTALDESCONTO,
                 V_PRP_VALORTOTALIPI,
                 V_PRP_VALORTOTALTABELA
            FROM PROPOSTA_ITEM
           WHERE PRP_CODIGO = V_NOVAPROPOSTA;
          ------------------------------------------------------
          -- FAZ A MEDIA DE MARKUP
          DECLARE
            N_ITEM INTEGER;
          BEGIN
            SELECT COUNT(*)
              INTO N_ITEM
              FROM PROPOSTA_ITEM
             WHERE PRP_CODIGO = V_NOVAPROPOSTA;
            V_PRP_MEDIAMARKUP := V_PRP_MEDIAMARKUP / N_ITEM;
          END;
          ------------------------------------------------------
          IF (V_PRP_VALORTOTAL > V_PRP_VALORTOTALTABELA) AND
             (V_PRP_VALORTOTALTABELA > 0) THEN
            V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTAL -
                                  V_PRP_VALORTOTALTABELA) /
                                  V_PRP_VALORTOTAL) * 100;
          ELSIF (V_PRP_VALORTOTALTABELA > V_PRP_VALORTOTAL) AND
                (V_PRP_VALORTOTAL > 0) THEN
            V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTALTABELA -
                                  V_PRP_VALORTOTAL) /
                                  V_PRP_VALORTOTALTABELA) * 100;
          END IF;
          UPDATE PROPOSTA
             SET PRP_VALORTOTAL         = V_PRP_VALORTOTAL,
                 PRP_VALORTOTALTABELA   = V_PRP_VALORTOTALTABELA,
                 PRP_VALORTOTALIPI      = V_PRP_VALORTOTALIPI,
                 PRP_VALORTOTALDESCONTO = V_PRP_VALORTOTALDESCONTO,
                 PRP_MEDIAMARKUP        = V_PRP_MEDIAMARKUP,
                 PRP_OVERDESCONTO       = V_PRP_OVERDESCONTO
           WHERE PRP_CODIGO = V_NOVAPROPOSTA;
          /*****************************************************************
          DELETE ITEM NA PROPOSTA_ITEM, OS FORA DO LIMITE DA NOTA
          ******************************************************************/
          DELETE FROM PROPOSTA_ITEM
           WHERE (PRP_CODIGO = V_PRP_CODIGO)
             AND (PRI_ITEM > V_ITEM_MAX);
          /*****************************************************************
          RECALCULA A PROPOSTA ORIGINAL
          ******************************************************************/
          SELECT SUM(PRI_VALORTOTAL),
                 SUM(PRI_PERCENTUALMARKUP),
                 SUM(PRI_VALORDESCONTO),
                 SUM(PRI_VALORIPI),
                 SUM(PRI_QUANTIDADE * PRI_VALORUNITARIOTABELA)
            INTO V_PRP_VALORTOTAL,
                 V_PRP_MEDIAMARKUP,
                 V_PRP_VALORTOTALDESCONTO,
                 V_PRP_VALORTOTALIPI,
                 V_PRP_VALORTOTALTABELA
            FROM PROPOSTA_ITEM
           WHERE PRP_CODIGO = V_PRP_CODIGO;
          ------------------------------------------------------
          -- FAZ A MEDIA DE MARKUP
          DECLARE
            N_ITEM INTEGER;
          BEGIN
            SELECT COUNT(*)
              INTO N_ITEM
              FROM PROPOSTA_ITEM
             WHERE PRP_CODIGO = V_PRP_CODIGO;
            V_PRP_MEDIAMARKUP := V_PRP_MEDIAMARKUP / N_ITEM;
          END;
          ------------------------------------------------------
          IF (V_PRP_VALORTOTAL > V_PRP_VALORTOTALTABELA) AND
             (V_PRP_VALORTOTALTABELA > 0) THEN
            V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTAL -
                                  V_PRP_VALORTOTALTABELA) /
                                  V_PRP_VALORTOTAL) * 100;
          ELSIF (V_PRP_VALORTOTALTABELA > V_PRP_VALORTOTAL) AND
                (V_PRP_VALORTOTAL > 0) THEN
            V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTALTABELA -
                                  V_PRP_VALORTOTAL) /
                                  V_PRP_VALORTOTALTABELA) * 100;
          END IF;
          UPDATE PROPOSTA
             SET PRP_VALORTOTAL         = V_PRP_VALORTOTAL,
                 PRP_VALORTOTALTABELA   = V_PRP_VALORTOTALTABELA,
                 PRP_VALORTOTALIPI      = V_PRP_VALORTOTALIPI,
                 PRP_VALORTOTALDESCONTO = V_PRP_VALORTOTALDESCONTO,
                 PRP_MEDIAMARKUP        = V_PRP_MEDIAMARKUP,
                 PRP_OVERDESCONTO       = V_PRP_OVERDESCONTO
           WHERE PRP_CODIGO = V_PRP_CODIGO;
          --------------------------------------------------------------------------------------------------
        END;

       -- VALIDA ALTERAÇÃO DO LIMITE DE CREDITO
       BEGIN
          SELECT PRT_CONSTALIM
            INTO V_ALTERALIM
            FROM PROPOSTA F, PORTADOR P
           WHERE F.PRT_CODIGO = P.PRT_CODIGO
            AND F.PRP_CODIGO  = V_PRP_CODIGO;
       EXCEPTION
           WHEN NO_DATA_FOUND THEN
                V_ALTERALIM := 'N';
        END;

       IF V_ALTERALIM = 'S' THEN
          PRC_ATUALIZA_DEBITO_CLIENTE(V_CLI_CODIGO);
       END IF;

        PRC_ATUALIZA_TOTAL_CRED_VPC(V_PRP_CODIGO, 'S'); --COMMIT;
      END IF;
    ELSE
      RAISE E_SITUACAO_NAO_PENDENTE;
    END IF;

    pck_sysope.PRC_TMP_TRANSFERE(V_PRP_CODIGO, 'S'); -- add V_COMMIT tratamento Sol Fatura em duplicidade

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE_APPLICATION_ERROR(-20038, FNC_MENSAGEM_ERRO(20038));
    WHEN E_PREENCHIMENTO_OBRIGATORIO THEN
      RAISE_APPLICATION_ERROR(-20048, FNC_MENSAGEM_ERRO(20048));
    WHEN E_PROPOSTA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20050, FNC_MENSAGEM_ERRO(20050));
    WHEN E_SITUACAO_NAO_PENDENTE THEN
      -- SE PROPOSTA NAO FOR PENDENTE
      RAISE_APPLICATION_ERROR(-20037, FNC_MENSAGEM_ERRO(20037));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE
  END PRC_CONFIRMA_PROPOSTA;

  PROCEDURE PRC_CONFIRMA_DIVISAO(V_PRP_CODIGO IN PROPOSTA.PRP_CODIGO %TYPE)
  --------------------------------------------------------------------------------
    -- OWNER       : INGRAF INFORMATICA LTDA
    -- ID          : PRC_DIVIDE_PROPOSTA
    -- AUTOR       : CARLOS
    -- CRIADO EM   : 09/02/2001
    -- ALTERADO POR:
    -- ALTERADO EM :
    -- OBSERVACOES :
    --------------------------------------------------------------------------------
   IS
    V_ITEM INTEGER;
  BEGIN
    /*****************************************************************
     RECALCULA ITENS EM PROPOSTA_ITEM ( PROPOSTA ORIGINAL )
    ******************************************************************/
    UPDATE PROPOSTA_ITEM SET PRI_ITEM = 0 WHERE PRP_CODIGO = V_PRP_CODIGO;
    DECLARE
      CURSOR CUR_RECONTA IS
        SELECT PRP_CODIGO, PRI_SEQUENCIA
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PRP_CODIGO;
      REC_RECONTA CUR_RECONTA%ROWTYPE;
    BEGIN
      -- ADQUIRE ULTIMO NUMERO DE ITEM OU ATRIBUI 1 (PRIMEIRO)
      V_ITEM := 0;
      FOR REC_RECONTA IN CUR_RECONTA LOOP
        V_ITEM := V_ITEM + 1;
        UPDATE PROPOSTA_ITEM
           SET PRI_ITEM = V_ITEM
         WHERE PRP_CODIGO = V_PRP_CODIGO
           AND PRI_SEQUENCIA = REC_RECONTA.PRI_SEQUENCIA;
      END LOOP;
      UPDATE PROPOSTA_ITEM
         SET PRI_SEQUENCIA = PRI_ITEM
       WHERE PRP_CODIGO = V_PRP_CODIGO;
    END;
    COMMIT;
  END PRC_CONFIRMA_DIVISAO;
  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PRC_DIVIDE_PROPOSTA
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 09/02/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_DIVIDE_PROPOSTA(V_PRP_CODIGO               IN PROPOSTA_ITEM.PRP_CODIGO %TYPE,
                                V_PRI_SEQUENCIA            IN PROPOSTA_ITEM.PRI_SEQUENCIA %TYPE,
                                V_PRO_CODIGO               IN PROPOSTA_ITEM.PRO_CODIGO %TYPE,
                                V_PRI_TABELAVENDA          IN PROPOSTA_ITEM.PRI_TABELAVENDA %TYPE,
                                V_PRI_QUANTIDADE           IN PROPOSTA_ITEM.PRI_QUANTIDADE %TYPE,
                                V_PRI_UNIDADE              IN PROPOSTA_ITEM.PRI_UNIDADE %TYPE,
                                V_PRI_DESCRICAO            IN PROPOSTA_ITEM.PRI_DESCRICAO %TYPE,
                                V_PRI_DESCRICAOTECNICA     IN PROPOSTA_ITEM.PRI_DESCRICAOTECNICA %TYPE,
                                V_PRI_REFERENCIA           IN PROPOSTA_ITEM.PRI_REFERENCIA %TYPE,
                                V_PRI_DESCONTO             IN PROPOSTA_ITEM.PRI_DESCONTO %TYPE,
                                V_PRI_VALORDESCONTO        IN PROPOSTA_ITEM.PRI_VALORDESCONTO %TYPE,
                                V_PRI_VALORUNITARIO        IN PROPOSTA_ITEM.PRI_VALORUNITARIO %TYPE,
                                V_PRI_VALORUNITARIOTABELA  IN PROPOSTA_ITEM.PRI_VALORUNITARIOTABELA %TYPE,
                                V_PRI_VALORUNITARIOMAIOR   IN PROPOSTA_ITEM.PRI_VALORUNITARIOMAIOR %TYPE,
                                V_PRI_IPI                  IN PROPOSTA_ITEM.PRI_IPI %TYPE,
                                V_PRI_VALORIPI             IN PROPOSTA_ITEM.PRI_VALORIPI %TYPE,
                                V_PRI_VALORTOTAL           IN PROPOSTA_ITEM.PRI_VALORTOTAL %TYPE,
                                V_PRI_ENTREGA              IN PROPOSTA_ITEM.PRI_ENTREGA %TYPE,
                                V_PRI_DATAENTREGA          IN PROPOSTA_ITEM.PRI_DATAENTREGA %TYPE,
                                V_PRI_CODIGOPEDIDOCLIENTE  IN PROPOSTA_ITEM.PRI_CODIGOPEDIDOCLIENTE %TYPE,
                                V_PRI_CODIGOPRODUTOCLIENTE IN PROPOSTA_ITEM.PRI_CODIGOPRODUTOCLIENTE %TYPE,
                                V_PRI_CUSTO                IN PROPOSTA_ITEM.PRI_CUSTO %TYPE,
                                V_PRI_CUSTOMEDIO           IN PROPOSTA_ITEM.PRI_CUSTOMEDIO %TYPE,
                                V_PRI_CUSTOMARKUP          IN PROPOSTA_ITEM.PRI_CUSTOMARKUP %TYPE,
                                V_PRI_VALORULTIMACOMPRA    IN PROPOSTA_ITEM.PRI_VALORULTIMACOMPRA %TYPE,
                                V_PRI_PERCENTUALMARKUP     IN PROPOSTA_ITEM.PRI_PERCENTUALMARKUP %TYPE,
                                V_PRI_TIPOIMPRESSAO        IN PROPOSTA_ITEM.PRI_TIPOIMPRESSAO %TYPE,
                                V_PRI_MALA                 IN PROPOSTA_ITEM.PRI_MALA %TYPE,
                                V_PRI_TIPOMALA             IN PROPOSTA_ITEM.PRI_TIPOMALA %TYPE,
                                V_PRI_USUARIO              IN PROPOSTA_ITEM.PRI_INCLUIPOR %TYPE,
                                V_PROXIMAPROPOSTA          IN OUT NUMBER)

   IS
    V_ITEM         NUMBER;
    V_PRP_SITUACAO PROPOSTA.PRP_SITUACAO %TYPE;
    E_SITUACAO_NAO_PENDENTE EXCEPTION;
    E_PREENCHIMENTO_OBRIGATORIO EXCEPTION;
    E_SEQUENCIA_NAO_ENCONTRADA EXCEPTION;
    E_PROPOSTA_NAO_ENCONTRADA EXCEPTION;
  BEGIN
    IF V_PRP_CODIGO IS NULL OR -- VERIFICA COLUNAS DE PREENCHIMENTO OBRIGATORIO DETERMINADO EM CONSTRAINT
       V_PRI_SEQUENCIA IS NULL OR V_PRO_CODIGO IS NULL OR
       V_PRI_TABELAVENDA IS NULL OR V_PRI_QUANTIDADE IS NULL OR
       V_PRI_DESCRICAO IS NULL OR V_PRI_USUARIO IS NULL THEN
      RAISE E_PREENCHIMENTO_OBRIGATORIO;
    END IF;

    SELECT PRP_SITUACAO -- BUSCA PROPOSTA
      INTO V_PRP_SITUACAO
      FROM PROPOSTA
     WHERE PRP_CODIGO = V_PRP_CODIGO;

    IF SQL%NOTFOUND THEN
      RAISE E_PROPOSTA_NAO_ENCONTRADA;
    END IF;

    IF V_PRP_SITUACAO IN ('PN', 'OK') THEN
      -- SO CONFIRMA PROPOSTAS PENDENTES
      /*****************************************************************
       GERA NOVO NUMERO DA PROPOSTA DIVIDIDA
      ******************************************************************/
      IF V_PROXIMAPROPOSTA IS NULL THEN
        SELECT SQN_PROPOSTA.NEXTVAL -- ATRIBUI NOVO NUMERO DE PROPOSTA A VARIAVEL
          INTO V_PROXIMAPROPOSTA
          FROM DUAL;
        IF SQL%NOTFOUND THEN
          RAISE E_SEQUENCIA_NAO_ENCONTRADA;
        END IF;
        /*****************************************************************
         GERA NOVA PROPOSTA COM A DIVIS?O
        ******************************************************************/
        DECLARE
          CURSOR CUR_PROPOSTA IS
            SELECT * FROM PROPOSTA WHERE PRP_CODIGO = V_PRP_CODIGO;
          REC_PROPOSTA CUR_PROPOSTA%ROWTYPE;
        BEGIN
          FOR REC_PROPOSTA IN CUR_PROPOSTA LOOP
            INSERT INTO PROPOSTA
              (PRP_CODIGO,
               RAT_CODIGO,
               CLI_CODIGO,
               ORI_CODIGO,
               TRA_CODIGO,
               CPG_CODIGO,
               END_CODIGO,
               PTP_CODIGO,
               PRP_SITUACAO,
               PRP_NOME,
               PRP_ENDERECO,
               PRP_BAIRRO,
               PRP_CIDADE,
               PRP_UF,
               PRP_CEP,
               PRP_FONE,
               PRP_FAX,
               PRP_EMAIL,
               PRP_AOSCUIDADOS,
               PRP_DEPARTAMENTO,
               PRP_VENDEDORINTERNO,
               PRP_VENDEDOREXTERNO,
               PRP_VENDEDOROPERACIONAL,
               PRP_DATAEMISSAO,
               PRP_DATACONFIRMACAO,
               PRP_DATAFATURAMENTO,
               PRP_OBSERVACAONOTA,
               PRP_VALIDADE,
               PRP_DATAVALIDADE,
               PRP_ENTREGA,
               PRP_DATAENTREGA,
               PRP_IMPOSTOS,
               PRP_VALORFRETE,
               PRP_FRETEPAGO,
               PRP_VALORTOTALIPI,
               PRP_VALORTOTALDESCONTO,
               PRP_OVERDESCONTO,
               PRP_FORMACONFIRMA,
               PRP_TIPOFATURAMENTO,
               PRP_TIPOENTREGA,
               PRP_NUMEROPEDIDOCLIENTE,
               PRP_MEDIAMARKUP,
               PRP_PROPOSTAPAI,
               PRP_ISOACEITEPROPOSTA,
               PRP_ISOACEITEPEDIDO,
               PRP_TIPOCONFIRMACAO,
               PRP_CONTROLECREDITO,
               PRP_INCLUIDATA,
               PRP_INCLUIPOR,
               PRP_ALTERADATA,
               PRP_ALTERAPOR,
               PRP_CONTROLAPRN)
            VALUES
              (V_PROXIMAPROPOSTA,
               REC_PROPOSTA.RAT_CODIGO,
               REC_PROPOSTA.CLI_CODIGO,
               REC_PROPOSTA.ORI_CODIGO,
               REC_PROPOSTA.TRA_CODIGO,
               REC_PROPOSTA.CPG_CODIGO,
               REC_PROPOSTA.END_CODIGO,
               REC_PROPOSTA.PTP_CODIGO,
               REC_PROPOSTA.PRP_SITUACAO,
               REC_PROPOSTA.PRP_NOME,
               REC_PROPOSTA.PRP_ENDERECO,
               REC_PROPOSTA.PRP_BAIRRO,
               REC_PROPOSTA.PRP_CIDADE,
               REC_PROPOSTA.PRP_UF,
               REC_PROPOSTA.PRP_CEP,
               REC_PROPOSTA.PRP_FONE,
               REC_PROPOSTA.PRP_FAX,
               REC_PROPOSTA.PRP_EMAIL,
               REC_PROPOSTA.PRP_AOSCUIDADOS,
               REC_PROPOSTA.PRP_DEPARTAMENTO,
               REC_PROPOSTA.PRP_VENDEDORINTERNO,
               REC_PROPOSTA.PRP_VENDEDOREXTERNO,
               REC_PROPOSTA.PRP_VENDEDOROPERACIONAL,
               REC_PROPOSTA.PRP_DATAEMISSAO,
               REC_PROPOSTA.PRP_DATACONFIRMACAO,
               REC_PROPOSTA.PRP_DATAFATURAMENTO,
               REC_PROPOSTA.PRP_OBSERVACAONOTA,
               REC_PROPOSTA.PRP_VALIDADE,
               REC_PROPOSTA.PRP_DATAVALIDADE,
               REC_PROPOSTA.PRP_ENTREGA,
               REC_PROPOSTA.PRP_DATAENTREGA,
               REC_PROPOSTA.PRP_IMPOSTOS,
               REC_PROPOSTA.PRP_VALORFRETE,
               REC_PROPOSTA.PRP_FRETEPAGO,
               REC_PROPOSTA.PRP_VALORTOTALIPI,
               REC_PROPOSTA.PRP_VALORTOTALDESCONTO,
               REC_PROPOSTA.PRP_OVERDESCONTO,
               REC_PROPOSTA.PRP_FORMACONFIRMA,
               REC_PROPOSTA.PRP_TIPOFATURAMENTO,
               REC_PROPOSTA.PRP_TIPOENTREGA,
               REC_PROPOSTA.PRP_NUMEROPEDIDOCLIENTE,
               REC_PROPOSTA.PRP_MEDIAMARKUP,
               V_PRP_CODIGO,
               REC_PROPOSTA.PRP_ISOACEITEPROPOSTA,
               REC_PROPOSTA.PRP_ISOACEITEPEDIDO,
               REC_PROPOSTA.PRP_TIPOCONFIRMACAO,
               REC_PROPOSTA.PRP_CONTROLECREDITO,
               SYSDATE,
               V_PRI_USUARIO,
               SYSDATE,
               V_PRI_USUARIO,
               0);
          END LOOP;
        END;
        /*****************************************************************
         GERA AS OBSERVAC?ES DA NOVA PROPOSTA COM A DIVIS?O
        ******************************************************************/
        DECLARE
          CURSOR CUR_OBSERVACAO IS
            SELECT * FROM PROPOSTA_MEMO WHERE PRP_CODIGO = V_PRP_CODIGO;
          REC_OBSERVACAO CUR_OBSERVACAO%ROWTYPE;
        BEGIN
          FOR REC_OBSERVACAO IN CUR_OBSERVACAO LOOP
            INSERT INTO PROPOSTA_MEMO
              (PRP_CODIGO,
               PPM_TIPOTEXTO,
               PPM_TEXTO,
               PPM_INCLUIDATA,
               PPM_INCLUIPOR,
               PPM_ALTERADATA,
               PPM_ALTERAPOR)

            VALUES
              (V_PROXIMAPROPOSTA,
               REC_OBSERVACAO.PPM_TIPOTEXTO,
               REC_OBSERVACAO.PPM_TEXTO,
               SYSDATE,
               V_PRI_USUARIO,
               SYSDATE,
               V_PRI_USUARIO);
          END LOOP;
        END;
      END IF;
      /*****************************************************************
       DELETE ITEM NAO MARCADO PARA DIVISAO NA PROPOSTA_ITEM
      ******************************************************************/
      DECLARE
        V_QUANTIDADE NUMBER;
      BEGIN
        SELECT PRI_QUANTIDADE
          INTO V_QUANTIDADE
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PRP_CODIGO
           AND PRI_SEQUENCIA = V_PRI_SEQUENCIA;
        IF V_QUANTIDADE = V_PRI_QUANTIDADE THEN
          DELETE FROM PROPOSTA_ITEM
           WHERE PRP_CODIGO = V_PRP_CODIGO
             AND PRI_SEQUENCIA = V_PRI_SEQUENCIA;
        ELSE
          UPDATE PROPOSTA_ITEM
             SET PRI_QUANTIDADE = PRI_QUANTIDADE - V_PRI_QUANTIDADE,
                 PRI_VALORTOTAL = (PRI_QUANTIDADE - V_PRI_QUANTIDADE) *
                                  PRI_VALORUNITARIO
           WHERE PRP_CODIGO = V_PRP_CODIGO
             AND PRI_SEQUENCIA = V_PRI_SEQUENCIA;
        END IF;
      END;
      /*****************************************************************
       GERA O ITEM NA NOVA PROPOSTA_ITEM(DIVIDIDA)
      ******************************************************************/
      BEGIN
        -- ADQUIRE ULTIMO NUMERO DE ITEM OU ATRIBUI 1 (PRIMEIRO)
        SELECT MAX(PRI_ITEM)
          INTO V_ITEM
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PROXIMAPROPOSTA;

        V_ITEM := V_ITEM + 1;
      END;

      IF V_ITEM IS NULL THEN
        V_ITEM := 1;
      END IF;
      INSERT INTO PROPOSTA_ITEM
        (PRP_CODIGO,
         PRI_SEQUENCIA,
         PRI_ITEM,
         PRO_CODIGO,
         PRI_TABELAVENDA,
         PRI_QUANTIDADE,
         PRI_UNIDADE,
         PRI_DESCRICAO,
         PRI_DESCRICAOTECNICA,
         PRI_REFERENCIA,
         PRI_DESCONTO,
         PRI_VALORDESCONTO,
         PRI_VALORUNITARIO,
         PRI_VALORUNITARIOTABELA,
         PRI_VALORUNITARIOMAIOR,
         PRI_VALORIPI,
         PRI_VALORTOTAL,
         PRI_ENTREGA,
         PRI_DATAENTREGA,
         PRI_CODIGOPEDIDOCLIENTE,
         PRI_CODIGOPRODUTOCLIENTE,
         PRI_CUSTO,
         PRI_CUSTOMEDIO,
         PRI_CUSTOMARKUP,
         PRI_VALORULTIMACOMPRA,
         PRI_PERCENTUALMARKUP,
         PRI_TIPOIMPRESSAO,
         PRI_MALA,
         PRI_TIPOMALA,
         PRI_IPI,
         PRI_INCLUIDATA,
         PRI_INCLUIPOR,
         PRI_ALTERADATA,
         PRI_ALTERAPOR)
      VALUES
        (V_PROXIMAPROPOSTA,
         V_ITEM,
         V_ITEM,
         V_PRO_CODIGO,
         V_PRI_TABELAVENDA,
         V_PRI_QUANTIDADE,
         V_PRI_UNIDADE,
         V_PRI_DESCRICAO,
         V_PRI_DESCRICAOTECNICA,
         V_PRI_REFERENCIA,
         V_PRI_DESCONTO,
         V_PRI_VALORDESCONTO,
         V_PRI_VALORUNITARIO,
         V_PRI_VALORUNITARIOTABELA,
         V_PRI_VALORUNITARIOMAIOR,
         V_PRI_VALORIPI,
         V_PRI_VALORTOTAL,
         V_PRI_ENTREGA,
         V_PRI_DATAENTREGA,
         V_PRI_CODIGOPEDIDOCLIENTE,
         V_PRI_CODIGOPRODUTOCLIENTE,
         V_PRI_CUSTO,
         V_PRI_CUSTOMEDIO,
         V_PRI_CUSTOMARKUP,
         V_PRI_VALORULTIMACOMPRA,
         V_PRI_PERCENTUALMARKUP,
         V_PRI_TIPOIMPRESSAO,
         V_PRI_MALA,
         V_PRI_TIPOMALA,
         V_PRI_IPI,
         SYSDATE,
         V_PRI_USUARIO,
         SYSDATE,
         V_PRI_USUARIO);

      /*****************************************************************
       RECALCULA A PROPOSTA ORIGEM
      ******************************************************************/
      DECLARE
        V_PRP_VALORTOTAL         PROPOSTA.PRP_VALORTOTAL%TYPE;
        V_PRP_MEDIAMARKUP        PROPOSTA.PRP_MEDIAMARKUP%TYPE;
        V_PRP_VALORTOTALTABELA   PROPOSTA.PRP_VALORTOTALTABELA%TYPE;
        V_PRP_VALORTOTALIPI      PROPOSTA.PRP_VALORTOTALIPI%TYPE;
        V_PRP_VALORTOTALDESCONTO PROPOSTA.PRP_VALORTOTALDESCONTO%TYPE;
        V_PRP_OVERDESCONTO       PROPOSTA.PRP_OVERDESCONTO%TYPE;
        V_CLI_CODIGO             PROPOSTA.CLI_CODIGO%TYPE;
        V_PRP_SITUACAO           PROPOSTA.PRP_SITUACAO%TYPE;
      BEGIN
        SELECT SUM(PRI_VALORTOTAL),
               SUM(PRI_PERCENTUALMARKUP),
               SUM(PRI_VALORDESCONTO),
               SUM(PRI_VALORIPI),
               SUM(PRI_QUANTIDADE * PRI_VALORUNITARIOTABELA)
          INTO V_PRP_VALORTOTAL,
               V_PRP_MEDIAMARKUP,
               V_PRP_VALORTOTALDESCONTO,
               V_PRP_VALORTOTALIPI,
               V_PRP_VALORTOTALTABELA
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PRP_CODIGO;
        SELECT CLI_CODIGO, PRP_SITUACAO
          INTO V_CLI_CODIGO, V_PRP_SITUACAO
          FROM PROPOSTA
         WHERE PRP_CODIGO = V_PRP_CODIGO;
        -- CALCULA A MEDIA DE MARKUP
        DECLARE
          N_ITEM INTEGER;
        BEGIN
          SELECT COUNT(*)
            INTO N_ITEM
            FROM PROPOSTA_ITEM
           WHERE PRP_CODIGO = V_PRP_CODIGO;
          V_PRP_MEDIAMARKUP := V_PRP_MEDIAMARKUP / N_ITEM;
        END;
        -----------------------------------------------------
        IF (V_PRP_VALORTOTAL > V_PRP_VALORTOTALTABELA) AND
           (V_PRP_VALORTOTALTABELA > 0) THEN
          V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTAL - V_PRP_VALORTOTALTABELA) /
                                V_PRP_VALORTOTAL) * 100;
        ELSIF (V_PRP_VALORTOTALTABELA > V_PRP_VALORTOTAL) AND
              (V_PRP_VALORTOTAL > 0) THEN
          V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTALTABELA - V_PRP_VALORTOTAL) /
                                V_PRP_VALORTOTALTABELA) * 100;
        END IF;
        UPDATE PROPOSTA
           SET PRP_VALORTOTAL         = V_PRP_VALORTOTAL,
               PRP_VALORTOTALTABELA   = V_PRP_VALORTOTALTABELA,
               PRP_VALORTOTALIPI      = V_PRP_VALORTOTALIPI,
               PRP_VALORTOTALDESCONTO = V_PRP_VALORTOTALDESCONTO,
               PRP_MEDIAMARKUP        = V_PRP_MEDIAMARKUP,
               PRP_OVERDESCONTO       = V_PRP_OVERDESCONTO,
               CLI_CODIGO             = V_CLI_CODIGO,
               PRP_SITUACAO           = V_PRP_SITUACAO
         WHERE PRP_CODIGO = V_PRP_CODIGO;
      END;
      /*****************************************************************
       RECALCULA A PROPOSTA DIVIDIDA
      ******************************************************************/
      DECLARE
        V_PRP_VALORTOTAL         PROPOSTA.PRP_VALORTOTAL%TYPE;
        V_PRP_MEDIAMARKUP        PROPOSTA.PRP_MEDIAMARKUP%TYPE;
        V_PRP_VALORTOTALTABELA   PROPOSTA.PRP_VALORTOTALTABELA%TYPE;
        V_PRP_VALORTOTALIPI      PROPOSTA.PRP_VALORTOTALIPI%TYPE;
        V_PRP_VALORTOTALDESCONTO PROPOSTA.PRP_VALORTOTALDESCONTO%TYPE;
        V_PRP_OVERDESCONTO       PROPOSTA.PRP_OVERDESCONTO%TYPE;
        V_CLI_CODIGO             PROPOSTA.CLI_CODIGO%TYPE;
        V_PRP_SITUACAO           PROPOSTA.PRP_SITUACAO%TYPE;
      BEGIN
        SELECT SUM(PRI_VALORTOTAL),
               SUM(PRI_PERCENTUALMARKUP),
               SUM(PRI_VALORDESCONTO),
               SUM(PRI_VALORIPI),
               SUM(PRI_QUANTIDADE * PRI_VALORUNITARIOTABELA)
          INTO V_PRP_VALORTOTAL,
               V_PRP_MEDIAMARKUP,
               V_PRP_VALORTOTALDESCONTO,
               V_PRP_VALORTOTALIPI,
               V_PRP_VALORTOTALTABELA
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PROXIMAPROPOSTA;
        SELECT CLI_CODIGO, PRP_SITUACAO
          INTO V_CLI_CODIGO, V_PRP_SITUACAO
          FROM PROPOSTA
         WHERE PRP_CODIGO = V_PROXIMAPROPOSTA;
        -- CALCULA A MEDIA DE MARKUP
        DECLARE
          N_ITEM INTEGER;
        BEGIN
          SELECT COUNT(*)
            INTO N_ITEM
            FROM PROPOSTA_ITEM
           WHERE PRP_CODIGO = V_PROXIMAPROPOSTA;
          V_PRP_MEDIAMARKUP := V_PRP_MEDIAMARKUP / N_ITEM;
        END;
        -----------------------------------------------------
        IF (V_PRP_VALORTOTAL > V_PRP_VALORTOTALTABELA) AND
           (V_PRP_VALORTOTALTABELA > 0) THEN
          V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTAL - V_PRP_VALORTOTALTABELA) /
                                V_PRP_VALORTOTAL) * 100;
        ELSIF (V_PRP_VALORTOTALTABELA > V_PRP_VALORTOTAL) AND
              (V_PRP_VALORTOTAL > 0) THEN
          V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTALTABELA - V_PRP_VALORTOTAL) /
                                V_PRP_VALORTOTALTABELA) * 100;
        END IF;
        UPDATE PROPOSTA
           SET PRP_VALORTOTAL         = V_PRP_VALORTOTAL,
               PRP_VALORTOTALTABELA   = V_PRP_VALORTOTALTABELA,
               PRP_VALORTOTALIPI      = V_PRP_VALORTOTALIPI,
               PRP_VALORTOTALDESCONTO = V_PRP_VALORTOTALDESCONTO,
               PRP_MEDIAMARKUP        = V_PRP_MEDIAMARKUP,
               PRP_OVERDESCONTO       = V_PRP_OVERDESCONTO,
               CLI_CODIGO             = V_CLI_CODIGO,
               PRP_SITUACAO           = V_PRP_SITUACAO
         WHERE PRP_CODIGO = V_PROXIMAPROPOSTA;
      END;

    ELSE
      RAISE E_SITUACAO_NAO_PENDENTE;
    END IF;

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE_APPLICATION_ERROR(-20001, FNC_MENSAGEM_ERRO(20001));
    WHEN E_PREENCHIMENTO_OBRIGATORIO THEN
      RAISE_APPLICATION_ERROR(-20048, FNC_MENSAGEM_ERRO(20048));
    WHEN E_PROPOSTA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20050, FNC_MENSAGEM_ERRO(20050));
    WHEN E_SITUACAO_NAO_PENDENTE THEN
      -- SE PROPOSTA NAO FOR PENDENTE
      RAISE_APPLICATION_ERROR(-20037, FNC_MENSAGEM_ERRO(20037));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE

  END PRC_DIVIDE_PROPOSTA;

  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PRC_COPIA_PROPOSTA
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 09/02/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_COPIA_PROPOSTA(V_PRP_CODIGO      IN PROPOSTA.PRP_CODIGO %TYPE,
                               V_USUARIO         IN PROPOSTA.PRP_INCLUIPOR %TYPE,
                               V_RAT_CODIGO      IN PROPOSTA.RAT_CODIGO %TYPE,
                               V_PROXIMAPROPOSTA IN OUT PROPOSTA.PRP_CODIGO %TYPE)

   IS
    --V_PROXIMAPROPOSTA NUMBER;
    V_PRP_SITUACAO    PROPOSTA.PRP_SITUACAO %TYPE;
    E_PREENCHIMENTO_OBRIGATORIO EXCEPTION;
    E_SEQUENCIA_NAO_ENCONTRADA EXCEPTION;
    E_PROPOSTA_NAO_ENCONTRADA EXCEPTION;
  BEGIN
    IF V_PRP_CODIGO IS NULL THEN
      -- VERIFICA COLUNAS DE PREENCHIMENTO OBRIGATORIO DETERMINADO EM CONSTRAINT

      RAISE E_PREENCHIMENTO_OBRIGATORIO;
    END IF;

    SELECT PRP_SITUACAO -- BUSCA PROPOSTA
      INTO V_PRP_SITUACAO
      FROM PROPOSTA
     WHERE PRP_CODIGO = V_PRP_CODIGO;

    IF SQL%NOTFOUND THEN
      RAISE E_PROPOSTA_NAO_ENCONTRADA;
    END IF;

    /*****************************************************************
     GERA NOVO NUMERO DA PROPOSTA
    ******************************************************************/
    IF NVL(V_PROXIMAPROPOSTA, 0) = 0 THEN
      SELECT SQN_PROPOSTA.NEXTVAL -- ATRIBUI NOVO NUMERO DE PROPOSTA A VARIAVEL
        INTO V_PROXIMAPROPOSTA
        FROM DUAL;
      IF SQL%NOTFOUND THEN
        RAISE E_SEQUENCIA_NAO_ENCONTRADA;
      END IF;
    END IF;
    /*****************************************************************
     GERA NOVA PROPOSTA COM A COPIA
    ******************************************************************/
    DECLARE
      CURSOR CUR_PROPOSTA IS
        SELECT * FROM PROPOSTA WHERE PRP_CODIGO = V_PRP_CODIGO;
      REC_PROPOSTA CUR_PROPOSTA%ROWTYPE;
    BEGIN
      FOR REC_PROPOSTA IN CUR_PROPOSTA LOOP
        INSERT INTO PROPOSTA
          (PRP_CODIGO,
           RAT_CODIGO,
           CLI_CODIGO,
           ORI_CODIGO,
           TRA_CODIGO,
           CPG_CODIGO,
           END_CODIGO,
           PTP_CODIGO,
           PRP_SITUACAO,
           PRP_NOME,
           PRP_ENDERECO,
           PRP_BAIRRO,
           PRP_CIDADE,
           PRP_UF,
           PRP_CEP,
           PRP_FONE,
           PRP_FAX,
           PRP_EMAIL,
           PRP_AOSCUIDADOS,
           PRP_DEPARTAMENTO,
           PRP_VENDEDORINTERNO,
           PRP_VENDEDOREXTERNO,
           PRP_VENDEDOROPERACIONAL,
           PRP_DATAEMISSAO,
           PRP_OBSERVACAONOTA,
           PRP_VALIDADE,
           PRP_DATAVALIDADE,
           PRP_ENTREGA,
           PRP_DATAENTREGA,
           PRP_SHIPDATE,
           PRP_PAIS,
           PRP_FOB,
           PRP_PROJECT,
           PRP_IMPOSTOS,
           PRP_VALORFRETE,
           PRP_FRETEPAGO,
           PRP_VALORTOTAL,
           PRP_VALORTOTALTABELA,
           PRP_VALORTOTALIPI,
           PRP_VALORTOTALDESCONTO,
           PRP_OVERDESCONTO,
           PRP_FORMACONFIRMA,
           PRP_TIPOFATURAMENTO,
           PRP_TIPOENTREGA,
           PRP_NUMEROPEDIDOCLIENTE,
           PRP_MEDIAMARKUP,
           PRP_CONTROLECREDITO,
           PRP_ISOACEITEPROPOSTA,
           PRP_INCLUIDATA,
           PRP_INCLUIPOR,
           PRP_ALTERADATA,
           PRP_ALTERAPOR,
           PRP_CONTROLAPRN,
           PRP_BASECALCULOICMS,
           PRP_VALORTOTALICMS,
           PRP_VALORTOTALICMSST,
           PRP_TOTALBASECALCICMSST,
           PRT_CODIGO,
           PRP_ABATECRED,
           PRP_VALORCREDITO,
           PRP_TRIANGULACAO,
           PRP_TID,
           PRP_CHAVEWEB,
           PRP_DATACHAVE,
           PRP_NUMEROBANCARIO,
           PRP_ID_MARKETPLACE,
           PRP_TOTAL_CRED_VPC,
           PRP_PROPOSTAINI)
        VALUES
          (V_PROXIMAPROPOSTA,
           V_RAT_CODIGO,--REC_PROPOSTA.RAT_CODIGO,
           REC_PROPOSTA.CLI_CODIGO,
           REC_PROPOSTA.ORI_CODIGO,
           REC_PROPOSTA.TRA_CODIGO,
           REC_PROPOSTA.CPG_CODIGO,
           REC_PROPOSTA.END_CODIGO,
           2, --(2-Reserva Vendedor)REC_PROPOSTA.PTP_CODIGO,
           'PN',
           REC_PROPOSTA.PRP_NOME,
           REC_PROPOSTA.PRP_ENDERECO,
           REC_PROPOSTA.PRP_BAIRRO,
           REC_PROPOSTA.PRP_CIDADE,
           REC_PROPOSTA.PRP_UF,
           REC_PROPOSTA.PRP_CEP,
           REC_PROPOSTA.PRP_FONE,
           REC_PROPOSTA.PRP_FAX,
           REC_PROPOSTA.PRP_EMAIL,
           REC_PROPOSTA.PRP_AOSCUIDADOS,
           REC_PROPOSTA.PRP_DEPARTAMENTO,
           REC_PROPOSTA.PRP_VENDEDORINTERNO,
           REC_PROPOSTA.PRP_VENDEDOREXTERNO,
           REC_PROPOSTA.PRP_VENDEDOROPERACIONAL,
           REC_PROPOSTA.PRP_DATAEMISSAO,
           REC_PROPOSTA.PRP_OBSERVACAONOTA,
           REC_PROPOSTA.PRP_VALIDADE,
           REC_PROPOSTA.PRP_DATAVALIDADE,
           REC_PROPOSTA.PRP_ENTREGA,
           REC_PROPOSTA.PRP_DATAENTREGA,
           REC_PROPOSTA.PRP_SHIPDATE,
           REC_PROPOSTA.PRP_PAIS,
           REC_PROPOSTA.PRP_FOB,
           REC_PROPOSTA.PRP_PROJECT,
           REC_PROPOSTA.PRP_IMPOSTOS,
           REC_PROPOSTA.PRP_VALORFRETE,
           REC_PROPOSTA.PRP_FRETEPAGO,
           REC_PROPOSTA.PRP_VALORTOTAL,
           REC_PROPOSTA.PRP_VALORTOTALTABELA,
           REC_PROPOSTA.PRP_VALORTOTALIPI,
           REC_PROPOSTA.PRP_VALORTOTALDESCONTO,
           REC_PROPOSTA.PRP_OVERDESCONTO,
           REC_PROPOSTA.PRP_FORMACONFIRMA,
           REC_PROPOSTA.PRP_TIPOFATURAMENTO,
           REC_PROPOSTA.PRP_TIPOENTREGA,
           REC_PROPOSTA.PRP_NUMEROPEDIDOCLIENTE,
           REC_PROPOSTA.PRP_MEDIAMARKUP,
           REC_PROPOSTA.PRP_CONTROLECREDITO,
           REC_PROPOSTA.PRP_ISOACEITEPROPOSTA,
           SYSDATE,
           V_USUARIO,
           SYSDATE,
           V_USUARIO,
           0,
           REC_PROPOSTA.PRP_BASECALCULOICMS,
           REC_PROPOSTA.PRP_VALORTOTALICMS,
           REC_PROPOSTA.PRP_VALORTOTALICMSST,
           REC_PROPOSTA.PRP_TOTALBASECALCICMSST,
           REC_PROPOSTA.PRT_CODIGO,
           'N', --PRP_ABATECRED
           0, --PRP_VALORCREDITO
           REC_PROPOSTA.PRP_TRIANGULACAO,
           REC_PROPOSTA.PRP_TID,
           REC_PROPOSTA.PRP_CHAVEWEB,
           REC_PROPOSTA.PRP_DATACHAVE,
           REC_PROPOSTA.PRP_NUMEROBANCARIO,
           REC_PROPOSTA.PRP_ID_MARKETPLACE,
           REC_PROPOSTA.PRP_TOTAL_CRED_VPC,
           V_PRP_CODIGO);
      END LOOP;
    END;
    /*****************************************************************
     GERA AS OBSERVAC?ES DA NOVA PROPOSTA COM A COPIA
    ******************************************************************/
    DECLARE
      CURSOR CUR_OBSERVACAO IS
        SELECT * FROM PROPOSTA_MEMO WHERE PRP_CODIGO = V_PRP_CODIGO;
      REC_OBSERVACAO CUR_OBSERVACAO%ROWTYPE;
    BEGIN
      FOR REC_OBSERVACAO IN CUR_OBSERVACAO LOOP
        INSERT INTO PROPOSTA_MEMO
          (PRP_CODIGO,
           PPM_TIPOTEXTO,
           PPM_TEXTO,
           PPM_INCLUIDATA,
           PPM_INCLUIPOR,
           PPM_ALTERADATA,
           PPM_ALTERAPOR)

        VALUES
          (V_PROXIMAPROPOSTA,
           REC_OBSERVACAO.PPM_TIPOTEXTO,
           REC_OBSERVACAO.PPM_TEXTO,
           SYSDATE,
           V_USUARIO,
           SYSDATE,
           V_USUARIO);
      END LOOP;
    END;
    /*****************************************************************
     GERA O ITEM NA NOVA PROPOSTA_ITEM(COPIA)
    ******************************************************************/
    DECLARE
      CURSOR CUR_ITEMS IS
        SELECT * FROM PROPOSTA_ITEM WHERE PRP_CODIGO = V_PRP_CODIGO;
      REC_ITEMS CUR_ITEMS%ROWTYPE;
    BEGIN
      FOR REC_ITEMS IN CUR_ITEMS LOOP
        INSERT INTO PROPOSTA_ITEM
          (PRP_CODIGO,
           PRI_SEQUENCIA,
           PRI_ITEM,
           PRO_CODIGO,
           PRI_TABELAVENDA,
           PRI_QUANTIDADE,
           PRI_UNIDADE,
           PRI_DESCRICAO,
           PRI_DESCRICAOTECNICA,
           PRI_REFERENCIA,
           PRI_DESCONTO,
           PRI_VALORDESCONTO,
           PRI_VALORUNITARIO,
           PRI_VALORUNITARIOTABELA,
           PRI_VALORUNITARIOMAIOR,
           PRI_VALORIPI,
           PRI_IPI,
           PRI_VALORTOTAL,
           PRI_ENTREGA,
           PRI_DATAENTREGA,
           PRI_CODIGOPEDIDOCLIENTE,
           PRI_CODIGOPRODUTOCLIENTE,
           PRI_CUSTO,
           PRI_CUSTOMEDIO,
           PRI_CUSTOMARKUP,
           PRI_VALORULTIMACOMPRA,
           PRI_PERCENTUALMARKUP,
           PRI_TIPOIMPRESSAO,
           PRI_MALA,
           PRI_TIPOMALA,
           PRI_INCLUIDATA,
           PRI_INCLUIPOR,
           PRI_ALTERADATA,
           PRI_ALTERAPOR,
           PRI_VALORICMSST,
           PRI_BASECALCULOICMSST,
           PRI_BASECALCULOICMS,
           PRI_VALORICMS,
           PRI_ICMSVENDA,
           PRI_TIPOFISCAL,
           PRI_DESCONTOESPECIAL,
           PRI_VALORDESCESP,
           PRI_TIPODESC,
           PRI_PERDESCIN,
           PRI_VLRDESCIN,
           PRI_TIPOVPC,
           PRI_VALORCREDVPC)
        VALUES
          (V_PROXIMAPROPOSTA,
           REC_ITEMS.PRI_SEQUENCIA,
           REC_ITEMS.PRI_ITEM,
           REC_ITEMS.PRO_CODIGO,
           REC_ITEMS.PRI_TABELAVENDA,
           REC_ITEMS.PRI_QUANTIDADE,
           REC_ITEMS.PRI_UNIDADE,
           REC_ITEMS.PRI_DESCRICAO,
           REC_ITEMS.PRI_DESCRICAOTECNICA,
           REC_ITEMS.PRI_REFERENCIA,
           REC_ITEMS.PRI_DESCONTO,
           REC_ITEMS.PRI_VALORDESCONTO,
           REC_ITEMS.PRI_VALORUNITARIO,
           REC_ITEMS.PRI_VALORUNITARIOTABELA,
           REC_ITEMS.PRI_VALORUNITARIOMAIOR,
           REC_ITEMS.PRI_VALORIPI,
           REC_ITEMS.PRI_IPI,
           REC_ITEMS.PRI_VALORTOTAL,
           REC_ITEMS.PRI_ENTREGA,
           REC_ITEMS.PRI_DATAENTREGA,
           REC_ITEMS.PRI_CODIGOPEDIDOCLIENTE,
           REC_ITEMS.PRI_CODIGOPRODUTOCLIENTE,
           REC_ITEMS.PRI_CUSTO,
           REC_ITEMS.PRI_CUSTOMEDIO,
           REC_ITEMS.PRI_CUSTOMARKUP,
           REC_ITEMS.PRI_VALORULTIMACOMPRA,
           REC_ITEMS.PRI_PERCENTUALMARKUP,
           REC_ITEMS.PRI_TIPOIMPRESSAO,
           REC_ITEMS.PRI_MALA,
           REC_ITEMS.PRI_TIPOMALA,
           SYSDATE,
           V_USUARIO,
           SYSDATE,
           V_USUARIO,
           REC_ITEMS.PRI_VALORICMSST,
           REC_ITEMS.PRI_BASECALCULOICMSST,
           REC_ITEMS.PRI_BASECALCULOICMS,
           REC_ITEMS.PRI_VALORICMS,
           REC_ITEMS.PRI_ICMSVENDA,
           REC_ITEMS.PRI_TIPOFISCAL,
           REC_ITEMS.PRI_DESCONTOESPECIAL,
           REC_ITEMS.PRI_VALORDESCESP,
           REC_ITEMS.PRI_TIPODESC,
           REC_ITEMS.PRI_PERDESCIN,
           REC_ITEMS.PRI_VLRDESCIN,
           REC_ITEMS.PRI_TIPOVPC,
           REC_ITEMS.PRI_VALORCREDVPC);
      END LOOP;
    END;
    COMMIT;

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE_APPLICATION_ERROR(-20001, FNC_MENSAGEM_ERRO(20001));
    WHEN E_PREENCHIMENTO_OBRIGATORIO THEN
      RAISE_APPLICATION_ERROR(-20048, FNC_MENSAGEM_ERRO(20048));
    WHEN E_PROPOSTA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20050, FNC_MENSAGEM_ERRO(20050));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE

  END PRC_COPIA_PROPOSTA;

  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PRC_CANCELA_PROPOSTA
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 09/02/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_CANCELA_PROPOSTA(V_PRP_CODIGO IN PROPOSTA.PRP_CODIGO %TYPE,
                                 V_USUARIO    IN PROPOSTA.PRP_INCLUIPOR %TYPE)

   IS
    V_PRP_SITUACAO PROPOSTA.PRP_SITUACAO %TYPE;
    E_SITUACAO_NAO_PENDENTE EXCEPTION;
    E_PREENCHIMENTO_OBRIGATORIO EXCEPTION;
    E_PROPOSTA_NAO_ENCONTRADA EXCEPTION;
    --
    v_Cod_Vend_Tri          nf_unica.nfu_vendedorinterno %type := 0;
    v_Prp_Vendedorinterno   proposta.prp_vendedorinterno %type := 0;
  BEGIN
    IF V_PRP_CODIGO IS NULL THEN
      -- VERIFICA COLUNAS DE PREENCHIMENTO OBRIGATORIO DETERMINADO EM CONSTRAINT

      RAISE E_PREENCHIMENTO_OBRIGATORIO;
    END IF;

    SELECT PRP_SITUACAO -- BUSCA PROPOSTA
         , to_number(fnc_buscaregra('PROPOSTA', 'VENDEDOR_PADRAO_TRIANGULACAO')), PRP_VENDEDORINTERNO
      INTO V_PRP_SITUACAO
         , v_Cod_Vend_Tri, v_Prp_Vendedorinterno
      FROM PROPOSTA
     WHERE PRP_CODIGO = V_PRP_CODIGO;

    IF SQL%NOTFOUND THEN
      RAISE E_PROPOSTA_NAO_ENCONTRADA;
    END IF;

    IF V_PRP_SITUACAO <> 'PN' THEN
      -- SO CANCELA PROPOSTA NAO PENDENTES
      RAISE E_SITUACAO_NAO_PENDENTE;
    ELSE
      UPDATE PROPOSTA
         SET PRP_SITUACAO   = 'CA',
             PRP_ALTERADATA = SYSDATE,
             PRP_ALTERAPOR  = V_USUARIO
       WHERE PRP_CODIGO = V_PRP_CODIGO;

       -- Lucas 15/07/2016 -> estornar o nro da proposta nas notas de remessa Triangulação B2B, se houver
       if (v_Cod_Vend_Tri = v_Prp_Vendedorinterno) then
         update nf_unica
            set prp_codigo = 0
          where prp_codigo = V_PRP_CODIGO;
       end if;

       -- Gustavo 19/10/2023 -> estornar o nro da proposta de corte venda direta nas propostas de venda direta  B2B, se houver
       if (v_Cod_Vend_Tri = v_Prp_Vendedorinterno) then
         update proposta pr set pr.prp_seqpropvendireta = 0 where pr.prp_seqpropvendireta = V_PRP_CODIGO;
       end if;


      COMMIT;
    END IF;

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE_APPLICATION_ERROR(-20001, FNC_MENSAGEM_ERRO(20001));
    WHEN E_PREENCHIMENTO_OBRIGATORIO THEN
      RAISE_APPLICATION_ERROR(-20048, FNC_MENSAGEM_ERRO(20048));
    WHEN E_PROPOSTA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20050, FNC_MENSAGEM_ERRO(20050));
    WHEN E_SITUACAO_NAO_PENDENTE THEN
      -- SE PROPOSTA NAO FOR PENDENTE
      RAISE_APPLICATION_ERROR(-20037, FNC_MENSAGEM_ERRO(20037));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE

  END PRC_CANCELA_PROPOSTA;
  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PRC_PERDIDA_PROPOSTA
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 09/02/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_PERDIDA_PROPOSTA(V_PRP_CODIGO IN PROPOSTA.PRP_CODIGO %TYPE,
                                 V_USUARIO    IN PROPOSTA.PRP_INCLUIPOR %TYPE,
                                 V_MOTIVO     IN PROPOSTA.PRP_PORQUEPERDEU%TYPE)

   IS
    V_PRP_SITUACAO PROPOSTA.PRP_SITUACAO %TYPE;
    E_SITUACAO_NAO_PENDENTE EXCEPTION;
    E_PREENCHIMENTO_OBRIGATORIO EXCEPTION;
    E_PROPOSTA_NAO_ENCONTRADA EXCEPTION;
    --
    v_Cod_Vend_Tri          nf_unica.nfu_vendedorinterno %type := 0;
    v_Prp_Vendedorinterno   proposta.prp_vendedorinterno %type := 0;
  BEGIN
    IF V_PRP_CODIGO IS NULL THEN
      -- VERIFICA COLUNAS DE PREENCHIMENTO OBRIGATORIO DETERMINADO EM CONSTRAINT

      RAISE E_PREENCHIMENTO_OBRIGATORIO;
    END IF;

    SELECT PRP_SITUACAO -- BUSCA PROPOSTA
         , to_number(fnc_buscaregra('PROPOSTA', 'VENDEDOR_PADRAO_TRIANGULACAO')), PRP_VENDEDORINTERNO
      INTO V_PRP_SITUACAO
         , v_Cod_Vend_Tri, v_Prp_Vendedorinterno
      FROM PROPOSTA
     WHERE PRP_CODIGO = V_PRP_CODIGO;

    IF SQL%NOTFOUND THEN
      RAISE E_PROPOSTA_NAO_ENCONTRADA;
    END IF;

    IF V_PRP_SITUACAO <> 'PN' THEN
      -- SO PERDE PROPOSTA PENDENTES
      RAISE E_SITUACAO_NAO_PENDENTE;
    ELSE
      UPDATE PROPOSTA
         SET PRP_SITUACAO     = 'PE',
             PRP_ALTERADATA   = SYSDATE,
             PRP_ALTERAPOR    = V_USUARIO,
             PRP_PORQUEPERDEU = V_MOTIVO
       WHERE PRP_CODIGO = V_PRP_CODIGO;

      -- Lucas 15/07/2016 -> estornar o nro da proposta nas notas de remessa Triangulação B2B, se houver
      if (v_Cod_Vend_Tri = v_Prp_Vendedorinterno) then
        update nf_unica
           set prp_codigo = 0
         where prp_codigo = V_PRP_CODIGO;
      end if;

       -- Gustavo 19/10/2023 -> estornar o nro da proposta de corte venda direta nas propostas de venda direta  B2B, se houver
       if (v_Cod_Vend_Tri = v_Prp_Vendedorinterno) then
         update proposta pr set pr.prp_seqpropvendireta = 0 where pr.prp_seqpropvendireta = V_PRP_CODIGO;
       end if;


      COMMIT;
    END IF;

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE_APPLICATION_ERROR(-20001, FNC_MENSAGEM_ERRO(20001));
    WHEN E_PREENCHIMENTO_OBRIGATORIO THEN
      RAISE_APPLICATION_ERROR(-20048, FNC_MENSAGEM_ERRO(20048));
    WHEN E_PROPOSTA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20050, FNC_MENSAGEM_ERRO(20050));
    WHEN E_SITUACAO_NAO_PENDENTE THEN
      -- SE PROPOSTA NAO FOR PENDENTE
      RAISE_APPLICATION_ERROR(-20037, FNC_MENSAGEM_ERRO(20037));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE

  END PRC_PERDIDA_PROPOSTA;
  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PRC_ESTORNA_PROPOSTA
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 09/02/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_ESTORNA_PROPOSTA(V_PRP_CODIGO IN PROPOSTA.PRP_CODIGO %TYPE,
                                 V_USUARIO    IN PROPOSTA.PRP_INCLUIPOR %TYPE,
                                 V_USU_CODIGO IN USUARIO.USU_CODIGO %TYPE) IS
    V_PRP_SITUACAO      PROPOSTA.PRP_SITUACAO %TYPE;
    V_RAT_CODIGO        PROPOSTA.RAT_CODIGO %TYPE;
    V_CLI_CODIGO        CLIENTE.CLI_CODIGO %TYPE;
    V_VENDEDOR_RMA      NUMBER;
    V_VENDEDOR_PROPOSTA NUMBER;
    possuiservico       NUMBER;
    V_PRP_COMPLEMENTAR  PROPOSTA.PRP_COMPLEMENTAR%type;
    E_SITUACAO_NAO_PENDENTE EXCEPTION;
    E_PREENCHIMENTO_OBRIGATORIO EXCEPTION;
    E_PROPOSTA_NAO_ENCONTRADA EXCEPTION;
    contador INTEGER;
  BEGIN
    IF V_PRP_CODIGO IS NULL THEN
      -- VERIFICA COLUNAS DE PREENCHIMENTO OBRIGATORIO DETERMINADO EM CONSTRAINT

      RAISE E_PREENCHIMENTO_OBRIGATORIO;
    END IF;

    SELECT CLI_CODIGO,   PRP_SITUACAO,   RAT_CODIGO,   PRP_VENDEDORINTERNO, PRP_COMPLEMENTAR -- BUSCA PROPOSTA
      INTO V_CLI_CODIGO, V_PRP_SITUACAO, V_RAT_CODIGO, V_VENDEDOR_PROPOSTA, V_PRP_COMPLEMENTAR
      FROM PROPOSTA
     WHERE PRP_CODIGO = V_PRP_CODIGO;

    IF SQL%NOTFOUND THEN
      RAISE E_PROPOSTA_NAO_ENCONTRADA;
    END IF;

    V_VENDEDOR_RMA := TO_NUMBER(FNC_BUSCAREGRA('RMA', 'CODIGO_VENDEDOR'));

    IF V_PRP_SITUACAO <> 'OK' AND V_PRP_SITUACAO <> 'VL' THEN
      -- SO ESTORNA PROPOSTAS CONFIRMADAS
      RAISE E_SITUACAO_NAO_PENDENTE;
    ELSE
      -- Roberto Marujo - 19/03/2012
      -- Caso a proposta estornada tenha proposta complementar
      -- rompe o vinculo
      if V_PRP_COMPLEMENTAR <> 0 then
        update PROPOSTA P
           set P.PRP_COMPLEMENTAR = 0,
               P.PRP_OBSLIBERACAO_COMERCIAL = P.PRP_OBSLIBERACAO_COMERCIAL ||
                                              'Proposta estornada: O vinculo que a proposta '|| V_PRP_CODIGO || ' mantinha com a proposta complementar ' || V_PRP_COMPLEMENTAR || ' foi rompido',
               P.PRP_OBSLIBERACAO_FINANCEIRO = P.PRP_OBSLIBERACAO_FINANCEIRO ||
                                              'Proposta estornada: O vinculo que a proposta '|| V_PRP_CODIGO || ' mantinha com a proposta complementar ' || V_PRP_COMPLEMENTAR || ' foi rompido'
         where P.PRP_CODIGO = V_PRP_COMPLEMENTAR
            or P.PRP_CODIGO = V_PRP_CODIGO;
      end if;

      UPDATE PROPOSTA
         SET PRP_SITUACAO        = 'PN',
             PRP_ALTERADATA      = SYSDATE,
             PRP_ALTERAPOR       = V_USUARIO,
             PRP_DATACONFIRMACAO = NULL
       WHERE PRP_CODIGO = V_PRP_CODIGO;

      SELECT COUNT(*)
        INTO contador
        FROM operacao_rma_defeito opd, operacao_rma ope
       WHERE ope.prp_codigo = V_PRP_CODIGO
         AND ope.ope_situacao != 'CA'
         AND opd.ope_codigo = ope.ope_codigo
         AND opd.ope_subcodigo = ope.ope_subcodigo
         AND opd.opd_procedimento = 7;

      /*select count(*) into possuiservico
      from ordem_servicoat
      where prp_codigo = v_prp_codigo;*/

      /*if possuiservico > 0 then
        update ordem_servicoat
          set prp_codigo = 0
          where prp_codigo = v_prp_codigo;
      end if;         */

      -- Se for uma proposta do R.M.A.
      IF V_VENDEDOR_RMA = V_VENDEDOR_PROPOSTA THEN
        PCK_RMA.PRC_ESTORNA_PEDIDO_RMA(V_PRP_CODIGO,
                                       V_USU_CODIGO,
                                       V_USUARIO);

        PRC_PERDIDA_PROPOSTA(V_PRP_CODIGO,
                             V_USUARIO,
                             'CANCELAMENTO DE PROPOSTA GERADA PELO R.M.A.');
      END IF;
      PRC_ATUALIZA_DEBITO_CLIENTE(V_CLI_CODIGO);

      COMMIT;
    END IF;

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE_APPLICATION_ERROR(-20001, FNC_MENSAGEM_ERRO(20001));
    WHEN E_PREENCHIMENTO_OBRIGATORIO THEN
      RAISE_APPLICATION_ERROR(-20048, FNC_MENSAGEM_ERRO(20048));
    WHEN E_PROPOSTA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20050, FNC_MENSAGEM_ERRO(20050));
    WHEN E_SITUACAO_NAO_PENDENTE THEN
      -- SE PROPOSTA NAO FOR PENDENTE
      RAISE_APPLICATION_ERROR(-20037, FNC_MENSAGEM_ERRO(20037));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE

  END PRC_ESTORNA_PROPOSTA;
  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PROCEDURE PRC_FATURA_VALE
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 01/02/2001
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_FATURA_VALE

  (V_PRP_CODIGO       IN PROPOSTA.PRP_CODIGO %TYPE,
   V_PRP_PROPOSTAVALE IN PROPOSTA.PRP_PROPOSTAVALE %TYPE)

   IS
    V_PRP_SITUACAO VARCHAR2(2);
    E_PROPOSTA_NAO_ENCONTRADA EXCEPTION;
  BEGIN
    SELECT PRP_SITUACAO -- BUSCA PROPOSTA
      INTO V_PRP_SITUACAO
      FROM PROPOSTA
     WHERE PRP_CODIGO = V_PRP_CODIGO;

    IF SQL%NOTFOUND THEN
      RAISE E_PROPOSTA_NAO_ENCONTRADA;
    END IF;

    IF V_PRP_SITUACAO = 'VL' THEN
      -- SO FATURA VL
      UPDATE PROPOSTA
         SET PRP_SITUACAO = 'FV', PRP_PROPOSTAVALE = V_PRP_PROPOSTAVALE
       WHERE PRP_CODIGO = V_PRP_CODIGO;
    END IF;

  EXCEPTION
    WHEN E_PROPOSTA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20050, FNC_MENSAGEM_ERRO(20050));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE
  END PRC_FATURA_VALE;

  --------------------------------------------------------------------------------
  -- OWNER       : INGRAF INFORMATICA LTDA
  -- ID          : PRC_UNIAO_PROPOSTA
  -- AUTOR       : CARLOS
  -- CRIADO EM   : 14/05/2002
  -- ALTERADO POR:
  -- ALTERADO EM :
  -- OBSERVACOES :
  --------------------------------------------------------------------------------
  PROCEDURE PRC_UNIAO_PROPOSTA(V_PRP_CODIGO    IN PROPOSTA.PRP_CODIGO %TYPE,
                               V_PRP_CODJUNCAO IN PROPOSTA.PRP_CODIGO %TYPE,
                               V_USUARIO       IN PROPOSTA.PRP_INCLUIPOR %TYPE) IS
    CURSOR CUR_ITEM IS
      SELECT * FROM PROPOSTA_ITEM WHERE PRP_CODIGO = V_PRP_CODJUNCAO;
    V_PRP_SITUACAO VARCHAR2(2);
    V_ITEM         INTEGER;
    V_VENDEDOR_RMA INTEGER;
    V_DATAPROPOSTA DATE;
    E_PROPOSTA_NAO_ENCONTRADA EXCEPTION;
    possuiproduto NUMBER;
  BEGIN
    ----------------------------------------------------
    BEGIN
      SELECT PRP_SITUACAO, PRP_VENDEDORINTERNO, PRP_DATAEMISSAO -- BUSCA PROPOSTA
        INTO V_PRP_SITUACAO, V_VENDEDOR_RMA, V_DATAPROPOSTA
        FROM PROPOSTA
       WHERE PRP_CODIGO = V_PRP_CODIGO;
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        RAISE E_PROPOSTA_NAO_ENCONTRADA;
    END;
    /*****************************************************************
     GERA O ITEM NA PROPOSTA_ITEM(JUNC?O)
    ******************************************************************/
    FOR REC_ITEM IN CUR_ITEM LOOP
      BEGIN
        -- ADQUIRE ULTIMO NUMERO DE ITEM OU ATRIBUI 1 (PRIMEIRO)
        SELECT MAX(PRI_ITEM)
          INTO V_ITEM
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PRP_CODIGO;

        V_ITEM := V_ITEM + 1;
      END;

      SELECT COUNT(*)
        INTO possuiproduto
        FROM proposta_item
       WHERE prp_codigo = V_PRP_CODIGO
         AND pro_codigo = REC_ITEM.PRO_CODIGO;

      IF possuiproduto = 0 THEN
        IF V_ITEM IS NULL THEN
          V_ITEM := 1;
        END IF;

        INSERT INTO PROPOSTA_ITEM
          (PRP_CODIGO,
           PRI_SEQUENCIA,
           PRI_ITEM,
           PRO_CODIGO,
           PRI_TABELAVENDA,
           PRI_QUANTIDADE,
           PRI_UNIDADE,
           PRI_DESCRICAO,
           PRI_DESCRICAOTECNICA,
           PRI_REFERENCIA,
           PRI_DESCONTO,
           PRI_VALORDESCONTO,
           PRI_VALORUNITARIO,
           PRI_VALORUNITARIOTABELA,
           PRI_VALORUNITARIOMAIOR,
           PRI_VALORIPI,
           PRI_VALORTOTAL,
           PRI_ENTREGA,
           PRI_DATAENTREGA,
           PRI_CODIGOPEDIDOCLIENTE,
           PRI_CODIGOPRODUTOCLIENTE,
           PRI_CUSTO,
           PRI_CUSTOMEDIO,
           PRI_CUSTOMARKUP,
           PRI_VALORULTIMACOMPRA,
           PRI_PERCENTUALMARKUP,
           PRI_TIPOIMPRESSAO,
           PRI_MALA,
           PRI_TIPOMALA,
           PRI_IPI,
           PRI_INCLUIDATA,
           PRI_INCLUIPOR,
           PRI_ALTERADATA,
           PRI_ALTERAPOR)
        VALUES
          (V_PRP_CODIGO,
           V_ITEM,
           V_ITEM,
           REC_ITEM.PRO_CODIGO,
           REC_ITEM.PRI_TABELAVENDA,
           REC_ITEM.PRI_QUANTIDADE,
           REC_ITEM.PRI_UNIDADE,
           REC_ITEM.PRI_DESCRICAO,
           REC_ITEM.PRI_DESCRICAOTECNICA,
           REC_ITEM.PRI_REFERENCIA,
           REC_ITEM.PRI_DESCONTO,
           REC_ITEM.PRI_VALORDESCONTO,
           REC_ITEM.PRI_VALORUNITARIO,
           REC_ITEM.PRI_VALORUNITARIOTABELA,
           REC_ITEM.PRI_VALORUNITARIOMAIOR,
           REC_ITEM.PRI_VALORIPI,
           REC_ITEM.PRI_VALORTOTAL,
           REC_ITEM.PRI_ENTREGA,
           REC_ITEM.PRI_DATAENTREGA,
           REC_ITEM.PRI_CODIGOPEDIDOCLIENTE,
           REC_ITEM.PRI_CODIGOPRODUTOCLIENTE,
           REC_ITEM.PRI_CUSTO,
           REC_ITEM.PRI_CUSTOMEDIO,
           REC_ITEM.PRI_CUSTOMARKUP,
           REC_ITEM.PRI_VALORULTIMACOMPRA,
           REC_ITEM.PRI_PERCENTUALMARKUP,
           REC_ITEM.PRI_TIPOIMPRESSAO,
           REC_ITEM.PRI_MALA,
           REC_ITEM.PRI_TIPOMALA,
           REC_ITEM.PRI_IPI,
           SYSDATE,
           V_USUARIO,
           SYSDATE,
           V_USUARIO);
      ELSE
        UPDATE proposta_item
           SET pri_quantidade    = pri_quantidade + REC_ITEM.pri_quantidade,
               pri_valortotal    = pri_valortotal + REC_ITEM.pri_valortotal,
               pri_valorunitario = pri_valortotal / pri_quantidade
         WHERE prp_codigo = v_prp_codigo
           AND pro_codigo = REC_ITEM.PRO_CODIGO;
      END IF;
    END LOOP;
    ----------------------------------------------------------------------------------
    -- SE FOR PROPOSTA DE RMA ALTERA A OPERACAO COLOCANDO NUMERO DA PROPOSTA
    IF (V_PRP_SITUACAO = 'OK') AND
       (V_VENDEDOR_RMA =
       TO_NUMBER(FNC_BUSCAREGRA('RMA', 'CODIGO_VENDEDOR'))) THEN
      UPDATE OPERACAO_RMA
         SET PRP_CODIGO          = V_PRP_CODIGO,
             OPE_EMISSAOPROPOSTA = V_DATAPROPOSTA,
             OPE_ALTERADATA      = SYSDATE,
             OPE_ALTERAPOR       = V_USUARIO
       WHERE PRP_CODIGO = V_PRP_CODJUNCAO
         AND OPE_SITUACAO = 'OK';
    END IF;

    /*update ordem_servicoat
     set prp_codigo = v_prp_codigo
    where prp_codigo = v_prp_codjuncao;*/

    /*****************************************************************
    CANCELA A PROPOSTA DA JUNC?O
    ******************************************************************/
    DECLARE
      V_CLI_CODIGO PROPOSTA.CLI_CODIGO%TYPE;
    BEGIN
      SELECT CLI_CODIGO
        INTO V_CLI_CODIGO
        FROM PROPOSTA
       WHERE PRP_CODIGO = V_PRP_CODJUNCAO;

      --ATUALIZA SITUAC?O
      UPDATE PROPOSTA
         SET PRP_SITUACAO     = 'PE',
             CLI_CODIGO       = V_CLI_CODIGO,
             PRP_PORQUEPERDEU = 'INCORPORADA A PROPOSTA N? ' ||
                                TO_CHAR(V_PRP_CODIGO),
             PRP_ALTERADATA   = SYSDATE,
             PRP_ALTERAPOR    = V_USUARIO
       WHERE PRP_CODIGO = V_PRP_CODJUNCAO;
    END;
    /*****************************************************************
     RECALCULA A PROPOSTA ORIGEM
    ******************************************************************/
    DECLARE
      V_PRP_VALORTOTAL         PROPOSTA.PRP_VALORTOTAL%TYPE;
      V_PRP_MEDIAMARKUP        PROPOSTA.PRP_MEDIAMARKUP%TYPE;
      V_PRP_VALORTOTALTABELA   PROPOSTA.PRP_VALORTOTALTABELA%TYPE;
      V_PRP_VALORTOTALIPI      PROPOSTA.PRP_VALORTOTALIPI%TYPE;
      V_PRP_VALORTOTALDESCONTO PROPOSTA.PRP_VALORTOTALDESCONTO%TYPE;
      V_PRP_OVERDESCONTO       PROPOSTA.PRP_OVERDESCONTO%TYPE;
      V_CLI_CODIGO             PROPOSTA.CLI_CODIGO%TYPE;
      V_PRP_SITUACAO           PROPOSTA.PRP_SITUACAO%TYPE;
    BEGIN
      SELECT SUM(PRI_VALORTOTAL),
             SUM(PRI_PERCENTUALMARKUP),
             SUM(PRI_VALORDESCONTO),
             SUM(PRI_VALORIPI),
             SUM(PRI_QUANTIDADE * PRI_VALORUNITARIOTABELA)
        INTO V_PRP_VALORTOTAL,
             V_PRP_MEDIAMARKUP,
             V_PRP_VALORTOTALDESCONTO,
             V_PRP_VALORTOTALIPI,
             V_PRP_VALORTOTALTABELA
        FROM PROPOSTA_ITEM
       WHERE PRP_CODIGO = V_PRP_CODIGO;

      SELECT CLI_CODIGO, PRP_SITUACAO
        INTO V_CLI_CODIGO, V_PRP_SITUACAO
        FROM PROPOSTA
       WHERE PRP_CODIGO = V_PRP_CODIGO;
      -- CALCULA A MEDIA DE MARKUP
      DECLARE
        N_ITEM INTEGER;
      BEGIN
        SELECT COUNT(*)
          INTO N_ITEM
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PRP_CODIGO;
        V_PRP_MEDIAMARKUP := V_PRP_MEDIAMARKUP / N_ITEM;
      END;
      -----------------------------------------------------
      IF (V_PRP_VALORTOTAL > V_PRP_VALORTOTALTABELA) AND
         (V_PRP_VALORTOTALTABELA > 0) THEN
        V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTAL - V_PRP_VALORTOTALTABELA) /
                              V_PRP_VALORTOTAL) * 100;
      ELSIF (V_PRP_VALORTOTALTABELA > V_PRP_VALORTOTAL) AND
            (V_PRP_VALORTOTAL > 0) THEN
        V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTALTABELA - V_PRP_VALORTOTAL) /
                              V_PRP_VALORTOTALTABELA) * 100;
      END IF;
      UPDATE PROPOSTA
         SET PRP_VALORTOTAL         = V_PRP_VALORTOTAL,
             PRP_VALORTOTALTABELA   = V_PRP_VALORTOTALTABELA,
             PRP_VALORTOTALIPI      = V_PRP_VALORTOTALIPI,
             PRP_VALORTOTALDESCONTO = V_PRP_VALORTOTALDESCONTO,
             PRP_MEDIAMARKUP        = V_PRP_MEDIAMARKUP,
             PRP_OVERDESCONTO       = V_PRP_OVERDESCONTO,
             CLI_CODIGO             = V_CLI_CODIGO,
             PRP_SITUACAO           = V_PRP_SITUACAO
       WHERE PRP_CODIGO = V_PRP_CODIGO;
    END;
    COMMIT;
  EXCEPTION
    WHEN E_PROPOSTA_NAO_ENCONTRADA THEN
      RAISE_APPLICATION_ERROR(-20050, FNC_MENSAGEM_ERRO(20050));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE
  END PRC_UNIAO_PROPOSTA;
  /****************************************************************************/
  /* PROCEDURE GRAVA PROPOSTA FORMULARIO                                       */
  /* PARAMETROS - V_USUARIO = NOME DO USUARIO QUE ESTA CADASTRANDO            */
  /*            - V_TIPO    = VALOR NUMERICO 1-INCLUIR / 2-ALTERAR / 3-EXCLUIR*/
  /* ID          : PROCEDURE DE GRAVACAO DE FORMULARIOS                       */
  /* AUTOR       : CARLOS                                                     */
  /* CRIADO EM   : 11/01/2001                                                 */
  /* ALTERADO POR: CARLOS                                                     */
  /* ALTERADO EM : 19/01/2001                                                 */
  /* OBSERVACOES : EFETUA A OPERAC?O DE INCLUS?O (V_TIPO = 1),                */
  /*               ALTERAC?O (V_TIPO = 2) OU UMA EXCLUS?O (V_TIPO = 3) NA     */
  /*               TABELA FUNCIONARIO_FORMULARIO.                                 */
  /****************************************************************************/
  PROCEDURE PRC_GRAVA_FORMULARIO(V_PRP_CODIGO    IN PROPOSTA_FORMULARIO.PRP_CODIGO%TYPE,
                                 V_FRM_CODIGO    IN PROPOSTA_FORMULARIO.FRM_CODIGO%TYPE,
                                 V_VALORCARACTER IN PROPOSTA_FORMULARIO.PRF_VALORCARACTER%TYPE,
                                 V_VALORNUMERICO IN PROPOSTA_FORMULARIO.PRF_VALORNUMERICO%TYPE,
                                 V_VALORDATA     IN PROPOSTA_FORMULARIO.PRF_VALORDATA%TYPE,
                                 V_VALORTEXTO    IN PROPOSTA_FORMULARIO.PRF_VALORTEXTO%TYPE,
                                 V_USUARIO       IN PROPOSTA_FORMULARIO.PRF_INCLUIPOR%TYPE,
                                 V_TIPO_OPERACAO IN INTEGER) IS
    CONT_REG INTEGER;
    V_TIPO   INTEGER;
    V_CODIGO INTEGER;
    ERR_COD_NULL EXCEPTION;
    ERR_TIPO_INVALIDO EXCEPTION;
  BEGIN
    V_TIPO := V_TIPO_OPERACAO;
    IF V_TIPO_OPERACAO = 2 THEN
      BEGIN
        -- VERIFICA SE O CLIENTE JA EXISTE
        SELECT PRP_CODIGO
          INTO V_CODIGO
          FROM PROPOSTA_FORMULARIO
         WHERE (PRP_CODIGO = V_PRP_CODIGO)
           AND (FRM_CODIGO = V_FRM_CODIGO);
        -------------------------------------------------------------
      EXCEPTION
        WHEN NO_DATA_FOUND THEN
          -- SE OCORRER UM CODIGO NULO
          V_TIPO := 1;
      END;
    END IF;
    IF V_TIPO = 1 THEN
      -- INCLUS?O DE UM PROPOSTA_FORMULARIO
      IF (V_PRP_CODIGO IS NULL OR V_FRM_CODIGO IS NULL) THEN
        RAISE ERR_COD_NULL;
      END IF;
      INSERT INTO PROPOSTA_FORMULARIO
        (PRP_CODIGO,
         FRM_CODIGO,
         PRF_VALORCARACTER,
         PRF_VALORNUMERICO,
         PRF_VALORDATA,
         PRF_VALORTEXTO,
         PRF_INCLUIDATA,
         PRF_INCLUIPOR,
         PRF_ALTERADATA,
         PRF_ALTERAPOR)
      VALUES
        (V_PRP_CODIGO,
         V_FRM_CODIGO,
         V_VALORCARACTER,
         V_VALORNUMERICO,
         V_VALORDATA,
         V_VALORTEXTO,
         SYSDATE,
         V_USUARIO,
         SYSDATE,
         V_USUARIO);
    ELSIF V_TIPO = 2 THEN
      -- ALTERAC?O DE FORMULARIO
      IF (V_PRP_CODIGO IS NULL OR V_FRM_CODIGO IS NULL) THEN
        RAISE ERR_COD_NULL;
      END IF;
      SELECT COUNT(*)
        INTO CONT_REG
        FROM PROPOSTA_FORMULARIO
       WHERE (PRP_CODIGO = V_PRP_CODIGO)
         AND (FRM_CODIGO = V_FRM_CODIGO);
      IF (CONT_REG > 0) THEN
        UPDATE PROPOSTA_FORMULARIO
           SET PRF_VALORCARACTER = V_VALORCARACTER,
               PRF_VALORNUMERICO = V_VALORNUMERICO,
               PRF_VALORDATA     = V_VALORDATA,
               PRF_VALORTEXTO    = V_VALORTEXTO,
               PRF_ALTERADATA    = SYSDATE,
               PRF_ALTERAPOR     = V_USUARIO
         WHERE (PRP_CODIGO = V_PRP_CODIGO)
           AND (FRM_CODIGO = V_FRM_CODIGO);
      ELSIF (CONT_REG = 0) THEN
        INSERT INTO PROPOSTA_FORMULARIO
          (PRP_CODIGO,
           FRM_CODIGO,
           PRF_VALORCARACTER,
           PRF_VALORNUMERICO,
           PRF_VALORDATA,
           PRF_VALORTEXTO,
           PRF_INCLUIDATA,
           PRF_INCLUIPOR,
           PRF_ALTERADATA,
           PRF_ALTERAPOR)
        VALUES
          (V_PRP_CODIGO,
           V_FRM_CODIGO,
           V_VALORCARACTER,
           V_VALORNUMERICO,
           V_VALORDATA,
           V_VALORTEXTO,
           SYSDATE,
           V_USUARIO,
           SYSDATE,
           V_USUARIO);
      END IF;
    ELSIF V_TIPO = 3 THEN
      -- EXCLUS?O DE FORMULARIO
      IF (V_PRP_CODIGO IS NULL OR V_FRM_CODIGO IS NULL) THEN
        RAISE ERR_COD_NULL;
      END IF;
      DELETE FROM PROPOSTA_FORMULARIO
       WHERE (PRP_CODIGO = V_PRP_CODIGO)
         AND (FRM_CODIGO = V_FRM_CODIGO);
    ELSE
      -- SE O TIPO DA OPERAC?O N?O FOR NEM UM DOS TRES TIPO POSSIVEIS
      RAISE ERR_TIPO_INVALIDO; -- DISPARA O ERRO DE TIPO INVALIDO
    END IF;
  EXCEPTION
    -- TRATAMENTO DAS EXCEC?ES
    WHEN ERR_COD_NULL THEN
      -- SE OCORRER UM CODIGO NULO
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE_APPLICATION_ERROR(-20000, FNC_GET_ERROR_MSG(20000));
    WHEN ERR_TIPO_INVALIDO THEN
      -- SE OCORRER UMA CHAMADA COM O TIPO INVALIDO
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
      RAISE_APPLICATION_ERROR(-20021, FNC_GET_ERROR_MSG(20021));
    WHEN OTHERS THEN
      -- SE OCORRER UM OUTRO ERRO QUALQUER PELO ORACLE,
      IF SQLCODE = -2292 THEN
        -- SE EXISTIR MOVIMENTO DESTE PRODUTO
        RAISE_APPLICATION_ERROR(-20058, FNC_GET_ERROR_MSG(20058));
      ELSE
        RAISE; -- DISPARA O ERRO ORIGINAL DO ORACLE
      END IF;
      ROLLBACK WORK; -- DESFAZ QUALQUER OPERAC?O
  END PRC_GRAVA_FORMULARIO;

  --------------------------------------------------------------------------------------------------------------
  -- CRIADO:   13/05/2009 - LUCAS GOULARTE
  -- ALTERADO:

  PROCEDURE PRC_PREVISAO_VENDAS(V_PSV_CODIGO   IN OUT PREVISAO_VENDAS.PSV_CODIGO %TYPE,
                                V_PSV_SITUACAO IN PREVISAO_VENDAS.PSV_SITUACAO %TYPE,
                                V_VEN_CODIGO   IN PREVISAO_VENDAS.VEN_CODIGO %TYPE,
                                V_PSV_NOME     IN PREVISAO_VENDAS.PSV_NOME %TYPE,
                                V_USUARIO      IN VARCHAR2,
                                V_OPERACAO     IN INTEGER,
                                V_PRODUTO      IN PREVISAO_VENDAS.PSV_PRODUTO %TYPE) IS
  BEGIN
    IF V_OPERACAO = 1 THEN
      SELECT SQN_PREVISAO_VENDAS.NEXTVAL INTO V_PSV_CODIGO FROM DUAL;
      INSERT INTO PREVISAO_VENDAS
        (PSV_CODIGO,
         PSV_SITUACAO,
         VEN_CODIGO,
         PSV_NOME,
         PSV_INCLUIDOPOR,
         PSV_INCLUIDATA,
         PSV_PRODUTO)

      VALUES
        (V_PSV_CODIGO,
         'PN',
         V_VEN_CODIGO,
         V_PSV_NOME,
         V_USUARIO,
         SYSDATE,
         V_PRODUTO);

    ELSIF V_OPERACAO = 2 THEN
      UPDATE PREVISAO_VENDAS
         SET PSV_SITUACAO = V_PSV_SITUACAO
             --           , VEN_CODIGO       = V_VEN_CODIGO
             --           , PSV_NOME         = V_PSV_NOME
            ,
             PSV_ALTERADOPOR = V_USUARIO,
             PSV_ALTERADATA  = SYSDATE
       WHERE PSV_CODIGO = V_PSV_CODIGO;

    ELSIF V_OPERACAO = 3 THEN
      --DELETE FROM PREVISAO_VENDAS WHERE PSV_CODIGO = V_PSV_CODIGO;
      UPDATE PREVISAO_VENDAS
         SET PSV_SITUACAO    = 'CA',
             PSV_ALTERADOPOR = V_USUARIO,
             PSV_ALTERADATA  = SYSDATE
       WHERE PSV_CODIGO = V_PSV_CODIGO;

    ELSIF V_OPERACAO = 4 THEN
      -- Muda Status PN / OK
      UPDATE PREVISAO_VENDAS
         SET PSV_SITUACAO    = V_PSV_SITUACAO,
             PSV_APROVADOPOR = V_USUARIO,
             PSV_APROVADATA  = SYSDATE
       WHERE PSV_CODIGO = V_PSV_CODIGO;

    ELSIF V_OPERACAO = 5 THEN
      -- Muda Status FN
      UPDATE PREVISAO_VENDAS
         SET PSV_SITUACAO    = V_PSV_SITUACAO,
             PSV_ALTERADOPOR = V_USUARIO,
             PSV_ALTERADATA  = SYSDATE
       WHERE PSV_CODIGO = V_PSV_CODIGO;

    ELSIF V_OPERACAO = 6 THEN
      -- Muda Status OK / PN
      UPDATE PREVISAO_VENDAS
         SET PSV_SITUACAO    = V_PSV_SITUACAO,
             PSV_APROVADOPOR = NULL,
             PSV_APROVADATA  = NULL
       WHERE PSV_CODIGO = V_PSV_CODIGO;

    END IF;

    IF V_OPERACAO IN (3, 4, 5, 6) THEN
      COMMIT;
    END IF;

  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

  END PRC_PREVISAO_VENDAS;
  --------------------------------------------------------------------------------------------------------------

  --------------------------------------------------------------------------------------------------------------
  PROCEDURE PRC_PREVISAO_VENDAS_ITEM(V_PSV_CODIGO     IN PREVISAO_VENDAS_ITEM.PSV_CODIGO %TYPE,
                                     V_PSI_ITEM       IN PREVISAO_VENDAS_ITEM.PSI_ITEM %TYPE,
                                     V_PSI_REFERENCIA IN PREVISAO_VENDAS_ITEM.PSI_REFERENCIA %TYPE,
                                     V_PSI_DESCRICAO  IN PREVISAO_VENDAS_ITEM.PSI_DESCRICAO %TYPE,
                                     V_PSI_VENDA1     IN PREVISAO_VENDAS_ITEM.PSI_VENDA1 %TYPE,
                                     V_PSI_VENDA2     IN PREVISAO_VENDAS_ITEM.PSI_VENDA2 %TYPE,
                                     V_PSI_VENDA3     IN PREVISAO_VENDAS_ITEM.PSI_VENDA3 %TYPE,
                                     V_PSI_PREV1      IN PREVISAO_VENDAS_ITEM.PSI_PREV1 %TYPE,
                                     V_PSI_PREV2      IN PREVISAO_VENDAS_ITEM.PSI_PREV2 %TYPE,
                                     V_PSI_PREV3      IN PREVISAO_VENDAS_ITEM.PSI_PREV3 %TYPE,
                                     V_PSI_QTDEAP     IN PREVISAO_VENDAS_ITEM.PSI_QTDEAP %TYPE,
                                     V_OPERACAO       IN INTEGER,
                                     V_COMMIT         IN VARCHAR2) IS
    V_MES1 NUMBER := 0;
    V_MES2 NUMBER := 0;
    V_MES3 NUMBER := 0;

  BEGIN

    IF V_OPERACAO = 1 THEN
      -- Busca as Vendas dos Meses anteriores
      --Declare

      --  Begin

      SELECT NVL(MES1.QTDE1, 0) MES1,
             NVL(MES2.QTDE2, 0) MES2,
             NVL(MES3.QTDE3, 0) MES3
        INTO V_MES1, V_MES2, V_MES3
        FROM (SELECT PR.PRO_CODIGO, PR.PRO_REFERENCIA, PR.PRO_DESCRICAO
                FROM PRODUTO PR
               WHERE PR.PRO_ATIVO = '1'
                 AND PR.GRU_CODIGO = 1
                 AND PR.PRO_REFERENCIA = V_PSI_REFERENCIA) P,

             (SELECT I.PRO_CODIGO, SUM(I.NFI_QUANTIDADE) QTDE3
                FROM NF_UNICA_ITEM I, NF_UNICA N
               WHERE I.NFU_CODIGO = N.NFU_CODIGO
                 AND I.NFU_SERIE = N.NFU_SERIE
                 AND N.NFU_SITUACAO <> 'CA'
                 AND N.NFU_VENDEDORINTERNO = 1
                 AND N.NFU_DATAEMISSAO BETWEEN
                     add_months(Trunc(SYSDATE, 'month'), -3) AND
                     last_day(add_months(Trunc(SYSDATE), -3))
               GROUP BY I.PRO_CODIGO) mes3,

             (SELECT I.PRO_CODIGO, SUM(I.NFI_QUANTIDADE) QTDE2
                FROM NF_UNICA_ITEM I, NF_UNICA N
               WHERE I.NFU_CODIGO = N.NFU_CODIGO
                 AND I.NFU_SERIE = N.NFU_SERIE
                 AND N.NFU_VENDEDORINTERNO = 1
                 AND N.NFU_SITUACAO <> 'CA'
                 AND N.NFU_DATAEMISSAO BETWEEN
                     add_months(Trunc(SYSDATE, 'month'), -2) AND
                     last_day(add_months(Trunc(SYSDATE), -2))
               GROUP BY I.PRO_CODIGO) mes2,

             (SELECT I.PRO_CODIGO, SUM(I.NFI_QUANTIDADE) QTDE1
                FROM NF_UNICA_ITEM I, NF_UNICA N
               WHERE I.NFU_CODIGO = N.NFU_CODIGO
                 AND I.NFU_SERIE = N.NFU_SERIE
                 AND N.NFU_VENDEDORINTERNO = 1
                 AND N.NFU_SITUACAO <> 'CA'
                 AND N.NFU_DATAEMISSAO BETWEEN
                     add_months(Trunc(SYSDATE, 'month'), -1) AND
                     last_day(add_months(Trunc(SYSDATE), -1))
               GROUP BY I.PRO_CODIGO) mes1

       WHERE P.PRO_CODIGO = MES1.PRO_CODIGO(+)
         AND P.PRO_CODIGO = MES2.PRO_CODIGO(+)
         AND P.PRO_CODIGO = MES3.PRO_CODIGO(+);

      --  Exception
      --raise_application_error(-20000,'Produto n?o Localizado !');

      -- End;
      INSERT INTO PREVISAO_VENDAS_ITEM
        (PSV_CODIGO,
         PSI_ITEM,
         PSI_REFERENCIA,
         PSI_DESCRICAO,
         PSI_VENDA1,
         PSI_VENDA2,
         PSI_VENDA3,
         PSI_PREV1,
         PSI_PREV2,
         PSI_PREV3,
         PSI_QTDEAP)

      VALUES
        (V_PSV_CODIGO,
         V_PSI_ITEM,
         V_PSI_REFERENCIA,
         V_PSI_DESCRICAO,
         V_MES1,
         V_MES2,
         V_MES3,
         V_PSI_PREV1,
         V_PSI_PREV2,
         V_PSI_PREV3,
         V_PSI_QTDEAP);

    END IF;

    IF V_OPERACAO = 2 THEN
      DELETE FROM PREVISAO_VENDAS_ITEM WHERE PSV_CODIGO = V_PSV_CODIGO;
    END IF;

    IF V_OPERACAO = 4 THEN
      UPDATE PREVISAO_VENDAS_ITEM
         SET PSI_QTDEAP = V_PSI_QTDEAP
       WHERE PSV_CODIGO = V_PSV_CODIGO
         AND PSI_REFERENCIA = V_PSI_REFERENCIA;

    END IF;

    IF V_COMMIT = 'S' THEN
      COMMIT;
    END IF;

  EXCEPTION

    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

  END PRC_PREVISAO_VENDAS_ITEM;

  --------------------------------------------------------------------------------------------------------------
  PROCEDURE PRC_PREVISAO_VENDAS_ITEM_TMP(V_PSV_CODIGO     IN PREVISAO_VENDAS_ITEM.PSV_CODIGO %TYPE,
                                         V_PSI_REFERENCIA IN PREVISAO_VENDAS_ITEM.PSI_REFERENCIA %TYPE,
                                         V_PSI_DESCRICAO  IN PREVISAO_VENDAS_ITEM.PSI_DESCRICAO %TYPE,
                                         V_PSI_PREV1      IN PREVISAO_VENDAS_ITEM.PSI_PREV1 %TYPE,
                                         V_PSI_PREV2      IN PREVISAO_VENDAS_ITEM.PSI_PREV2 %TYPE,
                                         V_PSI_PREV3      IN PREVISAO_VENDAS_ITEM.PSI_PREV3 %TYPE)

   IS
  BEGIN
    INSERT INTO PREVISAO_VENDAS_ITEM_TMP
      (PSV_CODIGO,
       PSI_REFERENCIA,
       PSI_DESCRICAO,
       PSI_PREV1,
       PSI_PREV2,
       PSI_PREV3)

    VALUES
      (V_PSV_CODIGO,
       SUBSTR(V_PSI_REFERENCIA, 1, 45),
       V_PSI_DESCRICAO,
       V_PSI_PREV1,
       V_PSI_PREV2,
       V_PSI_PREV3);

  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

  END PRC_PREVISAO_VENDAS_ITEM_TMP;

  --------------------------------------------------------------------------------------------------------------

  PROCEDURE PRC_PREVISAO_VENDAS_ITEM_NEW(V_PSV_CODIGO     IN PREVISAO_VENDAS_ITEM.PSV_CODIGO %TYPE,
                                         V_PSI_ITEM       IN PREVISAO_VENDAS_ITEM.PSI_ITEM %TYPE,
                                         V_PSI_REFERENCIA IN PREVISAO_VENDAS_ITEM.PSI_REFERENCIA %TYPE,
                                         V_PSI_DESCRICAO  IN PREVISAO_VENDAS_ITEM.PSI_DESCRICAO %TYPE,
                                         V_PSI_VENDA1     IN PREVISAO_VENDAS_ITEM.PSI_VENDA1 %TYPE,
                                         V_PSI_VENDA2     IN PREVISAO_VENDAS_ITEM.PSI_VENDA2 %TYPE,
                                         V_PSI_VENDA3     IN PREVISAO_VENDAS_ITEM.PSI_VENDA3 %TYPE,
                                         V_PSI_PREV1      IN PREVISAO_VENDAS_ITEM.PSI_PREV1 %TYPE,
                                         V_PSI_PREV2      IN PREVISAO_VENDAS_ITEM.PSI_PREV2 %TYPE,
                                         V_PSI_PREV3      IN PREVISAO_VENDAS_ITEM.PSI_PREV3 %TYPE,
                                         V_PSI_QTDEAP     IN PREVISAO_VENDAS_ITEM.PSI_QTDEAP %TYPE,
                                         V_OPERACAO       IN INTEGER,
                                         V_COMMIT         IN VARCHAR2) IS
    V_MES1 NUMBER := 0;
    V_MES2 NUMBER := 0;
    V_MES3 NUMBER := 0;

  BEGIN

    IF V_OPERACAO = 2 THEN
      DELETE FROM PREVISAO_VENDAS_ITEM WHERE PSV_CODIGO = V_PSV_CODIGO;
    END IF;

    -- Busca as Vendas dos Meses anteriores
    --Declare

    --  Begin

    SELECT NVL(MES1.QTDE1, 0) MES1,
           NVL(MES2.QTDE2, 0) MES2,
           NVL(MES3.QTDE3, 0) MES3
      INTO V_MES1, V_MES2, V_MES3
      FROM (SELECT PR.PRO_CODIGO, PR.PRO_REFERENCIA, PR.PRO_DESCRICAO
              FROM PRODUTO PR
             WHERE PR.PRO_ATIVO = '1'
               AND PR.GRU_CODIGO = 1
               AND PR.PRO_REFERENCIA = V_PSI_REFERENCIA) P,

           (SELECT I.PRO_CODIGO, SUM(I.NFI_QUANTIDADE) QTDE3
              FROM NF_UNICA_ITEM I, NF_UNICA N
             WHERE I.NFU_CODIGO = N.NFU_CODIGO
               AND I.NFU_SERIE = N.NFU_SERIE
               AND N.NFU_SITUACAO <> 'CA'
               AND N.NFU_VENDEDORINTERNO = 1
               AND N.NFU_DATAEMISSAO BETWEEN
                   add_months(Trunc(SYSDATE, 'month'), -3) AND
                   last_day(add_months(Trunc(SYSDATE), -3))
             GROUP BY I.PRO_CODIGO) mes3,

           (SELECT I.PRO_CODIGO, SUM(I.NFI_QUANTIDADE) QTDE2
              FROM NF_UNICA_ITEM I, NF_UNICA N
             WHERE I.NFU_CODIGO = N.NFU_CODIGO
               AND I.NFU_SERIE = N.NFU_SERIE
               AND N.NFU_VENDEDORINTERNO = 1
               AND N.NFU_SITUACAO <> 'CA'
               AND N.NFU_DATAEMISSAO BETWEEN
                   add_months(Trunc(SYSDATE, 'month'), -2) AND
                   last_day(add_months(Trunc(SYSDATE), -2))
             GROUP BY I.PRO_CODIGO) mes2,

           (SELECT I.PRO_CODIGO, SUM(I.NFI_QUANTIDADE) QTDE1
              FROM NF_UNICA_ITEM I, NF_UNICA N
             WHERE I.NFU_CODIGO = N.NFU_CODIGO
               AND I.NFU_SERIE = N.NFU_SERIE
               AND N.NFU_VENDEDORINTERNO = 1
               AND N.NFU_SITUACAO <> 'CA'
               AND N.NFU_DATAEMISSAO BETWEEN
                   add_months(Trunc(SYSDATE, 'month'), -1) AND
                   last_day(add_months(Trunc(SYSDATE), -1))
             GROUP BY I.PRO_CODIGO) mes1

     WHERE P.PRO_CODIGO = MES1.PRO_CODIGO(+)
       AND P.PRO_CODIGO = MES2.PRO_CODIGO(+)
       AND P.PRO_CODIGO = MES3.PRO_CODIGO(+);

    --  Exception
    --raise_application_error(-20000,'Produto n?o Localizado !');

    -- End;
    INSERT INTO PREVISAO_VENDAS_ITEM
      (PSV_CODIGO,
       PSI_ITEM,
       PSI_REFERENCIA,
       PSI_DESCRICAO,
       PSI_VENDA1,
       PSI_VENDA2,
       PSI_VENDA3,
       PSI_PREV1,
       PSI_PREV2,
       PSI_PREV3,
       PSI_QTDEAP)

    VALUES
      (V_PSV_CODIGO,
       V_PSI_ITEM,
       V_PSI_REFERENCIA,
       V_PSI_DESCRICAO,
       V_MES1,
       V_MES2,
       V_MES3,
       V_PSI_PREV1,
       V_PSI_PREV2,
       V_PSI_PREV3,
       V_PSI_QTDEAP);

    IF V_COMMIT = 'S' THEN
      COMMIT;
    END IF;

  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

  END PRC_PREVISAO_VENDAS_ITEM_NEW;

  --------------------------------------------------------------------------------------------------------------
  /*****************************************************************************/
  /* PROCEDURE CHECAR DESCONTO NA PROPOSTA                                     */
  /* PARAMETROS - V_PRP_CODIGO = N? DA PROPOSTA                                */
  /*            - V_MSG_RETORNO = Mensagem de retorno, com os itens            */
  /*                              encontrados com problema (se houver)         */
  /*            - V_RETORNO = 0-Existe desconto indevido... 1-OK descontos     */
  /*                          dentro das margens permitidas.                    */
  /* ID          : PROCEDURE CHECAR DESCONTO NA PROPOSTA                       */
  /* AUTOR       : Elio Junior                                                 */
  /* CRIADO EM   : 04/10/2010                                                  */
  /* ALTERADO POR:                                                             */
  /* ALTERADO EM :                                                             */
  /* OBSERVACOES : VERIFICA SE OS ITENS DE UMA PROPOSTA, POSSUEM DESCONTO      */
  /*               ACIMA DO LIMITE MAXIMO PERMITIDO.                           */
  /*****************************************************************************/
  PROCEDURE PRC_CHECAR_DESCONTO_PROPOSTA(V_PRP_CODIGO  IN PROPOSTA.PRP_CODIGO %TYPE,
                                         V_MSG_RETORNO OUT VARCHAR2,
                                         V_RETORNO     OUT NUMBER) IS
    V_VEND_RMA VENDEDOR.VEN_CODIGO%TYPE;

    -- Select que extrai itens da Proposta cujo os valores apresentam um desconto acima do permitido...
    CURSOR Cur_Proposta IS
      SELECT PRI.Pri_Item, PRI.Pri_Referencia
        FROM PROPOSTA_ITEM PRI, PRODUTO P, DESCONTO D, Proposta PRA, CLIENTE C, SEGMENTO S, FABRICANTE F
       WHERE PRI.PRP_CODIGO = V_PRP_CODIGO
         AND P.Pro_Codigo = PRI.Pro_Codigo
         AND D.Des_Fabricante = P.Fab_Codigo
         AND D.Des_Tabela = PRI.Pri_TabelaVenda
         AND PRA.Prp_Codigo = PRI.Prp_Codigo
         AND PRA.PRP_VENDEDORINTERNO <> V_VEND_RMA -- RMA -- Futuramente adicionar ATC/PAT
         AND PRA.PRP_VENDEDOREXTERNO <> V_VEND_RMA -- RMA -- Futuramente adicionar ATC/PAT
         AND NOT PRA.PRP_SITUACAO IN ('CA', 'PE')
         AND (PRI.PRI_DESCONTOESPECIAL <> 'S')
         AND Round(PRI.pri_valorunitario, 2) <
              Round((P.pro_precovenda01 -
                     ((P.pro_precovenda01 * D.DES_FIM) / 100)), 2)
         AND PRA.CLI_CODIGO = C.CLI_CODIGO
         AND C.SEG_CODIGO = S.SEG_CODIGO
         AND P.FAB_CODIGO = F.FAB_CODIGO
         AND PRI.PRI_TIPOVPC != 5
         AND C.CLI_SUFRAMA = 'N';
    REC_Proposta Cur_Proposta%ROWTYPE;
  BEGIN
    V_MSG_RETORNO := '';
    V_RETORNO     := 0;

    V_VEND_RMA := TO_NUMBER(FNC_BUSCAREGRA('RMA', 'CODIGO_VENDEDOR'));

    FOR REC_PROPOSTA IN CUR_PROPOSTA LOOP
      IF (V_MSG_RETORNO = '') OR (V_MSG_RETORNO IS NULL) THEN
        V_MSG_RETORNO := 'Proposta: ' || V_PRP_CODIGO ||
                         ' possue itens com valores abaixo do permitido:' ||
                         CHR(13) || CHR(10);
      END IF;

      V_MSG_RETORNO := V_MSG_RETORNO || 'Item: ' || Rec_Proposta.Pri_Item ||
                       ' | Referencia: ' || Rec_Proposta.Pri_Referencia ||
                       CHR(13) || CHR(10);
    END LOOP;

    IF (V_MSG_RETORNO = '') OR (V_MSG_RETORNO IS NULL) THEN
      V_RETORNO := 1;
    END IF;
  END PRC_CHECAR_DESCONTO_PROPOSTA;
  --------------------------------------------------------------------------------------------------------------
  /*****************************************************************************/
  /* PROCEDURE PROPOSTA RESERVA                                                */
  /* PARAMETROS - V_PRP_CODIGO = N? DA PROPOSTA                                */
  /*            - V_MOTIVO = Motivo de Reserva da Proposta                     */
  /*            - V_DATA   = Data de Reserva da Proposta baseada na RN         */
  /* AUTOR       : Aline Freire                                                */
  /* CRIADO EM   : 09/11/2010                                                  */
  /* ALTERADO POR:                                                             */
  /* ALTERADO EM :                                                             */
  /* OBSERVACOES : Cadastra Reserva de Proposta.                               */
  /*****************************************************************************/
  PROCEDURE PRC_PROPOSTA_RESERVA(V_PRP_CODIGO IN PROPOSTA_RESERVA.PRP_CODIGO %TYPE,
                                 V_DATA       IN PROPOSTA_RESERVA.PRS_DATA %TYPE,
                                 V_MOTIVO     IN PROPOSTA_RESERVA.PRS_MOTIVO %TYPE,
                                 V_USUARIO    IN PROPOSTA_RESERVA.PRS_INCLUIPOR%TYPE,
                                 V_DIAS       IN INTEGER)
  IS
  V_DATAUTIL DATE;
  V_QTDEUTIL NUMBER := 0;
  BEGIN
    IF ((V_DATA IS NULL) AND (V_DIAS IS NULL)) THEN
      RAISE_APPLICATION_ERROR(-20500,
                              'O campo Data da Reserva e obrigatorio!');
    END IF;

    IF V_MOTIVO IS NULL THEN
      RAISE_APPLICATION_ERROR(-20500,
                              'O campo Motivo da Reserva e obrigatorio!');
    END IF;

    V_QTDEUTIL := fnc_diasuteis(SYSDATE, SYSDATE+V_DIAS, 1);
    IF V_QTDEUTIL != V_DIAS THEN
      V_DATAUTIL := SYSDATE+V_DIAS+(V_DIAS-V_QTDEUTIL);
    ELSE
      V_DATAUTIL := SYSDATE+V_DIAS;
    END IF;

    -- João Riguette 13/12/2016 -> Tratamento para final de semana na prorrogação de reserva
    IF TO_NUMBER(TO_CHAR(V_DATAUTIL,'D')) = 7 THEN    -- Sabado
      V_DATAUTIL := to_date(V_DATAUTIL)+2;
    ELSIF TO_NUMBER(TO_CHAR(V_DATAUTIL,'D')) = 1 THEN -- Domingo
      V_DATAUTIL := to_date(V_DATAUTIL)+1;
    END IF;

    V_DATAUTIL := TO_CHAR(V_DATAUTIL, 'DD/MM/RRRR');

    INSERT INTO PROPOSTA_RESERVA
      (PRS_CODIGO,
       PRP_CODIGO,
       PRS_DATA,
       PRS_MOTIVO,
       PRS_INCLUIDATA,
       PRS_INCLUIPOR)
    VALUES
      (SQN_RESERVA.NEXTVAL,
       V_PRP_CODIGO,
       V_DATAUTIL,
       V_MOTIVO,
       SYSDATE,
       V_USUARIO);

    COMMIT;

  END PRC_PROPOSTA_RESERVA;
---------------------------------------------------------------------------------------------------------------------
  PROCEDURE PRC_DESCONTOINC_ITEM(V_PRP_CODIGO            IN PROPOSTA_ITEM.PRP_CODIGO           %TYPE,
                                 V_PRI_SEQUENCIA         IN PROPOSTA_ITEM.PRI_SEQUENCIA        %TYPE,
                                 V_PRO_CODIGO            IN PROPOSTA_ITEM.PRO_CODIGO           %TYPE,
                                 V_PRI_VALORIPI          IN PROPOSTA_ITEM.PRI_VALORIPI         %TYPE,
                                 V_PRI_VALORTOTAL        IN PROPOSTA_ITEM.PRI_VALORTOTAL       %TYPE,
                                 V_PRI_VALORICMSST       IN PROPOSTA_ITEM.PRI_VALORICMSST      %TYPE,
                                 V_PRI_BASECALCULOICMSST IN PROPOSTA_ITEM.PRI_BASECALCULOICMSST%TYPE,
                                 V_PRI_BASECALCULOICMS   IN PROPOSTA_ITEM.PRI_BASECALCULOICMS  %TYPE,
                                 V_PRI_VALORICMS         IN PROPOSTA_ITEM.PRI_VALORICMS        %TYPE,
                                 V_PRI_VALORDESC         IN PROPOSTA_ITEM.PRI_VALORDESCONTO    %TYPE,
                                 V_PRI_PERCDESC          IN PROPOSTA_ITEM.PRI_DESCONTO         %TYPE,
                                 V_COMMIT                IN VARCHAR2,
                                -- V_PRI_VALORDESCINCOND   IN PROPOSTA_ITEM.PRI_VALORDESCINCOND  %TYPE,
                                 V_PRI_PERDESCIN         IN PROPOSTA_ITEM.PRI_PERDESCIN        %TYPE,
                                 V_PRI_VLRDESCIN         IN PROPOSTA_ITEM.PRI_VLRDESCIN        %TYPE) IS
BEGIN

    -- GRAVA NOVOS VALORES APOS DESCONTO INCONDICIONAL
    UPDATE PROPOSTA_ITEM
       SET PRI_VALORIPI          = V_PRI_VALORIPI         ,
           PRI_VALORTOTAL        = V_PRI_VALORTOTAL       ,
           PRI_VALORICMSST       = V_PRI_VALORICMSST      ,
           PRI_BASECALCULOICMSST = V_PRI_BASECALCULOICMSST,
           PRI_BASECALCULOICMS   = V_PRI_BASECALCULOICMS  ,
           PRI_VALORICMS         = V_PRI_VALORICMS        ,
           PRI_VALORDESCONTO     = V_PRI_VALORDESC
           --PRI_DESCONTO          = V_PRI_PERCDESC   --> Cassio 05/11/2014
         --, PRI_VALORDESCINCOND   = V_PRI_VALORDESCINCOND
         , PRI_PERDESCIN         = V_PRI_PERDESCIN
         , PRI_VLRDESCIN         = V_PRI_VLRDESCIN
     WHERE PRP_CODIGO    = V_PRP_CODIGO
       AND PRI_SEQUENCIA = V_PRI_SEQUENCIA
       AND PRO_CODIGO    = V_PRO_CODIGO   ;

    IF V_COMMIT = 'S' THEN
      COMMIT;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

END PRC_DESCONTOINC_ITEM;

---------------------------------------------------------------------------------------------------------------------
  PROCEDURE PRC_DESCONTOINC(V_PRP_CODIGO              IN PROPOSTA.PRP_CODIGO             %TYPE,
                            V_PRP_VALORTOTALIPI       IN PROPOSTA.PRP_VALORTOTALIPI      %TYPE,
                            V_PRP_VALORTOTAL          IN PROPOSTA.PRP_VALORTOTAL         %TYPE,
                            V_PRP_VALORTOTALICMSST    IN PROPOSTA.PRP_VALORTOTALICMSST   %TYPE,
                            V_PRP_TOTALBASECALCICMSST IN PROPOSTA.PRP_TOTALBASECALCICMSST%TYPE,
                            V_PRP_BASECALCULOICMS     IN PROPOSTA.PRP_BASECALCULOICMS    %TYPE,
                            V_PRP_VALORTOTALICMS      IN PROPOSTA.PRP_VALORTOTALICMS     %TYPE,
                            V_PRP_VALORTOTALDESCONTO  IN PROPOSTA.PRP_VALORTOTALDESCONTO %TYPE,
                            V_PRP_DESCINC             IN PROPOSTA.PRP_DESCINC            %TYPE,
                            V_COMMIT                  IN VARCHAR2 ) IS
BEGIN

    -- GRAVA NOVOS VALORES APOS DESCONTO INCONDICIONAL
   -- raise_application_error(-20000,V_PRP_VALORTOTALICMSST);
    UPDATE PROPOSTA
       SET PRP_VALORTOTALIPI       =V_PRP_VALORTOTALIPI      ,
           PRP_VALORTOTAL          =V_PRP_VALORTOTAL         ,
           PRP_VALORTOTALICMSST    =V_PRP_VALORTOTALICMSST   ,
           PRP_TOTALBASECALCICMSST =V_PRP_TOTALBASECALCICMSST,
           PRP_BASECALCULOICMS     =V_PRP_BASECALCULOICMS    ,
           PRP_VALORTOTALICMS      =V_PRP_VALORTOTALICMS     ,
           PRP_VALORTOTALDESCONTO  =V_PRP_VALORTOTALDESCONTO ,
           PRP_DESCINC             =V_PRP_DESCINC
     WHERE PRP_CODIGO    = V_PRP_CODIGO;

    IF V_COMMIT = 'S' THEN
      COMMIT;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

END PRC_DESCONTOINC;

---------------------------------------------------------------------------------------------------------------------
PROCEDURE PRC_GRAVA_PROPOSTA_WEB(V_PRP_CODIGO     IN OUT PROPOSTA_WEB.PRP_CODIGO%TYPE,
                                 V_PRP_CODIGO2    IN PROPOSTA_WEB.PRP_CODIGO%TYPE,
                                 V_TIPO           IN NUMBER,
                                 V_TIPOCC         IN NUMBER,
                                 V_COMMIT         IN VARCHAR DEFAULT 'N')

IS
  V_QTDE_CAB      NUMBER(1);
  V_QTDE_ITEM     NUMBER(4);
  V_CREDITO       NUMBER(14,2);
  V_TRIANGULACAO  PROPOSTA_WEB.PRP_TRIANGULACAO%TYPE;
  V_SQN_CCORRENTE PROPOSTA_CCORRENTE.PCC_CODIGO%TYPE;
  V_CLIENTE       PROPOSTA_WEB.CLI_CODIGO%TYPE;
  V_USUARIO       PROPOSTA_WEB.PRP_INCLUIPOR%TYPE;
  V_PCC_CODIGO    PROPOSTA_CCORRENTE.PCC_CODIGO%TYPE;
  V_VALOR_CRED    PROPOSTA.PRP_TOTAL_CRED_VPC%TYPE;
  V_CODIGO_PRP    PROPOSTA.PRP_CODIGO%TYPE;
  V_TRANSP        PROPOSTA.TRA_CODIGO%TYPE;
  V_TRANSP_PRAZO  PROPOSTA.TRA_PRAZO_ENTREGA%TYPE;
  V_PRP_FRETEPAGO PROPOSTA.PRP_FRETEPAGO%TYPE;
  V_DISPONIVEL    NUMBER(9);
  V_MSG           VARCHAR2(4000);
  V_SEM_SALDO     PROPOSTA_ITEM.PRI_ITEM%TYPE;
  V_QTDE_PRP      PROPOSTA_ITEM.PRI_QUANTIDADE%TYPE;
  V_EXISTE_BRINDE VARCHAR(1);

  CURSOR CABECALHO IS
    SELECT * FROM PROPOSTA_WEB T
      WHERE T.PRP_CODIGO = V_PRP_CODIGO;

  CURSOR ITENS IS
         SELECT * FROM PROPOSTA_ITEM_WEB T
          WHERE T.PRP_CODIGO = V_PRP_CODIGO
         ORDER BY T.PRI_ITEM;

  CURSOR CUR_MEMO IS
    SELECT * FROM PROPOSTA_MEMO_WEB T
      WHERE T.PRP_CODIGO = V_PRP_CODIGO;


BEGIN

  SELECT COUNT(*) INTO V_QTDE_CAB
    FROM PROPOSTA_WEB T
    WHERE T.PRP_CODIGO = V_PRP_CODIGO;

  SELECT COUNT(*) INTO V_QTDE_ITEM
    FROM PROPOSTA_ITEM_WEB T
    WHERE T.PRP_CODIGO = V_PRP_CODIGO;

  SELECT T.PRP_TRIANGULACAO INTO V_TRIANGULACAO
    FROM PROPOSTA_WEB T
    WHERE T.PRP_CODIGO = V_PRP_CODIGO;

  SELECT SUM(NVL(T.PRI_VALORCREDVPC,0)) INTO V_CREDITO
    FROM PROPOSTA_ITEM_WEB T
    WHERE T.PRP_CODIGO = V_PRP_CODIGO;

  SELECT T.CLI_CODIGO INTO V_CLIENTE
    FROM PROPOSTA_WEB T
    WHERE T.PRP_CODIGO = V_PRP_CODIGO;

  SELECT T.PRP_INCLUIPOR INTO V_USUARIO
    FROM PROPOSTA_WEB T
    WHERE T.PRP_CODIGO = V_PRP_CODIGO;

------------------------------------------------------------

-- VERIFICA SE EXISTEM ITENS SEM ESTOQUE NO MOMENTO DE SALVAR
  V_SEM_SALDO := 0;
  V_MSG := '';
  V_DISPONIVEL := 0;

  /*IF V_TIPO = 1 THEN
    FOR IT IN ITENS
      LOOP
        SELECT DISPONIVEL INTO V_DISPONIVEL
          FROM V$_ESTOQUE_RATEIO_COMERCIAL
         WHERE PRO_CODIGO = IT.PRO_CODIGO;

         IF IT.PRI_QUANTIDADE > V_DISPONIVEL THEN
           V_MSG := V_MSG || IT.PRI_REFERENCIA ||', ';
           V_SEM_SALDO := V_SEM_SALDO + 1;
         END IF;
    END LOOP;
  ELSIF V_TIPO = 2 THEN
    FOR IT IN ITENS
      LOOP
        SELECT PRI_QUANTIDADE INTO V_QTDE_PRP
          FROM PROPOSTA_ITEM
         WHERE PRP_CODIGO = V_PRP_CODIGO2
           AND PRO_CODIGO = IT.PRO_CODIGO;

        SELECT DISPONIVEL INTO V_DISPONIVEL
          FROM V$_ESTOQUE_RATEIO_COMERCIAL
         WHERE PRO_CODIGO = IT.PRO_CODIGO;

         IF IT.PRI_QUANTIDADE > (V_DISPONIVEL+V_QTDE_PRP) THEN
           V_MSG := V_MSG || IT.PRI_REFERENCIA ||', ';
           V_SEM_SALDO := V_SEM_SALDO + 1;
         END IF;
    END LOOP;
  END IF;*/

  IF V_SEM_SALDO > 0 THEN
    raise_application_error(-20000, 'O(s) item(s) '||V_MSG||' não possui saldo em estoque !');
  END IF;

  IF V_QTDE_CAB > 0 AND V_QTDE_CAB < 2 THEN
    IF V_QTDE_ITEM > 0 THEN

      IF V_PRP_CODIGO2 <> 0 THEN
        V_CODIGO_PRP := V_PRP_CODIGO2;
      ELSE
        V_CODIGO_PRP := 0;
      END IF;

      FOR CAB IN CABECALHO
      LOOP

        V_TRANSP := CAB.TRA_CODIGO;
        V_TRANSP_PRAZO:= CAB.TRA_PRAZO_ENTREGA;

        PRC_GRAVA_PROPOSTA(V_CODIGO_PRP
                           ,CAB.CLI_CODIGO
                           ,CAB.ORI_CODIGO
                           ,V_TRANSP
                           ,CAB.CPG_CODIGO
                           ,CAB.END_CODIGO
                           ,CAB.PTP_CODIGO
                           ,CAB.PRP_SITUACAO
                           ,CAB.PRP_NOME
                           ,CAB.PRP_ENDERECO
                           ,CAB.PRP_BAIRRO
                           ,CAB.PRP_CIDADE
                           ,CAB.PRP_UF
                           ,CAB.PRP_CEP
                           ,CAB.PRP_FONE
                           ,CAB.PRP_FAX
                           ,CAB.RAT_CODIGO
                           ,CAB.PRP_EMAIL
                           ,CAB.PRP_AOSCUIDADOS
                           ,CAB.PRP_DEPARTAMENTO
                           ,CAB.PRP_VENDEDORINTERNO
                           ,CAB.PRP_VENDEDOREXTERNO
                           ,CAB.PRP_VENDEDOROPERACIONAL
                           ,CAB.PRP_DATAEMISSAO
                           ,CAB.PRP_DATACONFIRMACAO
                           ,CAB.PRP_DATAFATURAMENTO
                           ,CAB.PRP_OBSERVACAONOTA
                           ,CAB.PRP_VALIDADE
                           ,CAB.PRP_DATAVALIDADE
                           ,CAB.PRP_ENTREGA
                           ,CAB.PRP_DATAENTREGA
                           ,CAB.PRP_SHIPDATE
                           ,CAB.PRP_PAIS
                           ,CAB.PRP_FOB
                           ,CAB.PRP_PROJECT
                           ,CAB.PRP_IMPOSTOS
                           ,CAB.PRP_VALORFRETE
                           ,CAB.PRP_FRETEPAGO
                           ,CAB.PRP_VALORTOTAL
                           ,CAB.PRP_VALORTOTALTABELA
                           ,CAB.PRP_VALORTOTALIPI
                           ,CAB.PRP_VALORTOTALDESCONTO
                           ,CAB.PRP_OVERDESCONTO
                           ,CAB.PRP_FORMACONFIRMA
                           ,CAB.PRP_TIPOFATURAMENTO
                           ,CAB.PRP_TIPOENTREGA
                           ,CAB.PRP_NUMEROPEDIDOCLIENTE
                           ,CAB.PRP_MEDIAMARKUP
                           ,CAB.PRP_PROPOSTAPAI
                           ,CAB.PRP_CONTROLECREDITO
                           ,CAB.PRP_INCLUIPOR
                           ,CAB.PRP_ISOACEITEPROPOSTA
                           ,CAB.PRP_ISOACEITEPEDIDO
                           ,V_TIPO
                           ,'N'
                           ,CAB.PRP_CONTROLAPRN
                           ,CAB.PRP_VALORTOTALICMSST
                           ,CAB.PRP_TOTALBASECALCICMSST
                           ,CAB.PRP_BASECALCULOICMS
                           ,CAB.PRP_VALORTOTALICMS
                           ,CAB.PRP_COMPLEMENTAR
                           ,CAB.PRP_ABATECRED
                           ,CAB.PRP_VALORCREDITO
                           ,CAB.PRP_TRIANGULACAO
                           ,CAB.PRT_CODIGO
                           ,CAB.PRP_TID
                           ,V_TRANSP_PRAZO
                           ,CAB.PRP_ICMSDESONTOTAL
                           ,CAB.PRP_VALOROUTROS
                           ,CAB.PRP_FINALIDADE
                           ,CAB.NAT_CODIGO);
      END LOOP;

      IF V_TIPO = 2 THEN
        DELETE PROPOSTA_ITEM T
          WHERE T.PRP_CODIGO = V_PRP_CODIGO2;
      END IF;

      V_EXISTE_BRINDE := 'N';

      FOR IT IN ITENS
      LOOP
        IF V_EXISTE_BRINDE = 'N' THEN
          IF IT.PRI_TIPOVPC = 5 THEN
            V_EXISTE_BRINDE := 'S';
          END IF;
        END IF;

        IF V_TIPO = 1 THEN
          PRC_GRAVA_PROPOSTA_ITEM(V_CODIGO_PRP
                                  ,IT.PRI_SEQUENCIA
                                  ,IT.PRO_CODIGO
                                  ,IT.PRI_TABELAVENDA
                                  ,IT.PRI_QUANTIDADE
                                  ,IT.PRI_UNIDADE
                                  ,IT.PRI_DESCRICAO
                                  ,IT.PRI_DESCRICAOTECNICA
                                  ,IT.PRI_REFERENCIA
                                  ,IT.PRI_DESCONTO
                                  ,IT.PRI_VALORDESCONTO
                                  ,IT.PRI_VALORUNITARIO
                                  ,IT.PRI_VALORUNITARIOTABELA
                                  ,IT.PRI_VALORUNITARIOMAIOR
                                  ,IT.PRI_IPI
                                  ,IT.PRI_VALORIPI
                                  ,IT.PRI_VALORTOTAL
                                  ,IT.PRI_ENTREGA
                                  ,IT.PRI_DATAENTREGA
                                  ,IT.PRI_CODIGOPEDIDOCLIENTE
                                  ,IT.PRI_CODIGOPRODUTOCLIENTE
                                  ,IT.PRI_CUSTO
                                  ,IT.PRI_CUSTOMEDIO
                                  ,IT.PRI_CUSTOMARKUP
                                  ,IT.PRI_VALORULTIMACOMPRA
                                  ,IT.PRI_PERCENTUALMARKUP
                                  ,IT.PRI_TIPOIMPRESSAO
                                  ,IT.PRI_MALA
                                  ,IT.PRI_TIPOMALA
                                  ,IT.PRI_FLAGVALE
                                  ,IT.PRI_INCLUIPOR
                                  ,V_TIPO
                                  ,'N'
                                  ,IT.PRI_VALORICMSST
                                  ,IT.PRI_BASECALCULOICMSST
                                  ,IT.PRI_BASECALCULOICMS
                                  ,IT.PRI_VALORICMS
                                  ,IT.PRI_ICMSVENDA
                                  ,IT.PRI_TIPOFISCAL
                                  ,IT.PRI_DESCONTOESPECIAL
                                  ,IT.PRI_VALORDESCESP
                                  ,IT.PRI_TIPODESC
                                  ,V_TRIANGULACAO
                                  ,IT.PRI_TIPOVPC
                                  ,IT.PRI_VALORCREDVPC
                                  ,IT.PRI_PERDESCIN
                                  ,IT.PRI_VLRDESCIN
                                  ,IT.PRI_ICMSDESON
                                  ,IT.PRI_VALORFRETE
                                  ,IT.PRI_VALOROUTRO
                                  ,0
                                  ,IT.PRI_VALORSEMDIFAL);

        ELSIF V_TIPO = 2 THEN
          PRC_GRAVA_PROPOSTA_ITEM(V_PRP_CODIGO2
                                  ,IT.PRI_SEQUENCIA
                                  ,IT.PRO_CODIGO
                                  ,IT.PRI_TABELAVENDA
                                  ,IT.PRI_QUANTIDADE
                                  ,IT.PRI_UNIDADE
                                  ,IT.PRI_DESCRICAO
                                  ,IT.PRI_DESCRICAOTECNICA
                                  ,IT.PRI_REFERENCIA
                                  ,IT.PRI_DESCONTO
                                  ,IT.PRI_VALORDESCONTO
                                  ,IT.PRI_VALORUNITARIO
                                  ,IT.PRI_VALORUNITARIOTABELA
                                  ,IT.PRI_VALORUNITARIOMAIOR
                                  ,IT.PRI_IPI
                                  ,IT.PRI_VALORIPI
                                  ,IT.PRI_VALORTOTAL
                                  ,IT.PRI_ENTREGA
                                  ,IT.PRI_DATAENTREGA
                                  ,IT.PRI_CODIGOPEDIDOCLIENTE
                                  ,IT.PRI_CODIGOPRODUTOCLIENTE
                                  ,IT.PRI_CUSTO
                                  ,IT.PRI_CUSTOMEDIO
                                  ,IT.PRI_CUSTOMARKUP
                                  ,IT.PRI_VALORULTIMACOMPRA
                                  ,IT.PRI_PERCENTUALMARKUP
                                  ,IT.PRI_TIPOIMPRESSAO
                                  ,IT.PRI_MALA
                                  ,IT.PRI_TIPOMALA
                                  ,IT.PRI_FLAGVALE
                                  ,IT.PRI_INCLUIPOR
                                  ,1
                                  ,'N'
                                  ,IT.PRI_VALORICMSST
                                  ,IT.PRI_BASECALCULOICMSST
                                  ,IT.PRI_BASECALCULOICMS
                                  ,IT.PRI_VALORICMS
                                  ,IT.PRI_ICMSVENDA
                                  ,IT.PRI_TIPOFISCAL
                                  ,IT.PRI_DESCONTOESPECIAL
                                  ,IT.PRI_VALORDESCESP
                                  ,IT.PRI_TIPODESC
                                  ,V_TRIANGULACAO
                                  ,IT.PRI_TIPOVPC
                                  ,IT.PRI_VALORCREDVPC
                                  ,IT.PRI_PERDESCIN
                                  ,IT.PRI_VLRDESCIN
                                  ,IT.PRI_ICMSDESON
                                  ,IT.PRI_VALORFRETE
                                  ,IT.PRI_VALOROUTRO
                                  ,0
                                  ,IT.PRI_VALORSEMDIFAL);
        END IF;
      END LOOP;

      FOR MEMO IN CUR_MEMO
      LOOP
        PRC_GRAVA_PROPOSTA_MEMO(V_CODIGO_PRP,
                                MEMO.PPM_TIPOTEXTO,
                                MEMO.PPM_TEXTO,
                                MEMO.PPM_INCLUIPOR,
                                V_TIPO,
                                'N');
      END LOOP;

      IF V_CREDITO <> 0 THEN
        IF V_TIPO = 1 THEN
          IF V_TIPOCC = 1 THEN
            SELECT SQN_PROPOSTA_CCORRENTE.NEXTVAL INTO V_SQN_CCORRENTE
              FROM DUAL;

            UPDATE PROPOSTA
               SET PRP_TOTAL_CRED_VPC = V_CREDITO
             WHERE PRP_CODIGO = V_CODIGO_PRP;

          ELSIF V_TIPOCC = 2 THEN

            UPDATE PROPOSTA
               SET PRP_TOTAL_CRED_VPC = 0
             WHERE PRP_CODIGO = V_CODIGO_PRP;

          END IF;
        ELSIF V_TIPO = 2 THEN
          SELECT PRP_TOTAL_CRED_VPC INTO V_VALOR_CRED
            FROM PROPOSTA A
            WHERE A.PRP_CODIGO = V_CODIGO_PRP;

          IF V_VALOR_CRED > 0 THEN
            UPDATE PROPOSTA
               SET PRP_TOTAL_CRED_VPC = V_CREDITO
             WHERE PRP_CODIGO = V_CODIGO_PRP;

          ELSE
            IF V_TIPOCC = 1 THEN
              UPDATE PROPOSTA
                 SET PRP_TOTAL_CRED_VPC = V_CREDITO
               WHERE PRP_CODIGO = V_CODIGO_PRP;

            ELSIF V_TIPOCC = 2 THEN

              UPDATE PROPOSTA
                 SET PRP_TOTAL_CRED_VPC = 0
               WHERE PRP_CODIGO = V_CODIGO_PRP;

            END IF;
          END IF;
        END IF;
      ELSE
        UPDATE PROPOSTA
           SET PRP_TOTAL_CRED_VPC = 0
         WHERE PRP_CODIGO = V_CODIGO_PRP;

      END IF;
    END IF;
  END IF;

  V_PRP_CODIGO := V_CODIGO_PRP;

  IF V_EXISTE_BRINDE = 'S' THEN
    UPDATE PROPOSTA T
       SET T.PRP_TOTAL_CRED_VPC = 0
     WHERE PRP_CODIGO = V_CODIGO_PRP;
  END IF;

  SELECT P.PRP_FRETEPAGO INTO V_PRP_FRETEPAGO FROM PROPOSTA P WHERE PRP_CODIGO=V_PRP_CODIGO;

          IF V_PRP_FRETEPAGO = 'S' THEN

       SELECT REGEXP_SUBSTR(fnc_separa_itens(V_PRP_CODIGO), '[1234567890\-\]+', 1, 1) TRANSPORTADORA,
       REGEXP_SUBSTR(fnc_separa_itens(V_PRP_CODIGO), '[1234567890\-\]+', 2, 2) DIAS
       INTO V_TRANSP, V_TRANSP_PRAZO
       FROM DUAL;

       UPDATE PROPOSTA
       SET TRA_CODIGO = V_TRANSP,
       TRA_PRAZO_ENTREGA = V_TRANSP_PRAZO
       WHERE PRP_CODIGO = V_PRP_CODIGO;

       COMMIT;
      END IF;

  -- Atualizar Totais Cabeçalho Proposta
  declare
    V_TRIANGULACAO proposta.prp_triangulacao %type;
  begin
    SELECT PRP_TRIANGULACAO INTO V_TRIANGULACAO
      FROM PROPOSTA
     WHERE PRP_CODIGO = V_CODIGO_PRP;

    Prc_Reprocessa_Totais(V_CODIGO_PRP, V_TRIANGULACAO, 'N');

    exception
      when others then
        rollback;
        raise_application_error(-20000, 'Erro ao Atualizar Totais Cabeçalho Proposta'||chr(10)||sqlerrm);
  end;

  IF V_COMMIT = 'S' THEN
    COMMIT;
  END IF;

  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

END PRC_GRAVA_PROPOSTA_WEB;
---------------------------------------------------------------------------------------------------------------------

PROCEDURE PRC_GRAVA_PROPOSTA_TEMP(V_PRP_CODIGO       IN PROPOSTA_WEB.PRP_CODIGO%TYPE,
                                  V_PRP_CODIGO_TEMP  IN OUT NUMBER,
                                  V_PRP_TRIANGULACAO IN NUMBER,
                                  V_GERABRINDE       IN NUMBER)

IS
  V_SQN_PROPOSTA  NUMBER(9);
  V_CONT          NUMBER(3);
  V_CLI_COD       PROPOSTA.CLI_CODIGO%TYPE;
  V_CLI_UF        PROPOSTA.PRP_UF%TYPE;
  V_VLR_T1        PRODUTO.PRO_PRECOVENDA01%TYPE;
  V_TRIANGULACAO  PROPOSTA.PRP_TRIANGULACAO%TYPE;
  V_IPI           PROPOSTA_ITEM.PRI_IPI%TYPE;
  V_UNIT          PROPOSTA_ITEM.PRI_VALORUNITARIO%TYPE;

  CURSOR CABECALHO IS
    SELECT * FROM PROPOSTA T
      WHERE T.PRP_CODIGO = V_PRP_CODIGO;

  CURSOR ITENS IS
    SELECT * FROM PROPOSTA_ITEM T
      WHERE T.PRP_CODIGO = V_PRP_CODIGO
      ORDER BY T.PRI_ITEM;

  CURSOR CUR_MEMO IS
    SELECT * FROM PROPOSTA_MEMO T
      WHERE T.PRP_CODIGO = V_PRP_CODIGO;
BEGIN
  V_CONT := 0;

  SELECT CLI_CODIGO, PRP_UF INTO V_CLI_COD, V_CLI_UF
    FROM PROPOSTA
   WHERE PRP_CODIGO = V_PRP_CODIGO;

  SELECT PRP_TRIANGULACAO INTO V_TRIANGULACAO
    FROM PROPOSTA
   WHERE PRP_CODIGO = V_PRP_CODIGO;

  -- VERIFICA SE A PROPOSTA TEM DESCONTO ESPECIAL
  FOR ITEM IN ITENS
  LOOP
    IF ITEM.PRI_DESCONTOESPECIAL = 'S' THEN
      V_CONT := V_CONT + 1;
    END IF;
  END LOOP;

  SELECT SQN_PROPOSTA_WEB.NEXTVAL INTO V_PRP_CODIGO_TEMP FROM DUAL;

  FOR CAB IN CABECALHO
  LOOP
    INSERT INTO PROPOSTA_WEB
                           (PRP_CODIGO,
                            CLI_CODIGO,
                            ORI_CODIGO,
                            TRA_CODIGO,
                            CPG_CODIGO,
                            END_CODIGO,
                            PTP_CODIGO,
                            PRP_SITUACAO,
                            PRP_NOME,
                            PRP_ENDERECO,
                            PRP_BAIRRO,
                            PRP_CIDADE,
                            PRP_UF,
                            PRP_CEP,
                            PRP_FONE,
                            PRP_FAX,
                            RAT_CODIGO,
                            PRP_EMAIL,
                            PRP_AOSCUIDADOS,
                            PRP_DEPARTAMENTO,
                            PRP_VENDEDORINTERNO,
                            PRP_VENDEDOREXTERNO,
                            PRP_VENDEDOROPERACIONAL,
                            PRP_DATAEMISSAO,
                            PRP_DATACONFIRMACAO,
                            PRP_DATAFATURAMENTO,
                            PRP_OBSERVACAONOTA,
                            PRP_VALIDADE,
                            PRP_DATAVALIDADE,
                            PRP_ENTREGA,
                            PRP_DATAENTREGA,
                            PRP_SHIPDATE,
                            PRP_PAIS,
                            PRP_FOB,
                            PRP_PROJECT,
                            PRP_IMPOSTOS,
                            PRP_VALORFRETE,
                            PRP_FRETEPAGO,
                            PRP_VALORTOTAL,
                            PRP_VALORTOTALTABELA,
                            PRP_VALORTOTALIPI,
                            PRP_VALORTOTALDESCONTO,
                            PRP_OVERDESCONTO,
                            PRP_FORMACONFIRMA,
                            PRP_TIPOFATURAMENTO,
                            PRP_TIPOENTREGA,
                            PRP_NUMEROPEDIDOCLIENTE,
                            PRP_MEDIAMARKUP,
                            PRP_PROPOSTAPAI,
                            PRP_CONTROLECREDITO,
                            PRP_ISOACEITEPROPOSTA,
                            PRP_ISOACEITEPEDIDO,
                            PRP_TICKETPRN,
                            PRP_CONTROLAPRN,
                            PRP_INCLUIDATA,
                            PRP_INCLUIPOR,
                            PRP_ALTERADATA,
                            PRP_ALTERAPOR,
                            PRP_VALORTOTALICMSST,
                            PRP_TOTALBASECALCICMSST,
                            PRP_BASECALCULOICMS,
                            PRP_VALORTOTALICMS,
                            PRP_COMPLEMENTAR,
                            PRP_ABATECRED,
                            PRP_VALORCREDITO,
                            PRP_TRIANGULACAO,
                            PRT_CODIGO,
                            PRP_TID,
                            TRA_PRAZO_ENTREGA,
                            PRP_ICMSDESONTOTAL,
                            PRP_HORA,
                            PRP_FINALIDADE,
                            NAT_CODIGO
                        )
                        VALUES
                           (V_PRP_CODIGO_TEMP
                           ,CAB.CLI_CODIGO
                           ,CAB.ORI_CODIGO
                           ,CAB.TRA_CODIGO
                           ,CAB.CPG_CODIGO
                           ,CAB.END_CODIGO
                           ,CAB.PTP_CODIGO
                           ,CAB.PRP_SITUACAO
                           ,CAB.PRP_NOME
                           ,CAB.PRP_ENDERECO
                           ,CAB.PRP_BAIRRO
                           ,CAB.PRP_CIDADE
                           ,CAB.PRP_UF
                           ,CAB.PRP_CEP
                           ,CAB.PRP_FONE
                           ,CAB.PRP_FAX
                           ,CAB.RAT_CODIGO
                           ,CAB.PRP_EMAIL
                           ,CAB.PRP_AOSCUIDADOS
                           ,CAB.PRP_DEPARTAMENTO
                           ,CAB.PRP_VENDEDORINTERNO
                           ,CAB.PRP_VENDEDOREXTERNO
                           ,CAB.PRP_VENDEDOROPERACIONAL
                           ,CAB.PRP_DATAEMISSAO
                           ,CAB.PRP_DATACONFIRMACAO
                           ,CAB.PRP_DATAFATURAMENTO
                           ,CAB.PRP_OBSERVACAONOTA
                           ,CAB.PRP_VALIDADE
                           ,CAB.PRP_DATAVALIDADE
                           ,CAB.PRP_ENTREGA
                           ,CAB.PRP_DATAENTREGA
                           ,CAB.PRP_SHIPDATE
                           ,CAB.PRP_PAIS
                           ,CAB.PRP_FOB
                           ,CAB.PRP_PROJECT
                           ,CAB.PRP_IMPOSTOS
                           ,CAB.PRP_VALORFRETE
                           ,CAB.PRP_FRETEPAGO
                           ,CAB.PRP_VALORTOTAL
                           ,CAB.PRP_VALORTOTALTABELA
                           ,CAB.PRP_VALORTOTALIPI
                           ,CAB.PRP_VALORTOTALDESCONTO
                           ,CAB.PRP_OVERDESCONTO
                           ,CAB.PRP_FORMACONFIRMA
                           ,CAB.PRP_TIPOFATURAMENTO
                           ,CAB.PRP_TIPOENTREGA
                           ,CAB.PRP_NUMEROPEDIDOCLIENTE
                           ,CAB.PRP_MEDIAMARKUP
                           ,CAB.PRP_PROPOSTAPAI
                           ,CAB.PRP_CONTROLECREDITO
                           ,CAB.PRP_ISOACEITEPROPOSTA
                           ,CAB.PRP_ISOACEITEPEDIDO
                           ,CAB.PRP_TICKETPRN
                           ,CAB.PRP_CONTROLAPRN
                           ,CAB.PRP_INCLUIDATA
                           ,CAB.PRP_INCLUIPOR
                           ,CAB.PRP_ALTERADATA
                           ,CAB.PRP_ALTERAPOR
                           ,CAB.PRP_VALORTOTALICMSST
                           ,CAB.PRP_TOTALBASECALCICMSST
                           ,CAB.PRP_BASECALCULOICMS
                           ,CAB.PRP_VALORTOTALICMS
                           ,CAB.PRP_COMPLEMENTAR
                           ,CAB.PRP_ABATECRED
                           ,CAB.PRP_VALORCREDITO
                           ,V_PRP_TRIANGULACAO
                           ,CAB.PRT_CODIGO
                           ,CAB.PRP_TID
                           ,CAB.TRA_PRAZO_ENTREGA
                           ,CAB.PRP_ICMSDESONTOTAL
                           ,((TO_NUMBER(to_char(sysdate,'HH24')) * 60) + TO_NUMBER(to_char(sysdate,'MI')))
                           ,CAB.PRP_FINALIDADE
                           ,CAB.NAT_CODIGO
                           );

  END LOOP;

  IF V_GERABRINDE = 0 THEN

    IF V_CONT > 0 THEN

      FOR ITEM IN ITENS
      LOOP

        SELECT PRO_PRECOVENDA01 INTO V_VLR_T1
          FROM PRODUTO
         WHERE PRO_CODIGO = ITEM.PRO_CODIGO;

        IF V_TRIANGULACAO in (1, 2) THEN -- STR-B2B/LMF-B2B
          SELECT C.CCF_IPI INTO V_IPI
            FROM PRODUTO P, CCF C
           WHERE PRO_CODIGO = ITEM.PRO_CODIGO
             AND P.CCF_CODIGO = C.CCF_CODIGO;

          V_UNIT := (ITEM.PRI_VALORUNITARIO / (1+(V_IPI/100)));
        ELSE
          V_IPI := ITEM.PRI_IPI;
          V_UNIT := ITEM.PRI_VALORUNITARIO;
        END IF;

        INSERT INTO PROPOSTA_ITEM_WEB
                            (PRP_CODIGO,
                             PRI_SEQUENCIA,
                             PRI_ITEM,
                             PRO_CODIGO,
                             PRI_QUANTIDADE,
                             PRI_TABELAVENDA,
                             PRI_UNIDADE,
                             PRI_DESCRICAO,
                             PRI_REFERENCIA,
                             PRI_DESCONTO,
                             PRI_VALORUNITARIO,
                             PRI_VALORUNITARIOTABELA,
                             PRI_VALORUNITARIOMAIOR,
                             PRI_IPI,
                             PRI_VALORIPI,
                             PRI_VALORTOTAL,
                             PRI_CODIGOPRODUTOCLIENTE,
                             PRI_CODIGOPEDIDOCLIENTE,
                             PRI_MALA,
                             PRI_INCLUIPOR,
                             PRI_INCLUIDATA,
                             PRI_ALTERAPOR,
                             PRI_ALTERADATA,
                             PRI_VALORICMSST,
                             PRI_BASECALCULOICMSST,
                             PRI_BASECALCULOICMS,
                             PRI_VALORICMS,
                             PRI_ICMSVENDA,
                             PRI_TIPOFISCAL,
                             PRI_DESCONTOESPECIAL,
                             PRI_VALORDESCESP,
                             PRI_TIPODESC,
                             PRI_TIPOVPC,
                             PRI_VALORCREDVPC,
                             PRI_PERDESCIN,
                             PRI_VLRDESCIN,
                             PRI_ICMSDESON,
                             PRI_VALORFRETE,
                             PRI_VALOROUTRO,
                             PRI_VALORSEMDIFAL
                             )
                          VALUES
                            (V_PRP_CODIGO_TEMP
                             ,ITEM.PRI_SEQUENCIA
                             ,ITEM.PRI_ITEM
                             ,ITEM.PRO_CODIGO
                             ,ITEM.PRI_QUANTIDADE
                             ,1 -- TABELA DE VENDA
                             ,ITEM.PRI_UNIDADE
                             ,ITEM.PRI_DESCRICAO
                             ,ITEM.PRI_REFERENCIA
                             ,0 -- DESCONTO DE TABELA
                             ,V_VLR_T1
                             ,ITEM.PRI_VALORUNITARIOTABELA
                             ,ITEM.PRI_VALORUNITARIOMAIOR
                             ,V_IPI
                             ,((V_VLR_T1 * (V_IPI/100)) * ITEM.PRI_QUANTIDADE)
                             ,(V_VLR_T1 * ITEM.PRI_QUANTIDADE)
                             ,ITEM.PRI_CODIGOPRODUTOCLIENTE
                             ,ITEM.PRI_CODIGOPEDIDOCLIENTE
                             ,ITEM.PRI_MALA
                             ,ITEM.PRI_INCLUIPOR
                             ,ITEM.PRI_INCLUIDATA
                             ,ITEM.PRI_ALTERAPOR
                             ,ITEM.PRI_ALTERADATA
                             ,(SELECT FNC_CALCULA_IMPOSTOS_ORCAMENTO(V_CLI_COD
                                                                   , ITEM.PRO_CODIGO
                                                                   , V_CLI_UF
                                                                   , ITEM.PRI_QUANTIDADE
                                                                   , (V_VLR_T1)
                                                                   , 'VALORST'
                                                                   , ITEM.PRI_TIPOFISCAL) FROM DUAL)
                             ,(SELECT FNC_CALCULA_IMPOSTOS_ORCAMENTO(V_CLI_COD
                                                                   , ITEM.PRO_CODIGO
                                                                   , V_CLI_UF
                                                                   , ITEM.PRI_QUANTIDADE
                                                                   , (V_VLR_T1)
                                                                   , 'BASEST'
                                                                   , ITEM.PRI_TIPOFISCAL) FROM DUAL)
                             ,(SELECT FNC_CALCULA_IMPOSTOS_ORCAMENTO(V_CLI_COD
                                                                   , ITEM.PRO_CODIGO
                                                                   , V_CLI_UF
                                                                   , ITEM.PRI_QUANTIDADE
                                                                   , (V_VLR_T1)
                                                                   , 'BASEICMS'
                                                                   , ITEM.PRI_TIPOFISCAL) FROM DUAL)
                             ,(SELECT FNC_CALCULA_IMPOSTOS_ORCAMENTO(V_CLI_COD
                                                                   , ITEM.PRO_CODIGO
                                                                   , V_CLI_UF
                                                                   , ITEM.PRI_QUANTIDADE
                                                                   , (V_VLR_T1)
                                                                   , 'VALORICMS'
                                                                   , ITEM.PRI_TIPOFISCAL) FROM DUAL)
                             ,ITEM.PRI_ICMSVENDA
                             ,ITEM.PRI_TIPOFISCAL
                             ,'N'
                             ,0
                             ,'T'
                             ,ITEM.PRI_TIPOVPC
                             ,ITEM.PRI_VALORCREDVPC
                             ,ITEM.PRI_PERDESCIN
                             ,ITEM.PRI_VLRDESCIN
                             ,ITEM.PRI_ICMSDESON
                             ,ITEM.PRI_VALORFRETE
                             ,ITEM.PRI_VALOROUTRO
                             ,ITEM.PRI_VALORSEMDIFAL
                             );
      END LOOP;

    ELSE

      FOR ITEM IN ITENS
      LOOP
        SELECT PRO_PRECOVENDA01 INTO V_VLR_T1
          FROM PRODUTO
         WHERE PRO_CODIGO = ITEM.PRO_CODIGO;

        IF V_TRIANGULACAO in (1, 2) THEN -- STR-B2B/LMF-B2B
          SELECT C.CCF_IPI INTO V_IPI
            FROM PRODUTO P, CCF C
           WHERE PRO_CODIGO = ITEM.PRO_CODIGO
             AND P.CCF_CODIGO = C.CCF_CODIGO;

          V_UNIT := (ITEM.PRI_VALORUNITARIO / (1+(V_IPI/100)));
        ELSE
          V_IPI := ITEM.PRI_IPI;
          V_UNIT := ITEM.PRI_VALORUNITARIO;
        END IF;

        INSERT INTO PROPOSTA_ITEM_WEB
                            (PRP_CODIGO,
                             PRI_SEQUENCIA,
                             PRI_ITEM,
                             PRO_CODIGO,
                             PRI_QUANTIDADE,
                             PRI_TABELAVENDA,
                             PRI_UNIDADE,
                             PRI_DESCRICAO,
                             PRI_REFERENCIA,
                             PRI_DESCONTO,
                             PRI_VALORUNITARIO,
                             PRI_VALORUNITARIOTABELA,
                             PRI_VALORUNITARIOMAIOR,
                             PRI_IPI,
                             PRI_VALORIPI,
                             PRI_VALORTOTAL,
                             PRI_CODIGOPRODUTOCLIENTE,
                             PRI_CODIGOPEDIDOCLIENTE,
                             PRI_MALA,
                             PRI_INCLUIPOR,
                             PRI_INCLUIDATA,
                             PRI_ALTERAPOR,
                             PRI_ALTERADATA,
                             PRI_VALORICMSST,
                             PRI_BASECALCULOICMSST,
                             PRI_BASECALCULOICMS,
                             PRI_VALORICMS,
                             PRI_ICMSVENDA,
                             PRI_TIPOFISCAL,
                             PRI_DESCONTOESPECIAL,
                             PRI_VALORDESCESP,
                             PRI_TIPODESC,
                             PRI_TIPOVPC,
                             PRI_VALORCREDVPC,
                             PRI_ICMSDESON,
                             PRI_VALORFRETE,
                             PRI_VALOROUTRO,
                             PRI_VALORSEMDIFAL)
                          VALUES
                            (V_PRP_CODIGO_TEMP
                             ,ITEM.PRI_SEQUENCIA
                             ,ITEM.PRI_ITEM
                             ,ITEM.PRO_CODIGO
                             ,ITEM.PRI_QUANTIDADE
                             ,ITEM.PRI_TABELAVENDA
                             ,ITEM.PRI_UNIDADE
                             ,ITEM.PRI_DESCRICAO
                             ,ITEM.PRI_REFERENCIA
                             ,ITEM.PRI_DESCONTO
                             ,V_UNIT
                             ,ITEM.PRI_VALORUNITARIOTABELA
                             ,ITEM.PRI_VALORUNITARIOMAIOR
                             ,V_IPI
                             ,ITEM.PRI_VALORIPI
                             ,ITEM.PRI_VALORTOTAL
                             ,ITEM.PRI_CODIGOPRODUTOCLIENTE
                             ,ITEM.PRI_CODIGOPEDIDOCLIENTE
                             ,ITEM.PRI_MALA
                             ,ITEM.PRI_INCLUIPOR
                             ,ITEM.PRI_INCLUIDATA
                             ,ITEM.PRI_ALTERAPOR
                             ,ITEM.PRI_ALTERADATA
                             ,ITEM.PRI_VALORICMSST
                             ,ITEM.PRI_BASECALCULOICMSST
                             ,ITEM.PRI_BASECALCULOICMS
                             ,ITEM.PRI_VALORICMS
                             ,ITEM.PRI_ICMSVENDA
                             ,ITEM.PRI_TIPOFISCAL
                             ,ITEM.PRI_DESCONTOESPECIAL
                             ,ITEM.PRI_VALORDESCESP
                             ,ITEM.PRI_TIPODESC
                             ,ITEM.PRI_TIPOVPC
                             ,ITEM.PRI_VALORCREDVPC
                             ,ITEM.PRI_ICMSDESON
                             ,ITEM.PRI_VALORFRETE
                             ,ITEM.PRI_VALOROUTRO
                             ,ITEM.PRI_VALORSEMDIFAL
                             );
      END LOOP;

      FOR MEM IN CUR_MEMO
      LOOP
        INSERT INTO PROPOSTA_MEMO_WEB
                   (PRP_CODIGO
                   ,PPM_TIPOTEXTO
                   ,PPM_TEXTO
                   ,PPM_INCLUIDATA
                   ,PPM_INCLUIPOR
                   ,PPM_ALTERADATA
                   ,PPM_ALTERAPOR)
                VALUES
                  (V_PRP_CODIGO_TEMP
                  ,MEM.PPM_TIPOTEXTO
                  ,MEM.PPM_TEXTO
                  ,MEM.PPM_INCLUIDATA
                  ,MEM.PPM_INCLUIPOR
                  ,MEM.PPM_ALTERADATA
                  ,MEM.PPM_ALTERAPOR);
      END LOOP;
    END IF;
  ELSE
    FOR ITEM IN ITENS
    LOOP
      SELECT PRO_PRECOVENDA01 INTO V_VLR_T1
        FROM PRODUTO
       WHERE PRO_CODIGO = ITEM.PRO_CODIGO;

      IF V_TRIANGULACAO in (1, 2) THEN -- STR-B2B/LMF-B2B
        SELECT C.CCF_IPI INTO V_IPI
          FROM PRODUTO P, CCF C
         WHERE PRO_CODIGO = ITEM.PRO_CODIGO
           AND P.CCF_CODIGO = C.CCF_CODIGO;

        V_UNIT := (ITEM.PRI_VALORUNITARIO / (1+(V_IPI/100)));
      ELSE
        V_IPI := ITEM.PRI_IPI;
        V_UNIT := ITEM.PRI_VALORUNITARIO;
      END IF;

      INSERT INTO PROPOSTA_ITEM_WEB
                          (PRP_CODIGO,
                           PRI_SEQUENCIA,
                           PRI_ITEM,
                           PRO_CODIGO,
                           PRI_QUANTIDADE,
                           PRI_TABELAVENDA,
                           PRI_UNIDADE,
                           PRI_DESCRICAO,
                           PRI_REFERENCIA,
                           PRI_DESCONTO,
                           PRI_VALORUNITARIO,
                           PRI_VALORUNITARIOTABELA,
                           PRI_VALORUNITARIOMAIOR,
                           PRI_IPI,
                           PRI_VALORIPI,
                           PRI_VALORTOTAL,
                           PRI_CODIGOPRODUTOCLIENTE,
                           PRI_CODIGOPEDIDOCLIENTE,
                           PRI_MALA,
                           PRI_INCLUIPOR,
                           PRI_INCLUIDATA,
                           PRI_ALTERAPOR,
                           PRI_ALTERADATA,
                           PRI_VALORICMSST,
                           PRI_BASECALCULOICMSST,
                           PRI_BASECALCULOICMS,
                           PRI_VALORICMS,
                           PRI_ICMSVENDA,
                           PRI_TIPOFISCAL,
                           PRI_DESCONTOESPECIAL,
                           PRI_VALORDESCESP,
                           PRI_TIPODESC,
                           PRI_TIPOVPC,
                           PRI_VALORCREDVPC,
                           PRI_ICMSDESON,
                           PRI_VALORFRETE,
                           PRI_VALOROUTRO,
                           PRI_VALORSEMDIFAL)
                        VALUES
                          (V_PRP_CODIGO_TEMP
                           ,ITEM.PRI_SEQUENCIA
                           ,ITEM.PRI_ITEM
                           ,ITEM.PRO_CODIGO
                           ,ITEM.PRI_QUANTIDADE
                           ,ITEM.PRI_TABELAVENDA
                           ,ITEM.PRI_UNIDADE
                           ,ITEM.PRI_DESCRICAO
                           ,ITEM.PRI_REFERENCIA
                           ,ITEM.PRI_DESCONTO
                           ,V_UNIT
                           ,ITEM.PRI_VALORUNITARIOTABELA
                           ,ITEM.PRI_VALORUNITARIOMAIOR
                           ,V_IPI
                           ,ITEM.PRI_VALORIPI
                           ,ITEM.PRI_VALORTOTAL
                           ,ITEM.PRI_CODIGOPRODUTOCLIENTE
                           ,ITEM.PRI_CODIGOPEDIDOCLIENTE
                           ,ITEM.PRI_MALA
                           ,ITEM.PRI_INCLUIPOR
                           ,ITEM.PRI_INCLUIDATA
                           ,ITEM.PRI_ALTERAPOR
                           ,ITEM.PRI_ALTERADATA
                           ,ITEM.PRI_VALORICMSST
                           ,ITEM.PRI_BASECALCULOICMSST
                           ,ITEM.PRI_BASECALCULOICMS
                           ,ITEM.PRI_VALORICMS
                           ,ITEM.PRI_ICMSVENDA
                           ,ITEM.PRI_TIPOFISCAL
                           ,ITEM.PRI_DESCONTOESPECIAL
                           ,ITEM.PRI_VALORDESCESP
                           ,ITEM.PRI_TIPODESC
                           ,ITEM.PRI_TIPOVPC
                           ,ITEM.PRI_VALORCREDVPC
                           ,ITEM.PRI_ICMSDESON
                           ,ITEM.PRI_VALORFRETE
                           ,ITEM.PRI_VALOROUTRO
                           ,ITEM.PRI_VALORSEMDIFAL
                           );
    END LOOP;

    FOR MEM IN CUR_MEMO
    LOOP
      INSERT INTO PROPOSTA_MEMO_WEB
                 (PRP_CODIGO
                 ,PPM_TIPOTEXTO
                 ,PPM_TEXTO
                 ,PPM_INCLUIDATA
                 ,PPM_INCLUIPOR
                 ,PPM_ALTERADATA
                 ,PPM_ALTERAPOR)
              VALUES
                (V_PRP_CODIGO_TEMP
                ,MEM.PPM_TIPOTEXTO
                ,MEM.PPM_TEXTO
                ,MEM.PPM_INCLUIDATA
                ,MEM.PPM_INCLUIPOR
                ,MEM.PPM_ALTERADATA
                ,MEM.PPM_ALTERAPOR);
    END LOOP;
  END IF;

  COMMIT;

  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

END PRC_GRAVA_PROPOSTA_TEMP;
---------------------------------------------------------------------------------------------------------------------
PROCEDURE PRC_DELETA_ITENS_BRINDE(V_PRP_CODIGO IN PROPOSTA.PRP_CODIGO%TYPE)
  IS
    V_VALORTOTALST   PROPOSTA.PRP_VALORTOTALICMSST%TYPE;
    V_VALORTOTAL     PROPOSTA.PRP_VALORTOTAL%TYPE;
    V_VALORCREDITO   PROPOSTA.PRP_TOTAL_CRED_VPC%TYPE;
  BEGIN

    DELETE PROPOSTA_ITEM
     WHERE PRP_CODIGO = V_PRP_CODIGO
       AND PRI_TIPOVPC = 5;

    SELECT SUM(NVL(PRI_VALORICMSST,0)), SUM(NVL(PRI_VALORTOTAL,0)), SUM(NVL(PRI_VALORCREDVPC,0))
      INTO V_VALORTOTALST, V_VALORTOTAL, V_VALORCREDITO
      FROM PROPOSTA_ITEM
     WHERE PRP_CODIGO = V_PRP_CODIGO;

    UPDATE PROPOSTA
       SET PRP_VALORTOTALICMSST = V_VALORTOTALST
          ,PRP_VALORTOTAL = V_VALORTOTAL
          ,PRP_TOTAL_CRED_VPC = V_VALORCREDITO
     WHERE PRP_CODIGO = V_PRP_CODIGO;

  COMMIT;

  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

END PRC_DELETA_ITENS_BRINDE;

---------------------------------------------------------------------------------------------------------------------
PROCEDURE PRC_AJUSTE_CONSIGNACAO(V_PRP_CODIGO              IN PROPOSTA.PRP_CODIGO             %TYPE,
                                 V_PRP_VALORTOTAL          IN PROPOSTA.PRP_VALORTOTAL         %TYPE,
                                 V_PRP_VALORTOTALIPI       IN PROPOSTA.PRP_VALORTOTALIPI      %TYPE,
                                 V_PRP_TOTALBASECALCICMSST IN PROPOSTA.PRP_TOTALBASECALCICMSST%TYPE,
                                 V_PRP_VALORTOTALICMSST    IN PROPOSTA.PRP_VALORTOTALICMSST   %TYPE,
                                 V_PRP_BASECALCULOICMS     IN PROPOSTA.PRP_BASECALCULOICMS    %TYPE,
                                 V_PRP_VALORTOTALICMS      IN PROPOSTA.PRP_VALORTOTALICMS     %TYPE,
                                 V_COMMIT                  IN VARCHAR2,
                                 V_PRP_SEQNFC_CONSIG       IN PROPOSTA.PRP_SEQNFC_CONSIG      %TYPE default null)
IS
BEGIN

    -- não é esperado que haja desconto nessas propostas da Kalunga, se mudar no futuro atualizar regra
    UPDATE PROPOSTA
       SET PRP_VALORTOTAL          = V_PRP_VALORTOTAL         ,
           PRP_VALORTOTALIPI       = V_PRP_VALORTOTALIPI      ,
           PRP_TOTALBASECALCICMSST = V_PRP_TOTALBASECALCICMSST,
           PRP_VALORTOTALICMSST    = V_PRP_VALORTOTALICMSST   ,
           PRP_BASECALCULOICMS     = V_PRP_BASECALCULOICMS    ,
           PRP_VALORTOTALICMS      = V_PRP_VALORTOTALICMS     ,
           PRP_SEQNFC_CONSIG       = V_PRP_SEQNFC_CONSIG
     WHERE PRP_CODIGO    = V_PRP_CODIGO;

    IF V_COMMIT = 'S' THEN
      COMMIT;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

END PRC_AJUSTE_CONSIGNACAO;
---------------------------------------------------------------------------------------------------------------------
PROCEDURE PRC_AJUSTE_CONSIGNACAO_ITEM(V_PRP_CODIGO            IN PROPOSTA_ITEM.PRP_CODIGO           %TYPE,
                                      V_PRI_ITEM              IN PROPOSTA_ITEM.PRI_ITEM             %TYPE,
                                      V_PRO_CODIGO            IN PROPOSTA_ITEM.PRO_CODIGO           %TYPE,
                                      V_PRI_VALORUNITARIO     IN PROPOSTA_ITEM.PRI_VALORUNITARIO    %TYPE,
                                      V_PRI_VALORTOTAL        IN PROPOSTA_ITEM.PRI_VALORTOTAL       %TYPE,
                                      V_PRI_IPI               IN PROPOSTA_ITEM.PRI_IPI              %TYPE,
                                      V_PRI_VALORIPI          IN PROPOSTA_ITEM.PRI_VALORIPI         %TYPE,
                                      V_PRI_BASECALCULOICMS   IN PROPOSTA_ITEM.PRI_BASECALCULOICMS  %TYPE,
                                      V_PRI_ICMSVENDA         IN PROPOSTA_ITEM.PRI_ICMSVENDA        %TYPE,
                                      V_PRI_VALORICMS         IN PROPOSTA_ITEM.PRI_VALORICMS        %TYPE,
                                      V_PRI_BASECALCULOICMSST IN PROPOSTA_ITEM.PRI_BASECALCULOICMSST%TYPE,
                                      V_PRI_VALORICMSST       IN PROPOSTA_ITEM.PRI_VALORICMSST      %TYPE,
                                      V_COMMIT                IN VARCHAR2) IS
BEGIN

    -- não é esperado que haja desconto nessas propostas da Kalunga, se mudar no futuro atualizar regra
    UPDATE PROPOSTA_ITEM
       SET PRI_VALORUNITARIO     = V_PRI_VALORUNITARIO
          ,PRI_VALORTOTAL        = V_PRI_VALORTOTAL
          ,PRI_IPI               = V_PRI_IPI
          ,PRI_VALORIPI          = V_PRI_VALORIPI
          ,PRI_BASECALCULOICMS   = V_PRI_BASECALCULOICMS
          ,PRI_ICMSVENDA         = V_PRI_ICMSVENDA
          ,PRI_VALORICMS         = V_PRI_VALORICMS
          ,PRI_BASECALCULOICMSST = V_PRI_BASECALCULOICMSST
          ,PRI_VALORICMSST       = V_PRI_VALORICMSST
     WHERE PRP_CODIGO = V_PRP_CODIGO
       AND PRI_ITEM   = V_PRI_ITEM
       AND PRO_CODIGO = V_PRO_CODIGO;

    IF V_COMMIT = 'S' THEN
      COMMIT;
        -- Atualizar Totais Cabeçalho Proposta
      declare
        V_TRIANGULACAO proposta.prp_triangulacao %type;
      begin
        SELECT PRP_TRIANGULACAO INTO V_TRIANGULACAO
          FROM PROPOSTA
         WHERE PRP_CODIGO = V_PRP_CODIGO;

        Prc_Reprocessa_Totais(V_PRP_CODIGO, V_TRIANGULACAO, 'N');

        exception
          when others then
            rollback;
            raise_application_error(-20000, 'Erro ao Atualizar Totais Cabeçalho Proposta'||chr(10)||sqlerrm);
      end;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

END PRC_AJUSTE_CONSIGNACAO_ITEM;
----------------------------------------------------------------------------------------------------------
PROCEDURE PRC_PROPOSTA_B2B(V_PRP_CODIGO     IN OUT B2B_PROPOSTA.PRP_CODIGO%TYPE,
                           V_PRP_CODIGO2    IN B2B_PROPOSTA.PRP_CODIGO%TYPE,
                           V_TIPO           IN NUMBER,
                          -- V_TIPOCC         IN NUMBER,
                           V_COMMIT         IN VARCHAR DEFAULT 'N')

IS
  V_QTDE_CAB      NUMBER(1);
  V_QTDE_ITEM     NUMBER(4);
  V_TRIANGULACAO  PROPOSTA_WEB.PRP_TRIANGULACAO%TYPE;
  V_CLIENTE       PROPOSTA_WEB.CLI_CODIGO%TYPE;
  V_USUARIO       PROPOSTA_WEB.PRP_INCLUIPOR%TYPE;
  V_PCC_CODIGO    PROPOSTA_CCORRENTE.PCC_CODIGO%TYPE;
  V_CODIGO_PRP    PROPOSTA.PRP_CODIGO%TYPE;
  V_TRANSP        PROPOSTA.TRA_CODIGO%TYPE;
  V_TRANSP_PRAZO  PROPOSTA.TRA_PRAZO_ENTREGA%TYPE;
  V_PRP_FRETEPAGO PROPOSTA.PRP_FRETEPAGO%TYPE;
  V_DISPONIVEL    NUMBER(9);
  V_MSG           VARCHAR2(4000);
  V_SEM_SALDO     PROPOSTA_ITEM.PRI_ITEM%TYPE;
  V_QTDE_PRP      PROPOSTA_ITEM.PRI_QUANTIDADE%TYPE;
  V_FINALIDADE    PROPOSTA.PRP_FINALIDADE%TYPE;
  V_CLI_CODIGO    PROPOSTA.CLI_CODIGO%TYPE;
  V_NAT_CODIGO    PROPOSTA.NAT_CODIGO%TYPE;
  --Variáveis para recálculo de impostos
  /*V_P_IPI         PROPOSTA_ITEM.PRI_IPI%TYPE;
  V_VLR_IPI       PROPOSTA_ITEM.PRI_VALORIPI%TYPE;
  V_VLR_ICMSST    PROPOSTA_ITEM.PRI_VALORICMSST%TYPE;
  V_BC_ICMSST     PROPOSTA_ITEM.PRI_BASECALCULOICMSST%TYPE;
  V_BC_ICMS       PROPOSTA_ITEM.PRI_BASECALCULOICMS%TYPE;
  V_VLR_ICMS      PROPOSTA_ITEM.PRI_VALORICMS%TYPE;
  V_P_ICMS        PROPOSTA_ITEM.PRI_ICMSVENDA%TYPE;*/

  CURSOR CABECALHO IS
    SELECT * FROM B2B_PROPOSTA T
      WHERE T.PRP_CODIGO = V_PRP_CODIGO;

  CURSOR ITENS IS
         SELECT * FROM B2B_PROPOSTA_ITEM T
          WHERE T.PRP_CODIGO = V_PRP_CODIGO
         ORDER BY T.PRI_ITEM;

BEGIN

  SELECT COUNT(*) INTO V_QTDE_CAB
    FROM B2B_PROPOSTA T
    WHERE T.PRP_CODIGO = V_PRP_CODIGO;

  SELECT COUNT(*) INTO V_QTDE_ITEM
    FROM B2B_PROPOSTA_ITEM T
    WHERE T.PRP_CODIGO = V_PRP_CODIGO;


------------------------------------------------------------

-- VERIFICA SE EXISTEM ITENS SEM ESTOQUE NO MOMENTO DE SALVAR
  V_SEM_SALDO := 0;
  V_MSG := '';
  V_DISPONIVEL := 0;


  IF V_SEM_SALDO > 0 THEN
    raise_application_error(-20000, 'O(s) item(s) '||V_MSG||' não possui saldo em estoque !');
  END IF;

  IF V_QTDE_CAB > 0 AND V_QTDE_CAB < 2 THEN
    IF V_QTDE_ITEM > 0 THEN
      IF V_PRP_CODIGO2 <> 0 THEN
        V_CODIGO_PRP := V_PRP_CODIGO2;
      ELSE
        V_CODIGO_PRP := 0;
      END IF;

      FOR CAB IN CABECALHO
      LOOP

        V_TRANSP      := CAB.TRA_CODIGO;
        V_TRANSP_PRAZO:= CAB.TRA_PRAZO_ENTREGA;

        V_FINALIDADE  := CAB.PRP_FINALIDADE;
        V_CLI_CODIGO  := CAB.CLI_CODIGO;
        --V_NAT_CODIGO  := CAB.NAT_CODIGO;
        SELECT Fnc_Busca_Natureza_Operacao(CAB.CLI_CODIGO, CAB.PRP_TRIANGULACAO, CAB.PRP_FINALIDADE)
          INTO V_NAT_CODIGO
          FROM DUAL;

        PRC_GRAVA_PROPOSTA(V_CODIGO_PRP
                           ,CAB.CLI_CODIGO
                           ,CAB.ORI_CODIGO
                           ,V_TRANSP
                           ,CAB.CPG_CODIGO
                           ,CAB.END_CODIGO
                           ,CAB.PTP_CODIGO
                           ,CAB.PRP_SITUACAO
                           ,CAB.PRP_NOME
                           ,CAB.PRP_ENDERECO
                           ,CAB.PRP_BAIRRO
                           ,CAB.PRP_CIDADE
                           ,CAB.PRP_UF
                           ,CAB.PRP_CEP
                           ,CAB.PRP_FONE
                           ,CAB.PRP_FAX
                           ,CAB.RAT_CODIGO
                           ,CAB.PRP_EMAIL
                           ,CAB.PRP_AOSCUIDADOS
                           ,CAB.PRP_DEPARTAMENTO
                           ,CAB.PRP_VENDEDORINTERNO
                           ,CAB.PRP_VENDEDOREXTERNO
                           ,CAB.PRP_VENDEDOROPERACIONAL
                           ,to_date(CAB.PRP_DATAEMISSAO, 'DD/MM/RRRR')
                           ,CAB.PRP_DATACONFIRMACAO
                           ,CAB.PRP_DATAFATURAMENTO
                           ,CAB.PRP_OBSERVACAONOTA
                           ,CAB.PRP_VALIDADE
                           ,CAB.PRP_DATAVALIDADE
                           ,CAB.PRP_ENTREGA
                           ,CAB.PRP_DATAENTREGA
                           ,CAB.PRP_SHIPDATE
                           ,CAB.PRP_PAIS
                           ,CAB.PRP_FOB
                           ,CAB.PRP_PROJECT
                           ,CAB.PRP_IMPOSTOS
                           ,CAB.PRP_VALORFRETE
                           ,CAB.PRP_FRETEPAGO
                           ,CAB.PRP_VALORTOTAL
                           ,CAB.PRP_VALORTOTALTABELA
                           ,CAB.PRP_VALORTOTALIPI
                           ,CAB.PRP_VALORTOTALDESCONTO
                           ,CAB.PRP_OVERDESCONTO
                           ,CAB.PRP_FORMACONFIRMA
                           ,CAB.PRP_TIPOFATURAMENTO
                           ,CAB.PRP_TIPOENTREGA
                           ,CAB.PRP_NUMEROPEDIDOCLIENTE
                           ,CAB.PRP_MEDIAMARKUP
                           ,CAB.PRP_PROPOSTAPAI
                           ,CAB.PRP_CONTROLECREDITO
                           ,CAB.PRP_INCLUIPOR
                           ,CAB.PRP_ISOACEITEPROPOSTA
                           ,CAB.PRP_ISOACEITEPEDIDO
                           ,V_TIPO
                           ,'N'
                           ,CAB.PRP_CONTROLAPRN
                           ,CAB.PRP_VALORTOTALICMSST
                           ,CAB.PRP_TOTALBASECALCICMSST
                           ,CAB.PRP_BASECALCULOICMS
                           ,CAB.PRP_VALORTOTALICMS
                           ,CAB.PRP_COMPLEMENTAR
                           ,CAB.PRP_ABATECRED
                           ,CAB.PRP_VALORCREDITO
                           ,CAB.PRP_TRIANGULACAO
                           ,CAB.PRT_CODIGO
                           ,CAB.PRP_TID
                           ,V_TRANSP_PRAZO
                           ,CAB.PRP_ICMSDESONTOTAL
                           ,CAB.PRP_VALOROUTROS
                           ,CAB.PRP_FINALIDADE
                           ,V_NAT_CODIGO --CAB.NAT_CODIGO
                           );
      END LOOP;

      FOR IT IN ITENS
      LOOP
        IF V_TIPO = 1 THEN

          -- RECÁLCULO DE IMPOSTOS - removido por Alex em 18/11/2022 - calculando ICMS ST e IPI indevidamente para Strategy
          /*Begin
              SELECT p_ipi, vlr_ipi, vlr_icmsst, bc_icmsst, bc_icms, vlr_icms, p_icms
                into v_p_ipi, v_vlr_ipi, v_vlr_icmsst, v_bc_icmsst, v_bc_icms, v_vlr_icms, v_p_icms
                FROM TABLE(FNC_IMPOSTOS_NFE(IT.PRO_CODIGO,
                                            V_NAT_CODIGO,
                                            V_FINALIDADE,
                                            V_CLI_CODIGO,
                                            IT.PRI_QUANTIDADE * IT.PRI_VALORUNITARIO,
                                            IT.PRI_QUANTIDADE,
                                            0));
          Exception
              When NO_data_Found then
                v_p_ipi      := 0;
                v_vlr_ipi    := 0;
                v_vlr_icmsst := 0;
                v_bc_icmsst  := 0;
                v_bc_icms    := 0;
                v_vlr_icms   := 0;
                v_p_icms     := 0;
          end;*/

          PRC_GRAVA_PROPOSTA_ITEM(V_CODIGO_PRP
                                  ,IT.PRI_SEQUENCIA
                                  ,IT.PRO_CODIGO
                                  ,IT.PRI_TABELAVENDA
                                  ,IT.PRI_QUANTIDADE
                                  ,IT.PRI_UNIDADE
                                  ,IT.PRI_DESCRICAO
                                  ,IT.PRI_DESCRICAOTECNICA
                                  ,IT.PRI_REFERENCIA
                                  ,IT.PRI_DESCONTO
                                  ,IT.PRI_VALORDESCONTO
                                  ,IT.PRI_VALORUNITARIO
                                  ,IT.PRI_VALORUNITARIOTABELA
                                  ,IT.PRI_VALORUNITARIOMAIOR
                                  ,IT.PRI_IPI -- v_p_ipi --,
                                  ,IT.PRI_VALORIPI --v_vlr_ipi --,
                                  ,IT.PRI_VALORTOTAL
                                  ,IT.PRI_ENTREGA
                                  ,IT.PRI_DATAENTREGA
                                  ,IT.PRI_CODIGOPEDIDOCLIENTE
                                  ,IT.PRI_CODIGOPRODUTOCLIENTE
                                  ,IT.PRI_CUSTO
                                  ,IT.PRI_CUSTOMEDIO
                                  ,IT.PRI_CUSTOMARKUP
                                  ,IT.PRI_VALORULTIMACOMPRA
                                  ,IT.PRI_PERCENTUALMARKUP
                                  ,IT.PRI_TIPOIMPRESSAO
                                  ,IT.PRI_MALA
                                  ,IT.PRI_TIPOMALA
                                  ,IT.PRI_FLAGVALE
                                  ,IT.PRI_INCLUIPOR
                                  ,V_TIPO
                                  ,'N'
                                  ,IT.PRI_VALORICMSST --v_vlr_icmsst --,
                                  ,IT.PRI_BASECALCULOICMSST --v_bc_icmsst --,
                                  ,IT.PRI_BASECALCULOICMS --v_bc_icms --,
                                  ,IT.PRI_VALORICMS --v_vlr_icms --,
                                  ,IT.PRI_ICMSVENDA --v_p_icms --,
                                  ,IT.PRI_TIPOFISCAL
                                  ,IT.PRI_DESCONTOESPECIAL
                                  ,IT.PRI_VALORDESCESP
                                  ,IT.PRI_TIPODESC
                                  ,V_TRIANGULACAO
                                  ,IT.PRI_TIPOVPC
                                  ,IT.PRI_VALORCREDVPC
                                  ,IT.PRI_PERDESCIN
                                  ,IT.PRI_VLRDESCIN
                                  ,IT.PRI_ICMSDESON
                                  ,IT.PRI_VALORFRETE
                                  ,IT.PRI_VALOROUTRO
                                  ,IT.PRI_VALOR_UNITARIO_FINAL
                                  ,0);


        END IF;
      END LOOP;

    END IF;
  END IF;

  V_PRP_CODIGO := V_CODIGO_PRP;

  SELECT P.PRP_FRETEPAGO INTO V_PRP_FRETEPAGO FROM PROPOSTA P WHERE PRP_CODIGO=V_PRP_CODIGO;

  IF V_PRP_FRETEPAGO = 'S' THEN
    SELECT REGEXP_SUBSTR(fnc_separa_itens(V_PRP_CODIGO), '[1234567890\-\]+', 1, 1) TRANSPORTADORA,
           REGEXP_SUBSTR(fnc_separa_itens(V_PRP_CODIGO), '[1234567890\-\]+', 2, 2) DIAS
      INTO V_TRANSP, V_TRANSP_PRAZO
      FROM DUAL;

    UPDATE PROPOSTA
       SET TRA_CODIGO = V_TRANSP,
           TRA_PRAZO_ENTREGA = V_TRANSP_PRAZO
     WHERE PRP_CODIGO = V_PRP_CODIGO;

    COMMIT;
  END IF;

  -- Atualizar Totais Cabeçalho Proposta
  declare
    V_TRIANGULACAO proposta.prp_triangulacao %type;
  begin
    SELECT PRP_TRIANGULACAO INTO V_TRIANGULACAO
      FROM PROPOSTA
     WHERE PRP_CODIGO = V_CODIGO_PRP;

    Prc_Reprocessa_Totais(V_CODIGO_PRP, V_TRIANGULACAO, 'N');

    exception
      when others then
        rollback;
        raise_application_error(-20000, 'Erro ao Atualizar Totais Cabeçalho Proposta'||chr(10)||sqlerrm);
  end;

  IF V_COMMIT = 'S' THEN
    COMMIT;
  END IF;

  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;

END PRC_PROPOSTA_B2B;

---------------------------------------------------------------------------------------------
procedure Prc_Reprocessa_Totais(V_PRP_CODIGO         IN PROPOSTA.PRP_CODIGO       %TYPE,
                                V_PRP_TRIANGULACAO   IN PROPOSTA.PRP_TRIANGULACAO %TYPE,
                                V_COMMIT             IN VARCHAR2)
IS
    V_PRP_VALORTOTAL         NUMBER;
    V_PRP_MEDIAMARKUP        NUMBER;
    V_PRP_VALORTOTALDESCONTO NUMBER;
    V_PRP_VALORTOTALIPI      NUMBER;
    V_PRP_VALORTOTALICMS     NUMBER;
    V_PRP_VALORBASE_ST       NUMBER;
    V_PRP_VALORTOTAL_ST      NUMBER;
    V_PRP_VALORTOTALTABELA   NUMBER;
    V_PRP_OVERDESCONTO       NUMBER;
    V_PRP_ICMSDESONTOTAL     NUMBER;
    V_PRP_VALORFRETETOTAL    NUMBER;
    V_PRP_VALOROUTROTOTAL    NUMBER;
    V_PRP_VALORDESCINTOTAL   NUMBER;
    V_PRP_BASECALCULOICMS    NUMBER;
    V_PRP_TOTAL_CRED_VPC     PROPOSTA.PRP_TOTAL_CRED_VPC %TYPE;
  BEGIN
    /*****************************************************************
    RECALCULA A PROPOSTA ORIGINAL
    ******************************************************************/
    SELECT nvl(SUM(PRI_VALORTOTAL), 0) --vProd
         , nvl(SUM(PRI_PERCENTUALMARKUP), 0)
         , nvl(SUM(PRI_VALORDESCONTO), 0)
         , nvl(SUM(PRI_VALORIPI), 0)
         , nvl(SUM(PRI_VALORICMS), 0)
         , nvl(SUM(PRI_QUANTIDADE * PRI_VALORUNITARIOTABELA), 0)
         , nvl(SUM(PRI_BASECALCULOICMSST), 0)
         , nvl(SUM(PRI_VALORICMSST), 0)
         , nvl(SUM(PRI_ICMSDESON), 0)
         , nvl(SUM(PRI_VALORFRETE), 0)
         , nvl(SUM(PRI_VALOROUTRO), 0)
         , nvl(SUM(Pri_Vlrdescin), 0)
         , nvl(SUM(PRI_BASECALCULOICMS), 0)
         , nvl(SUM(PRI_VALORCREDVPC), 0)
      INTO V_PRP_VALORTOTAL,
           V_PRP_MEDIAMARKUP,
           V_PRP_VALORTOTALDESCONTO,
           V_PRP_VALORTOTALIPI,
           V_PRP_VALORTOTALICMS,
           V_PRP_VALORTOTALTABELA
         , V_PRP_VALORBASE_ST
         , V_PRP_VALORTOTAL_ST
         , V_PRP_ICMSDESONTOTAL
         , V_PRP_VALORFRETETOTAL
         , V_PRP_VALOROUTROTOTAL
         , V_PRP_VALORDESCINTOTAL
         , V_PRP_BASECALCULOICMS
         , V_PRP_TOTAL_CRED_VPC
      FROM PROPOSTA_ITEM
     WHERE PRP_CODIGO = V_PRP_CODIGO;
    ------------------------------------------------------
    -- FAZ A MEDIA DE MARKUP
    DECLARE
      N_ITEM INTEGER;
    BEGIN
      SELECT COUNT(*)
        INTO N_ITEM
        FROM PROPOSTA_ITEM
       WHERE PRP_CODIGO = V_PRP_CODIGO;
      V_PRP_MEDIAMARKUP := V_PRP_MEDIAMARKUP / N_ITEM;
    END;
    ------------------------------------------------------
    IF (V_PRP_VALORTOTAL > V_PRP_VALORTOTALTABELA) AND
       (V_PRP_VALORTOTALTABELA > 0) THEN
      V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTAL - V_PRP_VALORTOTALTABELA) /
                            V_PRP_VALORTOTAL) * 100;
    ELSIF (V_PRP_VALORTOTALTABELA > V_PRP_VALORTOTAL) AND
          (V_PRP_VALORTOTAL > 0) THEN
      V_PRP_OVERDESCONTO := ((V_PRP_VALORTOTALTABELA - V_PRP_VALORTOTAL) /
                            V_PRP_VALORTOTALTABELA) * 100;
    END IF;


    -- ajuste Frete, se for triangulação 4-B2C consideramos o frete item a item, do contrário inserir o valor cheio direto no cabeçalho da Proposta e da NF
    if nvl(V_PRP_TRIANGULACAO, 0) != 4 then
/*      SELECT NVL(PRP_VALORFRETE, 0)
        into V_PRP_VALORFRETETOTAL
        FROM PROPOSTA
       WHERE PRP_CODIGO = V_PRP_CODIGO;*/

      SELECT sum(NVL(Pri_Valorfrete, 0))
        into V_PRP_VALORFRETETOTAL
        FROM PROPOSTA_ITEM
       WHERE PRP_CODIGO = V_PRP_CODIGO;

      UPDATE PROPOSTA
       SET PRP_VALORTOTAL          = V_PRP_VALORTOTAL,
           PRP_VALORTOTALTABELA    = V_PRP_VALORTOTALTABELA,
           PRP_VALORTOTALIPI       = V_PRP_VALORTOTALIPI,
           PRP_VALORTOTALICMS      = V_PRP_VALORTOTALICMS,
           PRP_VALORTOTALDESCONTO  = V_PRP_VALORTOTALDESCONTO,
           PRP_MEDIAMARKUP         = V_PRP_MEDIAMARKUP,
           PRP_OVERDESCONTO        = V_PRP_OVERDESCONTO,
           PRP_TOTALBASECALCICMSST = V_PRP_VALORBASE_ST,
           PRP_VALORTOTALICMSST    = V_PRP_VALORTOTAL_ST,
           PRP_ICMSDESONTOTAL      = V_PRP_ICMSDESONTOTAL,
           PRP_VALORFRETE          = V_PRP_VALORFRETETOTAL,
           PRP_VALOROUTROS         = V_PRP_VALOROUTROTOTAL,
           PRP_VLRDESCINTOTAL      = V_PRP_VALORDESCINTOTAL,
           PRP_BASECALCULOICMS     = V_PRP_BASECALCULOICMS,
           PRP_TOTAL_CRED_VPC      = V_PRP_TOTAL_CRED_VPC,
           PRP_VALORTOTALNFE       = (V_PRP_VALORTOTAL + V_PRP_VALORTOTALIPI + V_PRP_VALORTOTAL_ST
                                                       + V_PRP_VALORFRETETOTAL + V_PRP_VALOROUTROTOTAL
                                                       - V_PRP_VALORDESCINTOTAL - V_PRP_ICMSDESONTOTAL)
     WHERE PRP_CODIGO = V_PRP_CODIGO;

    else --> Frete cheio direto no cabeçalho da Proposta e da NF

      UPDATE PROPOSTA
         SET PRP_VALORTOTAL          = V_PRP_VALORTOTAL,
             PRP_VALORTOTALTABELA    = V_PRP_VALORTOTALTABELA,
             PRP_VALORTOTALIPI       = V_PRP_VALORTOTALIPI,
             PRP_VALORTOTALICMS      = V_PRP_VALORTOTALICMS,
             PRP_VALORTOTALDESCONTO  = V_PRP_VALORTOTALDESCONTO,
             PRP_MEDIAMARKUP         = V_PRP_MEDIAMARKUP,
             PRP_OVERDESCONTO        = V_PRP_OVERDESCONTO,
             PRP_TOTALBASECALCICMSST = V_PRP_VALORBASE_ST,
             PRP_VALORTOTALICMSST    = V_PRP_VALORTOTAL_ST,
             PRP_ICMSDESONTOTAL      = V_PRP_ICMSDESONTOTAL,
             PRP_VALORFRETE          = V_PRP_VALORFRETETOTAL,
             PRP_VALOROUTROS         = V_PRP_VALOROUTROTOTAL,
             PRP_VLRDESCINTOTAL      = V_PRP_VALORDESCINTOTAL,
             PRP_BASECALCULOICMS     = V_PRP_BASECALCULOICMS,
           PRP_TOTAL_CRED_VPC      = V_PRP_TOTAL_CRED_VPC,
             PRP_VALORTOTALNFE       = (V_PRP_VALORTOTAL + V_PRP_VALORTOTALIPI + V_PRP_VALORTOTAL_ST
                                                         + V_PRP_VALORFRETETOTAL + V_PRP_VALOROUTROTOTAL
                                                         - V_PRP_VALORDESCINTOTAL - V_PRP_ICMSDESONTOTAL)
       WHERE PRP_CODIGO = V_PRP_CODIGO;
    end if;

    IF V_COMMIT = 'S' THEN
      COMMIT;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;
end Prc_Reprocessa_Totais;

--------------------------------------------------------------------------------
PROCEDURE PRC_ALTERA_ITENS_PROPOSTA(V_PRP_CODIGO           IN PROPOSTA_ITEM.PRP_CODIGO        %TYPE,
                                    V_PRI_SEQUENCIA        IN PROPOSTA_ITEM.PRI_SEQUENCIA     %TYPE,
                                    V_USUARIO              IN PROPOSTA_ITEM.PRI_ALTERAPOR     %TYPE,
                                    V_COMMIT               IN VARCHAR2,
                                    V_PRI_AJUSTEMANUAL     IN PROPOSTA_ITEM.PRI_AJUSTEMANUAL  %TYPE,
                                    V_PRI_VALORUNITARIO    IN PROPOSTA_ITEM.PRI_VALORUNITARIO %TYPE,
                                    V_PRI_VALORTOTAL       IN PROPOSTA_ITEM.PRI_VALORTOTAL    %TYPE,
                                    V_PRI_VLRDESCIN        IN PROPOSTA_ITEM.PRI_VLRDESCIN     %TYPE,
                                    V_PRI_IPI              IN PROPOSTA_ITEM.PRI_IPI           %TYPE,
                                    V_PRI_VALORIPI         IN PROPOSTA_ITEM.PRI_VALORIPI      %TYPE,
                                    V_PRI_BASEICMSST       IN PROPOSTA_ITEM.PRI_BASECALCULOICMSST %TYPE,
                                    V_PRI_VALORICMSST      IN PROPOSTA_ITEM.PRI_VALORICMSST       %TYPE,
                                    V_PRI_ICMSDESON        IN PROPOSTA_ITEM.PRI_ICMSDESON     %TYPE)
IS
BEGIN

  UPDATE PROPOSTA_ITEM
     SET PRI_AJUSTEMANUAL  = substr(V_PRI_AJUSTEMANUAL, 1, 4000)||chr(10)||PRI_AJUSTEMANUAL
       , PRI_VALORUNITARIO = V_PRI_VALORUNITARIO
       , PRI_VALORTOTAL    = V_PRI_VALORTOTAL
       , PRI_VLRDESCIN     = V_PRI_VLRDESCIN
       , PRI_IPI           = V_PRI_IPI
       , PRI_VALORIPI      = V_PRI_VALORIPI
       , PRI_BASECALCULOICMSST = V_PRI_BASEICMSST
       , PRI_VALORICMSST       = V_PRI_VALORICMSST
       , PRI_ICMSDESON     = V_PRI_ICMSDESON
       , PRI_ALTERADATA    = sysdate
       , PRI_ALTERAPOR     = V_USUARIO
   WHERE PRP_CODIGO = V_PRP_CODIGO
     AND PRI_SEQUENCIA = V_PRI_SEQUENCIA;

  IF V_COMMIT = 'S' THEN
    -- Atualizar Totais Cabeçalho Proposta
    declare
      V_TRIANGULACAO proposta.prp_triangulacao %type;
    begin
      SELECT PRP_TRIANGULACAO INTO V_TRIANGULACAO
        FROM PROPOSTA
       WHERE PRP_CODIGO = V_PRP_CODIGO;

      Prc_Reprocessa_Totais(V_PRP_CODIGO, V_TRIANGULACAO, 'N');

      exception
        when others then
          rollback;
          raise_application_error(-20000, 'Erro ao Atualizar Totais Cabeçalho Proposta'||chr(10)||sqlerrm);
    end;

    COMMIT ;
  END IF;

EXCEPTION
  WHEN OTHERS THEN
        ROLLBACK;
        RAISE;

END PRC_ALTERA_ITENS_PROPOSTA;

-------------------------------------------------------------------------------------------------------------------------

END PCK_PROPOSTA;
