# Documentação do Fluxo de Checkout

## Visão Geral

O processo de checkout da nossa API de e-commerce é dividido em duas etapas principais:
1. **Validação do Checkout**: Valida todos os dados necessários e cria um pedido.
2. **Processamento do Pagamento**: Processa o pagamento do pedido criado.

Esta abordagem em duas etapas proporciona maior segurança, rastreabilidade e uma melhor experiência para o usuário.

## Arquitetura

O fluxo de checkout é gerenciado pelos seguintes componentes:

- **CheckoutController**: Controlador que expõe os endpoints de validação e processamento de pagamento.
- **CheckoutValidationService**: Serviço responsável por validar todos os aspectos do checkout.
- **MercadoPagoService**: Serviço que integra com a API do Mercado Pago para processar pagamentos.
- **OrderService**: Serviço que gerencia os pedidos.
- **CartService**: Serviço que gerencia o carrinho de compras.

## Fluxo Detalhado

### 1. Validação do Checkout (`/checkout/validate`)

Quando o usuário clica em "Finalizar Compra" no frontend, o primeiro passo é chamar o endpoint de validação do checkout.

#### Processo:

1. **Validação dos Dados**:
   - Verifica se o perfil existe
   - Verifica se o carrinho tem itens
   - Verifica se o endereço de entrega existe e pertence ao usuário
   - Valida o método de pagamento
   - Valida o cartão (se aplicável)
   - Verifica a disponibilidade dos produtos no carrinho
   - Verifica se os produtos estão ativos

2. **Criação do Pedido**:
   - Os itens do carrinho são convertidos em itens do pedido
   - O pedido é associado ao perfil do usuário
   - O endereço de entrega é associado ao pedido
   - O método de pagamento é registrado
   - O status inicial do pedido é definido como "PENDENTE"

3. **Resposta**:
   - Retorna o ID do pedido criado, que será usado na próxima etapa

#### Exemplo de Requisição:

```http
POST /checkout/validate
Authorization: Bearer {token}
Content-Type: application/json

{
  "shipping_address_id": 1,
  "payment_method": "credit_card",
  "card_id": 1
}
```

#### Exemplo de Resposta (Sucesso):

```json
{
  "success": true,
  "order_id": 123,
  "message": "Checkout validado com sucesso"
}
```

#### Exemplo de Resposta (Erro):

```json
{
  "success": false,
  "errors": ["O endereço de entrega não pertence ao perfil informado"]
}
```

### 2. Processamento do Pagamento (`/checkout/process-payment`)

Após a validação bem-sucedida, o frontend deve chamar o endpoint de processamento de pagamento.

#### Processo:

1. **Validação Adicional**:
   - Verifica se o pedido existe e pertence ao usuário
   - Valida o método de pagamento
   - Valida o cartão (se aplicável)

2. **Preparação dos Dados**:
   - Monta o objeto de pagamento com os dados necessários
   - Inclui o ID do pedido como referência externa

3. **Processamento do Pagamento**:
   - Envia os dados para a API do Mercado Pago
   - Recebe a resposta com o status do pagamento

4. **Atualização do Status do Pedido**:
   - Atualiza o status do pedido com base na resposta do Mercado Pago
   - Possíveis status: "APROVADO", "PENDENTE", "REJEITADO", etc.

5. **Limpeza do Carrinho**:
   - Se o pagamento for aprovado, limpa o carrinho do usuário

6. **Resposta**:
   - Retorna os detalhes do pagamento e uma mensagem amigável para o usuário

#### Exemplo de Requisição (Cartão de Crédito):

```http
POST /checkout/process-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 123,
  "payment_method": "credit_card",
  "payment_method_id": "visa",
  "token": "token_gerado_pelo_mercado_pago",
  "installments": 1,
  "card_id": 1,
  "payer": {
    "identification": {
      "type": "CPF",
      "number": "12345678909"
    }
  }
}
```

#### Exemplo de Requisição (PIX):

```http
POST /checkout/process-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 123,
  "payment_method": "pix",
  "payment_method_id": "pix"
}
```

#### Exemplo de Requisição (Boleto):

```http
POST /checkout/process-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 123,
  "payment_method": "boleto",
  "payment_method_id": "bolbradesco",
  "payer": {
    "identification": {
      "type": "CPF",
      "number": "12345678909"
    }
  }
}
```

#### Exemplo de Resposta (Sucesso):

```json
{
  "success": true,
  "payment": {
    "id": 12345678,
    "status": "approved",
    "status_detail": "accredited",
    "payment_method_id": "visa",
    "payment_type_id": "credit_card",
    "transaction_amount": 100.50,
    "installments": 1,
    "date_approved": "2023-06-15T14:30:00.000-03:00",
    "date_created": "2023-06-15T14:29:50.000-03:00"
  },
  "order_status": "APROVADO",
  "message": "Pagamento aprovado com sucesso! Obrigado pela sua compra.",
  "is_approved": true
}
```

#### Exemplo de Resposta (Erro):

```json
{
  "success": false,
  "error": "Erro ao processar pagamento: O cartão foi recusado"
}
```

## Métodos de Pagamento Suportados

### Cartão de Crédito/Débito

Para pagamentos com cartão, é necessário gerar um token usando a biblioteca do Mercado Pago no frontend.

#### Processo:
1. Coletar os dados do cartão no frontend
2. Usar a biblioteca do Mercado Pago para gerar um token
3. Enviar o token para o backend no endpoint de processamento de pagamento

### PIX

Para pagamentos via PIX, o Mercado Pago gera um código QR e uma chave PIX.

#### Processo:
1. Enviar a requisição de pagamento com o método "pix"
2. Receber o código QR e a chave PIX na resposta
3. Exibir para o usuário realizar o pagamento

### Boleto

Para pagamentos via boleto, o Mercado Pago gera um boleto bancário.

#### Processo:
1. Enviar a requisição de pagamento com o método "boleto"
2. Receber o link do boleto na resposta
3. Exibir para o usuário realizar o pagamento

## Webhooks do Mercado Pago

O Mercado Pago envia notificações via webhook para informar sobre mudanças no status dos pagamentos.

### Endpoint de Webhook:

```http
POST /mercado-pago/webhook
```

### Processo:
1. O Mercado Pago envia uma notificação para o endpoint de webhook
2. O sistema processa a notificação e atualiza o status do pedido
3. Se o pagamento for aprovado, o sistema pode disparar outras ações, como enviar um e-mail de confirmação

## Fluxo Completo no Frontend

O fluxo ideal no frontend seria:

1. Usuário seleciona produtos e adiciona ao carrinho
2. Usuário vai para a página de checkout
3. Usuário seleciona/confirma endereço de entrega
4. Usuário seleciona método de pagamento e fornece dados necessários
5. Usuário clica em "Finalizar Compra"
6. Frontend chama `/checkout/validate`
7. Se a validação for bem-sucedida, o frontend obtém o ID do pedido
8. Para pagamentos com cartão, o frontend gera o token do cartão usando a biblioteca do Mercado Pago
9. Frontend chama `/checkout/process-payment` com o ID do pedido e dados de pagamento
10. Frontend exibe o resultado do pagamento para o usuário
11. Se aprovado, redireciona para página de confirmação do pedido
12. Se pendente (como PIX ou boleto), exibe instruções de pagamento
13. Se rejeitado, exibe mensagem de erro e permite tentar novamente

## Vantagens deste Fluxo em Duas Etapas

1. **Segurança**: Validamos tudo antes de processar o pagamento
2. **Rastreabilidade**: Temos um pedido criado antes mesmo do pagamento
3. **Experiência do usuário**: Podemos fornecer feedback detalhado em cada etapa
4. **Flexibilidade**: O usuário pode tentar diferentes métodos de pagamento para o mesmo pedido
5. **Integridade dos dados**: Usamos transações para garantir que tudo seja salvo corretamente

## Testando via Postman

Para testar o fluxo de checkout via Postman, siga os passos abaixo:

### 1. Autenticação

Primeiro, obtenha um token JWT válido fazendo login:

```http
POST /auth/login
Content-Type: application/json

{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```

### 2. Validação do Checkout

```http
POST /checkout/validate
Authorization: Bearer {seu_token_jwt}
Content-Type: application/json

{
  "shipping_address_id": 1,
  "payment_method": "credit_card",
  "card_id": 1
}
```

### 3. Processamento do Pagamento

```http
POST /checkout/process-payment
Authorization: Bearer {seu_token_jwt}
Content-Type: application/json

{
  "order_id": 123,
  "payment_method": "credit_card",
  "payment_method_id": "visa",
  "token": "token_gerado_pelo_mercado_pago",
  "installments": 1,
  "card_id": 1,
  "payer": {
    "identification": {
      "type": "CPF",
      "number": "12345678909"
    }
  }
}
```

### Cartões de Teste do Mercado Pago

Para testes, você pode usar os seguintes cartões:

- **Visa (aprovado)**: 4509 9535 6623 3704, CVV: 123, Data: qualquer data futura
- **Mastercard (aprovado)**: 5031 7557 3453 0604, CVV: 123, Data: qualquer data futura
- **Visa (recusado)**: 4000 0000 0000 0002, CVV: 123, Data: qualquer data futura

## Tratamento de Erros

O sistema fornece mensagens de erro detalhadas para ajudar a identificar problemas:

- **Validação de Dados**: Erros relacionados aos dados fornecidos pelo usuário
- **Disponibilidade de Produtos**: Erros relacionados à disponibilidade dos produtos
- **Pagamento**: Erros retornados pelo Mercado Pago durante o processamento do pagamento

Cada erro inclui uma mensagem amigável que pode ser exibida diretamente para o usuário.

## Considerações de Segurança

1. **Autenticação**: Todos os endpoints de checkout requerem autenticação via JWT
2. **Validação de Dados**: Todos os dados de entrada são validados usando class-validator
3. **Proteção contra CSRF**: Implementada através do uso de tokens JWT
4. **Dados Sensíveis**: Dados sensíveis do cartão nunca são armazenados no backend
5. **Logs**: Todas as operações são registradas em logs para auditoria

## Conclusão

O fluxo de checkout implementado segue as melhores práticas de segurança e experiência do usuário, proporcionando um processo robusto e confiável para o e-commerce. A integração com o Mercado Pago permite oferecer diversos métodos de pagamento, atendendo às necessidades dos clientes. 