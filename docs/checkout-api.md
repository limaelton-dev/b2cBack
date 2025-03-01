# API de Checkout

Esta documentação detalha os endpoints disponíveis na API de Checkout, responsável pelo processo de finalização de compra e pagamento.

## Base URL

```
https://api.exemplo.com/v1
```

## Autenticação

Todos os endpoints da API de Checkout requerem autenticação. Utilize o token JWT obtido no login para autenticar as requisições.

**Header de Autenticação:**
```
Authorization: Bearer {seu_token_jwt}
```

## Endpoints

### 1. Validar Checkout

Valida os dados do checkout e cria um pedido pendente.

**Endpoint:** `POST /checkout/validate`

#### Parâmetros da Requisição

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `shipping_address_id` | string | ID do endereço de entrega | Sim |
| `payment_method` | string | Método de pagamento (credit_card, pix, boleto) | Sim |
| `card_id` | string | ID do cartão salvo (obrigatório apenas para payment_method=credit_card) | Condicional |

#### Exemplo de Requisição

```json
{
  "shipping_address_id": "123e4567-e89b-12d3-a456-426614174000",
  "payment_method": "credit_card",
  "card_id": "123e4567-e89b-12d3-a456-426614174001"
}
```

#### Exemplo de Resposta (Sucesso)

```json
{
  "success": true,
  "order_id": "123e4567-e89b-12d3-a456-426614174002",
  "message": "Checkout validado com sucesso. Prossiga para o pagamento.",
  "order_details": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "status": "PENDENTE",
    "created_at": "2023-01-01T12:00:00Z",
    "total_amount": 150.00,
    "items": [
      {
        "product_id": "123e4567-e89b-12d3-a456-426614174003",
        "name": "Produto Exemplo",
        "quantity": 2,
        "unit_price": 75.00,
        "total_price": 150.00
      }
    ],
    "shipping_address": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "street": "Rua Exemplo",
      "number": "123",
      "complement": "Apto 101",
      "neighborhood": "Bairro Exemplo",
      "city": "Cidade Exemplo",
      "state": "SP",
      "zip_code": "12345-678",
      "country": "Brasil"
    }
  }
}
```

#### Exemplo de Resposta (Erro)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Erro na validação do checkout",
    "details": [
      {
        "field": "shipping_address_id",
        "message": "Endereço de entrega não encontrado"
      }
    ]
  }
}
```

### 2. Processar Pagamento

Processa o pagamento de um pedido previamente validado.

**Endpoint:** `POST /checkout/process-payment`

#### Parâmetros da Requisição

Os parâmetros variam de acordo com o método de pagamento:

##### Para Cartão de Crédito:

```json
{
  "order_id": "123e4567-e89b-12d3-a456-426614174002",
  "payment_method": "credit_card",
  "payment_method_id": "visa",
  "token": "9b2d63e00d66a8c721607214cedaecda",
  "installments": 3,
  "card_id": "123e4567-e89b-12d3-a456-426614174001"
}
```

##### Para PIX:

```json
{
  "order_id": "123e4567-e89b-12d3-a456-426614174002",
  "payment_method": "pix",
  "payment_method_id": "pix"
}
```

##### Para Boleto:

```json
{
  "order_id": "123e4567-e89b-12d3-a456-426614174002",
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

#### Exemplo de Resposta (Sucesso - Cartão de Crédito)

```json
{
  "success": true,
  "payment": {
    "id": 1234567890,
    "status": "approved",
    "status_detail": "accredited",
    "payment_method_id": "visa",
    "payment_type_id": "credit_card",
    "transaction_amount": 150.00,
    "installments": 3,
    "card": {
      "first_six_digits": "423564",
      "last_four_digits": "5682",
      "expiration_month": 11,
      "expiration_year": 2025,
      "cardholder": {
        "name": "NOME DO TITULAR"
      }
    },
    "transaction_details": {
      "net_received_amount": 142.50,
      "total_paid_amount": 150.00,
      "installment_amount": 50.00
    }
  },
  "order_status": "APROVADO",
  "message": "Pagamento aprovado com sucesso! Obrigado pela sua compra.",
  "is_approved": true
}
```

#### Exemplo de Resposta (Sucesso - PIX)

```json
{
  "success": true,
  "payment": {
    "id": 1234567890,
    "status": "pending",
    "status_detail": "pending_waiting_transfer",
    "payment_method_id": "pix",
    "payment_type_id": "bank_transfer",
    "transaction_amount": 150.00,
    "transaction_details": {
      "qr_code": "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142082d7b0752040000530398654041.005802BR5925Test User6009SAO PAULO62070503***63041D3D",
      "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAABRQAAAUUAQAAAACGnaNFAAAGsklEQVR42u3ZQW7kOBAEwPn/n+7T...",
      "external_resource_url": "https://www.mercadopago.com.br/payments/12345/ticket"
    }
  },
  "order_status": "PENDENTE",
  "message": "Pagamento PIX gerado com sucesso. Utilize o QR Code para pagar.",
  "is_approved": false
}
```

#### Exemplo de Resposta (Sucesso - Boleto)

```json
{
  "success": true,
  "payment": {
    "id": 1234567890,
    "status": "pending",
    "status_detail": "pending_waiting_payment",
    "payment_method_id": "bolbradesco",
    "payment_type_id": "ticket",
    "transaction_amount": 150.00,
    "transaction_details": {
      "external_resource_url": "https://www.mercadopago.com.br/payments/12345/ticket",
      "verification_code": "123456789012345678901234567890123456789012"
    },
    "date_of_expiration": "2023-12-31T23:59:59.000-04:00"
  },
  "order_status": "PENDENTE",
  "message": "Boleto gerado com sucesso. Utilize o link para visualizar e pagar.",
  "is_approved": false
}
```

#### Exemplo de Resposta (Erro)

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_ERROR",
    "message": "Erro ao processar o pagamento",
    "details": {
      "status": "rejected",
      "status_detail": "cc_rejected_insufficient_amount",
      "message": "Seu cartão não possui saldo suficiente. Por favor, use outro cartão ou entre em contato com o emissor."
    }
  }
}
```

### 3. Consultar Status do Pedido

Consulta o status atual de um pedido.

**Endpoint:** `GET /checkout/order/:orderId`

#### Parâmetros da URL

| Parâmetro | Descrição |
|-----------|-----------|
| `orderId` | ID do pedido a ser consultado |

#### Exemplo de Resposta (Sucesso)

```json
{
  "success": true,
  "order": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "status": "APROVADO",
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-01-01T12:05:00Z",
    "total_amount": 150.00,
    "items": [
      {
        "product_id": "123e4567-e89b-12d3-a456-426614174003",
        "name": "Produto Exemplo",
        "quantity": 2,
        "unit_price": 75.00,
        "total_price": 150.00
      }
    ],
    "shipping_address": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "street": "Rua Exemplo",
      "number": "123",
      "complement": "Apto 101",
      "neighborhood": "Bairro Exemplo",
      "city": "Cidade Exemplo",
      "state": "SP",
      "zip_code": "12345-678",
      "country": "Brasil"
    },
    "payment": {
      "id": 1234567890,
      "status": "approved",
      "payment_method": "credit_card",
      "payment_method_id": "visa",
      "installments": 3,
      "transaction_amount": 150.00
    }
  }
}
```

#### Exemplo de Resposta (Erro)

```json
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Pedido não encontrado"
  }
}
```

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Requisição inválida |
| 401 | Não autorizado |
| 403 | Acesso proibido |
| 404 | Recurso não encontrado |
| 422 | Erro de validação |
| 500 | Erro interno do servidor |

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| `VALIDATION_ERROR` | Erro na validação dos dados de entrada |
| `PAYMENT_ERROR` | Erro ao processar o pagamento |
| `ORDER_NOT_FOUND` | Pedido não encontrado |
| `INVALID_PAYMENT_METHOD` | Método de pagamento inválido |
| `INSUFFICIENT_STOCK` | Estoque insuficiente para um ou mais produtos |
| `INVALID_CARD` | Dados do cartão inválidos |
| `INVALID_ADDRESS` | Endereço de entrega inválido |
| `CART_EMPTY` | Carrinho vazio |
| `UNAUTHORIZED` | Usuário não autorizado |

## Fluxo de Checkout

O fluxo de checkout recomendado é:

1. Validar o checkout (`POST /checkout/validate`)
2. Processar o pagamento (`POST /checkout/process-payment`)
3. Consultar o status do pedido (`GET /checkout/order/:orderId`)

Para pagamentos que não são aprovados imediatamente (PIX, boleto), o frontend deve instruir o usuário a completar o pagamento e verificar o status posteriormente.

## Webhooks

Para receber atualizações assíncronas sobre o status dos pagamentos, configure um webhook no Mercado Pago apontando para:

```
https://api.exemplo.com/v1/mercado-pago/webhook
```

Consulte a [documentação de integração com o Mercado Pago](./mercado-pago-integration.md) para mais detalhes. 