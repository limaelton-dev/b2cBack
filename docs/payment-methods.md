# Métodos de Pagamento Suportados

Este documento detalha os métodos de pagamento suportados pela API de e-commerce, incluindo os requisitos específicos para cada método e exemplos de implementação.

## Visão Geral

A API suporta os seguintes métodos de pagamento através da integração com o Mercado Pago:

1. **Cartão de Crédito**
2. **PIX**
3. **Boleto Bancário**

Cada método de pagamento requer diferentes parâmetros e possui fluxos específicos de processamento.

## Cartão de Crédito

### Requisitos

Para processar pagamentos com cartão de crédito, os seguintes dados são necessários:

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `payment_method` | string | Deve ser "credit_card" | Sim |
| `payment_method_id` | string | Identificador do tipo de cartão (visa, mastercard, etc.) | Sim |
| `token` | string | Token gerado pelo Mercado Pago SDK | Sim |
| `installments` | number | Número de parcelas (1-12) | Sim |
| `card_id` | string | ID do cartão salvo (opcional se token for fornecido) | Não |

### Exemplo de Requisição

```json
{
  "order_id": "12345",
  "payment_method": "credit_card",
  "payment_method_id": "visa",
  "token": "9b2d63e00d66a8c721607214cedaecda",
  "installments": 3
}
```

### Fluxo de Processamento

1. O frontend coleta os dados do cartão do usuário
2. Utiliza o SDK do Mercado Pago para gerar um token seguro
3. Envia o token para o backend junto com os demais dados
4. O backend processa o pagamento e retorna o resultado

### Cartões de Teste

Para testes, o Mercado Pago disponibiliza os seguintes cartões:

| Tipo | Número | CVV | Data de Expiração | Status |
|------|--------|-----|-------------------|--------|
| Mastercard | 5031 4332 1540 6351 | 123 | 11/25 | Aprovado |
| Visa | 4235 6477 2802 5682 | 123 | 11/25 | Aprovado |
| American Express | 3753 651535 56885 | 1234 | 11/25 | Aprovado |
| Mastercard | 5031 1111 1111 1111 | 123 | 11/25 | Recusado |

## PIX

### Requisitos

Para processar pagamentos via PIX, os seguintes dados são necessários:

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `payment_method` | string | Deve ser "pix" | Sim |
| `payment_method_id` | string | Deve ser "pix" | Sim |

### Exemplo de Requisição

```json
{
  "order_id": "12345",
  "payment_method": "pix",
  "payment_method_id": "pix"
}
```

### Fluxo de Processamento

1. O backend gera um código PIX através do Mercado Pago
2. Retorna o código PIX e a URL da imagem QR Code
3. O usuário realiza o pagamento usando seu aplicativo bancário
4. O Mercado Pago notifica o backend via webhook quando o pagamento é confirmado
5. O sistema atualiza o status do pedido

### Exemplo de Resposta

```json
{
  "success": true,
  "payment": {
    "id": 12345,
    "status": "pending",
    "status_detail": "pending_waiting_transfer",
    "transaction_details": {
      "qr_code": "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142082d7b0752040000530398654041.005802BR5925Test User6009SAO PAULO62070503***63041D3D",
      "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAABRQAAAUUAQAAAACGnaNFAAAGsklEQVR42u3ZQW7kOBAEwPn/n+7T...",
      "external_resource_url": "https://www.mercadopago.com.br/payments/12345/ticket"
    }
  },
  "message": "Pagamento PIX gerado com sucesso. Utilize o QR Code para pagar."
}
```

## Boleto Bancário

### Requisitos

Para processar pagamentos via boleto, os seguintes dados são necessários:

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `payment_method` | string | Deve ser "boleto" | Sim |
| `payment_method_id` | string | Deve ser "bolbradesco" | Sim |
| `payer` | object | Informações do pagador | Sim |

### Estrutura do Objeto Payer

```json
{
  "email": "email@exemplo.com",
  "identification": {
    "type": "CPF",
    "number": "12345678909"
  },
  "first_name": "Nome",
  "last_name": "Sobrenome"
}
```

### Exemplo de Requisição Completa

```json
{
  "order_id": "12345",
  "payment_method": "boleto",
  "payment_method_id": "bolbradesco",
  "payer": {
    "email": "email@exemplo.com",
    "identification": {
      "type": "CPF",
      "number": "12345678909"
    },
    "first_name": "Nome",
    "last_name": "Sobrenome"
  }
}
```

### Fluxo de Processamento

1. O backend gera um boleto através do Mercado Pago
2. Retorna a URL do boleto e o código de barras
3. O usuário realiza o pagamento do boleto
4. O Mercado Pago notifica o backend via webhook quando o pagamento é confirmado
5. O sistema atualiza o status do pedido

### Exemplo de Resposta

```json
{
  "success": true,
  "payment": {
    "id": 12345,
    "status": "pending",
    "status_detail": "pending_waiting_payment",
    "transaction_details": {
      "external_resource_url": "https://www.mercadopago.com.br/payments/12345/ticket",
      "verification_code": "123456789012345678901234567890123456789012"
    },
    "date_of_expiration": "2023-12-31T23:59:59.000-04:00"
  },
  "message": "Boleto gerado com sucesso. Utilize o link para visualizar e pagar."
}
```

## Status de Pagamento

Os pagamentos podem ter os seguintes status:

| Status | Descrição |
|--------|-----------|
| `pending` | Pagamento pendente |
| `approved` | Pagamento aprovado |
| `authorized` | Pagamento autorizado, mas não capturado |
| `in_process` | Pagamento em análise |
| `in_mediation` | Pagamento em disputa |
| `rejected` | Pagamento rejeitado |
| `cancelled` | Pagamento cancelado |
| `refunded` | Pagamento devolvido |
| `charged_back` | Pagamento com chargeback |

## Webhooks

O Mercado Pago envia notificações via webhook para atualizar o status dos pagamentos. É importante configurar corretamente a URL de webhook no painel do Mercado Pago.

### Endpoint de Webhook

```
POST /mercado-pago/webhook
```

### Exemplo de Payload de Webhook

```json
{
  "action": "payment.updated",
  "api_version": "v1",
  "data": {
    "id": "12345"
  },
  "date_created": "2023-01-01T12:00:00Z",
  "id": 12345,
  "live_mode": true,
  "type": "payment"
}
```

## Considerações de Segurança

1. **Nunca armazene dados sensíveis de cartão** - Utilize sempre o token gerado pelo SDK do Mercado Pago
2. **Valide todos os dados de entrada** - Certifique-se de que todos os dados recebidos são válidos antes de processá-los
3. **Utilize HTTPS** - Todas as comunicações devem ser realizadas através de conexões seguras
4. **Verifique a autenticidade dos webhooks** - Valide se as notificações recebidas são realmente do Mercado Pago

## Tratamento de Erros

A API retorna erros no seguinte formato:

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_ERROR",
    "message": "Descrição detalhada do erro"
  }
}
```

### Códigos de Erro Comuns

| Código | Descrição |
|--------|-----------|
| `INVALID_PAYMENT_METHOD` | Método de pagamento inválido ou não suportado |
| `INVALID_CARD` | Dados do cartão inválidos |
| `INSUFFICIENT_FUNDS` | Fundos insuficientes |
| `CARD_DECLINED` | Cartão recusado pela operadora |
| `EXPIRED_CARD` | Cartão expirado |
| `INVALID_SECURITY_CODE` | Código de segurança inválido |
| `INVALID_PAYER_DATA` | Dados do pagador inválidos ou incompletos |
| `ORDER_NOT_FOUND` | Pedido não encontrado |
| `PAYMENT_PROCESSING_ERROR` | Erro no processamento do pagamento | 