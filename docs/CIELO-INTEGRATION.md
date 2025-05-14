# Integração com Gateway de Pagamento Cielo

Este documento descreve a integração do sistema com o gateway de pagamento Cielo E-commerce.

## Configuração

A integração com a Cielo é configurada através das seguintes variáveis de ambiente:

```
CIELO_MERCHANT_ID=seu-merchant-id  
CIELO_MERCHANT_KEY=sua-merchant-key  
CIELO_ENVIRONMENT=sandbox  # ou production
CIELO_RETURN_URL=https://seu-site.com/checkout/return  
CIELO_SIMULATION_MODE=true  # Modo de simulação para ambiente de desenvolvimento
```

## Arquitetura

A integração segue princípios SOLID e Arquitetura Limpa:

1. **Interface Segregation**: Interfaces separadas para diferentes responsabilidades
   - `PaymentGateway`: Interface para gateways de pagamento
   - `PaymentGatewayRequest`: Interface para requisições de pagamento
   - `PaymentGatewayResponse`: Interface para respostas de pagamento

2. **Dependency Inversion**: Injeção de dependência via interfaces
   - `IPaymentService`: Interface para serviços de pagamento
   - `CieloService`: Implementação específica para Cielo

3. **Single Responsibility**: Classes com responsabilidades únicas
   - `CieloGateway`: Lida com a comunicação com a API da Cielo
   - `CieloService`: Orquestra o fluxo de pagamento

## Modo de Simulação

O sistema inclui um modo de simulação para facilitar testes em ambiente de desenvolvimento. Quando habilitado, o sistema não faz chamadas reais à API da Cielo, mas simula respostas como se tivesse feito.

Para habilitar o modo de simulação:
- Defina `CIELO_SIMULATION_MODE=true` no ambiente
- Ou utilize o ambiente sandbox com `CIELO_ENVIRONMENT=sandbox`

## Cartões de Teste

Em ambiente de sandbox, você pode usar os seguintes cartões de teste:

### Cartões de Crédito
1. **Visa (Aprovado)**:
   - Número: 4012001038443335
   - Validade: 12/2030
   - CVV: 123

2. **Visa (Negado)**:
   - Número: 4012001037141112
   - Validade: 12/2030
   - CVV: 123

3. **Mastercard (Aprovado)**:
   - Número: 5453010000066167
   - Validade: 12/2030
   - CVV: 123

### Cartões de Débito
1. **Visa (Aprovado)**:
   - Número: 4012001037141112
   - Validade: 12/2030
   - CVV: 123

2. **Mastercard (Aprovado)**:
   - Número: 5453010000066167
   - Validade: 12/2030
   - CVV: 123

## Endpoints

### 1. Processar Pagamento com Cartão de Crédito
```
POST /api/checkout/credit-card
```

Payload:
```json
{
  "cardNumber": "4012001038443335",
  "holder": "Nome do Titular",
  "expirationDate": "12/2030",
  "securityCode": "123",
  "brand": "Visa",
  "description": "Compra online",
  "address": "Endereço completo para entrega",
  "customerData": {
    "name": "Nome do Cliente",
    "email": "cliente@exemplo.com"
  }
}
```

### 2. Processar Pagamento com Cartão Tokenizado
```
POST /api/checkout/credit-card/token
```

Payload:
```json
{
  "token": "token-do-cartao",
  "brand": "Visa",
  "description": "Compra online (token)",
  "address": "Endereço completo para entrega",
  "customerData": {
    "name": "Nome do Cliente",
    "email": "cliente@exemplo.com"
  }
}
```

### 3. Consultar Transação
```
GET /api/checkout/transaction/:paymentId
```

### 4. Capturar Transação
```
PUT /api/checkout/transaction/:paymentId/capture?amount=100.00
```

### 5. Cancelar Transação
```
PUT /api/checkout/transaction/:paymentId/cancel?amount=100.00
```

### 6. Obter Cartões de Teste
```
GET /api/checkout/test-cards
```

## Referências

- [Documentação Oficial da API Cielo E-commerce](https://docs.cielo.com.br/ecommerce-cielo/reference/sobre-a-api)
- [Cielo E-commerce: Github](https://github.com/DeveloperCielo/API-3.0-PHP) 