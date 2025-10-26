# Integração com AnyMarket Orders API

## Visão Geral

O módulo de orders foi atualizado para integrar com a API do AnyMarket, permitindo buscar pedidos diretamente do repositório do AnyMarket em vez de utilizar apenas o banco de dados local.

## Novos Endpoints

### 1. GET /order/anymarket/orders

Busca uma lista de pedidos do AnyMarket com filtros opcionais.

#### Query Parameters

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `offset` | number | Offset para paginação |
| `limit` | number | Limite de resultados por página |
| `marketplaceId` | string | ID do marketplace |
| `accountName` | string | Nome da conta |
| `orderId` | string | ID do pedido |
| `orderNumber` | string | Número do pedido |
| `status` | string | Status do pedido |
| `paymentStatus` | string | Status do pagamento |
| `trackingNumber` | string | Número de rastreamento |
| `createdAfter` | string | Data de criação após (ISO string) |
| `createdBefore` | string | Data de criação antes (ISO string) |
| `updatedAfter` | string | Data de atualização após (ISO string) |
| `updatedBefore` | string | Data de atualização antes (ISO string) |

#### Exemplo de Request

```http
GET /order/anymarket/orders?limit=10&status=CONFIRMED&createdAfter=2024-01-01T00:00:00Z
Authorization: Bearer <jwt_token>
```

#### Exemplo de Response

```json
{
  "orders": [
    {
      "id": "12345",
      "accountName": "MyStore",
      "marketplaceId": "ML001",
      "marketplaceName": "MercadoLivre",
      "orderNumber": "ML-123456789",
      "status": "CONFIRMED",
      "paymentStatus": "PAID",
      "totalAmount": 199.90,
      "subtotalAmount": 179.90,
      "shippingAmount": 20.00,
      "currency": "BRL",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:00:00Z",
      "purchaseDate": "2024-01-15T10:30:00Z",
      "customer": {
        "id": "CUST001",
        "name": "João Silva",
        "email": "joao@email.com",
        "phone": "+5511999999999"
      },
      "items": [
        {
          "id": "ITEM001",
          "skuId": "SKU123",
          "productId": "PROD123",
          "title": "Produto Exemplo",
          "quantity": 1,
          "unitPrice": 179.90,
          "totalPrice": 179.90
        }
      ],
      // ... outros campos
    }
  ],
  "pagination": {
    "total": 150,
    "page": 0,
    "limit": 10,
    "totalPages": 15
  }
}
```

### 2. GET /order/anymarket/orders/:orderId

Busca um pedido específico do AnyMarket pelo ID.

#### Path Parameters

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `orderId` | string | ID do pedido no AnyMarket |

#### Exemplo de Request

```http
GET /order/anymarket/orders/12345
Authorization: Bearer <jwt_token>
```

#### Exemplo de Response

```json
{
  "id": "12345",
  "accountName": "MyStore",
  "marketplaceId": "ML001",
  "marketplaceName": "MercadoLivre",
  "orderNumber": "ML-123456789",
  "status": "CONFIRMED",
  "paymentStatus": "PAID",
  "totalAmount": 199.90,
  "subtotalAmount": 179.90,
  "discountAmount": 0.00,
  "shippingAmount": 20.00,
  "taxAmount": 0.00,
  "currency": "BRL",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:00:00Z",
  "purchaseDate": "2024-01-15T10:30:00Z",
  "customer": {
    "id": "CUST001",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "+5511999999999",
    "document": "12345678901",
    "documentType": "CPF"
  },
  "billingAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "country": "BR"
  },
  "shippingAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "country": "BR"
  },
  "items": [
    {
      "id": "ITEM001",
      "skuId": "SKU123",
      "productId": "PROD123",
      "title": "Produto Exemplo",
      "quantity": 1,
      "unitPrice": 179.90,
      "totalPrice": 179.90,
      "shippingCost": 20.00,
      "discount": 0.00,
      "images": [
        "https://example.com/image1.jpg"
      ]
    }
  ],
  "payments": [
    {
      "method": "CREDIT_CARD",
      "value": 199.90,
      "installments": 1,
      "status": "APPROVED",
      "transactionId": "TXN123456"
    }
  ],
  "shipping": {
    "method": "STANDARD",
    "cost": 20.00,
    "estimatedDeliveryDate": "2024-01-20T00:00:00Z",
    "trackingNumber": "TR123456789",
    "trackingUrl": "https://tracking.example.com/TR123456789",
    "carrier": "Correios",
    "status": "IN_TRANSIT"
  },
  "notes": "Observações do pedido",
  "tags": ["tag1", "tag2"],
  "customFields": {
    "field1": "value1"
  }
}
```

## Estrutura dos Dados

### AnyMarketOrder

A interface `AnyMarketOrder` representa um pedido completo do AnyMarket com todas as informações necessárias, incluindo:

- **Informações básicas**: ID, número do pedido, status, valores
- **Cliente**: Dados pessoais e de contato
- **Endereços**: Cobrança e entrega
- **Itens**: Produtos do pedido com preços e quantidades
- **Pagamentos**: Métodos e status de pagamento
- **Envio**: Informações de frete e rastreamento
- **Metadados**: Notas, tags e campos customizados

### Filtros Disponíveis

A interface `AnyMarketOrderFilter` permite filtrar pedidos por diversos critérios:

- **Paginação**: offset e limit
- **Identificação**: marketplaceId, accountName, orderId, orderNumber
- **Status**: status do pedido e pagamento
- **Rastreamento**: trackingNumber
- **Datas**: filtros por data de criação e atualização

## Autenticação

Todos os endpoints requerem autenticação JWT através do header `Authorization: Bearer <token>`.

## Tratamento de Erros

- **400 Bad Request**: Erro na comunicação com AnyMarket API
- **401 Unauthorized**: Token JWT inválido ou expirado
- **404 Not Found**: Pedido não encontrado no AnyMarket
- **429 Too Many Requests**: Limite de rate limit do AnyMarket atingido
- **500 Internal Server Error**: Erro interno do servidor

## Configuração

Certifique-se de que as variáveis de ambiente do AnyMarket estejam configuradas corretamente:

```env
ANYMARKET_BASE_URL=https://api.anymarket.com.br/v2
ANYMARKET_API_KEY=your_api_key
ANYMARKET_SECRET=your_secret
```

## Próximos Passos

- Implementar cache para melhorar performance
- Adicionar webhooks para sincronização automática
- Implementar endpoints para criação e atualização de pedidos
- Adicionar métricas e monitoramento
