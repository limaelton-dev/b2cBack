# Integração com Mercado Pago

Este documento descreve como utilizar a integração com o Mercado Pago implementada neste projeto.

## Configuração

Antes de utilizar a integração, é necessário configurar as credenciais do Mercado Pago no arquivo `.env`:

```
MERCADO_PAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN
MERCADO_PAGO_PUBLIC_KEY=SUA_PUBLIC_KEY
```

Você pode obter essas credenciais no [Dashboard do Mercado Pago](https://www.mercadopago.com.br/developers/panel/credentials).

## Endpoints Disponíveis

### 1. Processar Pagamento (Checkout Transparente)

**Endpoint:** `POST /mercado-pago/process-payment`

Este endpoint permite processar um pagamento utilizando o Checkout Transparente do Mercado Pago.

**Exemplo de Requisição:**

```json
{
  "transaction_amount": 100.0,
  "description": "Compra de produtos",
  "payment_method_id": "visa",
  "token": "ff8080814c11e237014c1ff593b57b4d",
  "installments": 1,
  "external_reference": "123",
  "payer": {
    "email": "test_user_123@testuser.com",
    "identification": {
      "type": "CPF",
      "number": "19119119100"
    },
    "first_name": "Test",
    "last_name": "User"
  }
}
```

**Resposta de Sucesso:**

```json
{
  "success": true,
  "payment": {
    "id": 1234567890,
    "status": "approved",
    "status_detail": "accredited",
    "external_reference": "123",
    ...
  }
}
```

### 2. Criar Preferência (Checkout Redirect)

**Endpoint:** `POST /mercado-pago/create-preference`

Este endpoint permite criar uma preferência de pagamento para utilizar o Checkout Redirect do Mercado Pago.

**Exemplo de Requisição:**

```json
{
  "items": [
    {
      "id": "item-1",
      "title": "Produto 1",
      "quantity": 1,
      "unit_price": 100.0,
      "description": "Descrição do produto 1",
      "currency_id": "BRL"
    }
  ],
  "external_reference": "123",
  "back_urls": {
    "success": "https://www.seu-site.com.br/success",
    "failure": "https://www.seu-site.com.br/failure",
    "pending": "https://www.seu-site.com.br/pending"
  },
  "notification_url": "https://www.seu-site.com.br/mercado-pago/webhook",
  "auto_return": "approved"
}
```

> **Nota:** O campo `id` é obrigatório para cada item. Se não for fornecido, o sistema gerará um ID único automaticamente.

**Resposta de Sucesso:**

```json
{
  "success": true,
  "preference": {
    "id": "123456789-abcdefghijklmnopqrst",
    "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789-abcdefghijklmnopqrst",
    "sandbox_init_point": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789-abcdefghijklmnopqrst",
    ...
  }
}
```

### 3. Webhook para Notificações

**Endpoint:** `POST /mercado-pago/webhook`

Este endpoint recebe as notificações do Mercado Pago sobre mudanças no status dos pagamentos.

**Exemplo de Requisição (enviada pelo Mercado Pago):**

```json
{
  "action": "payment.updated",
  "type": "payment",
  "data": {
    "id": "1234567890"
  }
}
```

**Resposta de Sucesso:**

```json
{
  "success": true,
  "result": {
    "success": true,
    "payment": {
      "id": 1234567890,
      "status": "approved",
      ...
    }
  }
}
```

### 4. Obter Informações de um Pagamento

**Endpoint:** `GET /mercado-pago/payment/:id`

Este endpoint permite obter informações detalhadas sobre um pagamento específico.

**Resposta de Sucesso:**

```json
{
  "success": true,
  "payment": {
    "id": 1234567890,
    "status": "approved",
    "status_detail": "accredited",
    "external_reference": "123",
    ...
  }
}
```

## Fluxo de Integração

### Checkout Transparente

1. O cliente seleciona os produtos e finaliza a compra
2. O frontend captura os dados do cartão e gera um token usando o SDK do Mercado Pago
3. O frontend envia o token e os dados do pagamento para o backend
4. O backend chama o endpoint `/mercado-pago/process-payment` para processar o pagamento
5. O backend atualiza o status do pedido com base na resposta do Mercado Pago
6. O frontend exibe o resultado do pagamento para o cliente

### Checkout Redirect

1. O cliente seleciona os produtos e finaliza a compra
2. O backend chama o endpoint `/mercado-pago/create-preference` para criar uma preferência de pagamento
3. O backend retorna o `init_point` para o frontend
4. O frontend redireciona o cliente para o `init_point`
5. O cliente realiza o pagamento no site do Mercado Pago
6. O Mercado Pago redireciona o cliente de volta para o site (usando as `back_urls`)
7. O Mercado Pago envia uma notificação para o `notification_url`
8. O backend processa a notificação e atualiza o status do pedido

## Tratamento de Status de Pagamento

Os status de pagamento do Mercado Pago são mapeados para os status do sistema da seguinte forma:

- `approved` -> `APROVADO`
- `pending` -> `PENDENTE`
- `in_process` -> `EM_PROCESSAMENTO`
- `rejected` -> `REJEITADO`
- `refunded` -> `REEMBOLSADO`
- `cancelled` -> `CANCELADO`
- `in_mediation` -> `EM_DISPUTA`
- `charged_back` -> `ESTORNADO`

## Cartões de Teste

Para testar diferentes cenários de pagamento, você pode usar os seguintes cartões de teste:

| Cartão | Número | CVV | Data | Status |
|--------|--------|-----|------|--------|
| Mastercard | 5031 4332 1540 6351 | 123 | 11/30 | Aprovado (APRO) |
| Visa | 4235 6477 2802 5682 | 123 | 11/30 | Rejeitado por erro geral (OTHE) |
| American Express | 3753 651535 56885 | 1234 | 11/30 | Pendente (CONT) |
| Elo Débito | 5067 7667 8388 8311 | 123 | 11/30 | Rejeitado com validação (CALL) |

Para testar outros cenários, use o nome do titular correspondente ao status desejado:
- FUND: Rejeitado por fundos insuficientes
- SECU: Rejeitado por código de segurança inválido

## Gerando Token de Cartão para Testes

Para testar o checkout transparente, você precisa gerar um token de cartão. Você pode fazer isso de duas maneiras:

### 1. Usando o SDK JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <title>Gerar Token Mercado Pago</title>
    <script src="https://sdk.mercadopago.com/js/v2"></script>
</head>
<body>
    <h1>Gerar Token de Cartão</h1>
    <div id="result"></div>

    <script>
        const mp = new MercadoPago('SUA_PUBLIC_KEY');
        
        const cardData = {
            cardNumber: "5031432154063511",
            cardholderName: "APRO",
            cardExpirationMonth: "11",
            cardExpirationYear: "30",
            securityCode: "123",
            identificationType: "CPF",
            identificationNumber: "12345678909"
        };

        mp.createCardToken(cardData)
            .then(token => {
                document.getElementById('result').innerHTML = 
                    `<p>Token gerado com sucesso: ${token.id}</p>
                     <pre>${JSON.stringify(token, null, 2)}</pre>`;
            })
            .catch(error => {
                document.getElementById('result').innerHTML = 
                    `<p>Erro ao gerar token: ${error.message}</p>
                     <pre>${JSON.stringify(error, null, 2)}</pre>`;
            });
    </script>
</body>
</html>
```

### 2. Usando a API do Mercado Pago (não recomendado para produção)

```
POST https://api.mercadopago.com/v1/card_tokens
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer PUBLIC_KEY
```

**Body:**
```json
{
  "card_number": "5031432154063511",
  "expiration_month": 11,
  "expiration_year": 2030,
  "security_code": "123",
  "cardholder": {
    "name": "APRO",
    "identification": {
      "type": "CPF",
      "number": "12345678909"
    }
  }
}
```

## Referências

- [Documentação do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/)
- [SDK do Mercado Pago para Node.js](https://github.com/mercadopago/sdk-nodejs) 