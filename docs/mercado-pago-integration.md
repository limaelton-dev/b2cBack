# Integração com Mercado Pago

Este documento detalha a integração da API de e-commerce com o Mercado Pago, incluindo configuração, implementação e testes.

## Configuração Inicial

### Pré-requisitos

1. Conta no Mercado Pago (você pode criar uma em [https://www.mercadopago.com.br](https://www.mercadopago.com.br))
2. Credenciais de acesso (Access Token e Public Key)
3. Node.js e npm instalados

### Instalação da SDK

```bash
npm install mercadopago
```

### Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
MERCADO_PAGO_ACCESS_TOKEN=TEST-1234567890123456-012345-abcdef1234567890abcdef1234567890-123456789
MERCADO_PAGO_PUBLIC_KEY=TEST-12345678-abcd-efgh-ijkl-1234567890ab
```

> **Importante**: Nunca compartilhe ou cometa suas credenciais no controle de versão.

## Implementação do Serviço

O serviço `MercadoPagoService` é responsável por encapsular a integração com o Mercado Pago.

### Estrutura do Serviço

```typescript
import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MercadoPagoService {
  constructor(private configService: ConfigService) {
    // Configuração do SDK com o Access Token
    mercadopago.configure({
      access_token: this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN'),
    });
  }

  // Métodos para interagir com a API do Mercado Pago
  // ...
}
```

### Métodos Principais

#### Criação de Pagamento

```typescript
async createPayment(paymentData: any): Promise<any> {
  try {
    const response = await mercadopago.payment.create(paymentData);
    return response.body;
  } catch (error) {
    throw new Error(`Erro ao criar pagamento: ${error.message}`);
  }
}
```

#### Consulta de Pagamento

```typescript
async getPayment(paymentId: number): Promise<any> {
  try {
    const response = await mercadopago.payment.get(paymentId);
    return response.body;
  } catch (error) {
    throw new Error(`Erro ao consultar pagamento: ${error.message}`);
  }
}
```

#### Cancelamento de Pagamento

```typescript
async cancelPayment(paymentId: number): Promise<any> {
  try {
    const response = await mercadopago.payment.cancel(paymentId);
    return response.body;
  } catch (error) {
    throw new Error(`Erro ao cancelar pagamento: ${error.message}`);
  }
}
```

#### Reembolso de Pagamento

```typescript
async refundPayment(paymentId: number): Promise<any> {
  try {
    const response = await mercadopago.refund.create({ payment_id: paymentId });
    return response.body;
  } catch (error) {
    throw new Error(`Erro ao reembolsar pagamento: ${error.message}`);
  }
}
```

## Estrutura de Dados para Pagamentos

### Pagamento com Cartão de Crédito

```typescript
const paymentData = {
  transaction_amount: 100.0,
  token: 'ff8080814c11e237014c1ff593b57b4d',
  description: 'Descrição do produto',
  installments: 1,
  payment_method_id: 'visa',
  payer: {
    email: 'test_user_123456@testuser.com',
    identification: {
      type: 'CPF',
      number: '12345678909'
    }
  },
  additional_info: {
    items: [
      {
        id: 'PR001',
        title: 'Produto de Teste',
        description: 'Descrição do Produto',
        picture_url: 'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif',
        category_id: 'electronics',
        quantity: 1,
        unit_price: 100.0
      }
    ],
    shipments: {
      receiver_address: {
        zip_code: '12345678',
        street_name: 'Rua Exemplo',
        street_number: 123,
        floor: '4',
        apartment: '2'
      }
    }
  }
};
```

### Pagamento com PIX

```typescript
const paymentData = {
  transaction_amount: 100.0,
  description: 'Descrição do produto',
  payment_method_id: 'pix',
  payer: {
    email: 'test_user_123456@testuser.com',
    first_name: 'Test',
    last_name: 'User',
    identification: {
      type: 'CPF',
      number: '12345678909'
    }
  },
  additional_info: {
    items: [
      {
        id: 'PR001',
        title: 'Produto de Teste',
        description: 'Descrição do Produto',
        category_id: 'electronics',
        quantity: 1,
        unit_price: 100.0
      }
    ]
  }
};
```

### Pagamento com Boleto

```typescript
const paymentData = {
  transaction_amount: 100.0,
  description: 'Descrição do produto',
  payment_method_id: 'bolbradesco',
  payer: {
    email: 'test_user_123456@testuser.com',
    first_name: 'Test',
    last_name: 'User',
    identification: {
      type: 'CPF',
      number: '12345678909'
    },
    address: {
      zip_code: '12345678',
      street_name: 'Rua Exemplo',
      street_number: '123',
      neighborhood: 'Bairro',
      city: 'Cidade',
      federal_unit: 'SP'
    }
  },
  additional_info: {
    items: [
      {
        id: 'PR001',
        title: 'Produto de Teste',
        description: 'Descrição do Produto',
        category_id: 'electronics',
        quantity: 1,
        unit_price: 100.0
      }
    ]
  }
};
```

## Implementação do Webhook

O webhook é responsável por receber notificações do Mercado Pago sobre mudanças no status dos pagamentos.

### Controlador de Webhook

```typescript
import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { OrderService } from '../order/order.service';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(
    private mercadoPagoService: MercadoPagoService,
    private orderService: OrderService,
  ) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() body: any): Promise<any> {
    try {
      if (body.type === 'payment' && body.action === 'payment.updated') {
        const paymentId = body.data.id;
        const payment = await this.mercadoPagoService.getPayment(paymentId);
        
        // Atualiza o status do pedido com base no status do pagamento
        const orderId = payment.external_reference;
        const paymentStatus = payment.status;
        
        await this.orderService.updateStatus(orderId, this.mapPaymentStatus(paymentStatus));
        
        return { success: true, message: 'Webhook processado com sucesso' };
      }
      
      return { success: true, message: 'Webhook recebido, mas não processado' };
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return { success: false, error: error.message };
    }
  }
  
  private mapPaymentStatus(paymentStatus: string): string {
    const statusMap = {
      'approved': 'APROVADO',
      'pending': 'PENDENTE',
      'in_process': 'EM_PROCESSAMENTO',
      'rejected': 'REJEITADO',
      'cancelled': 'CANCELADO',
      'refunded': 'REEMBOLSADO',
    };
    
    return statusMap[paymentStatus] || 'PENDENTE';
  }
}
```

### Configuração do Webhook no Mercado Pago

1. Acesse o [Dashboard do Mercado Pago](https://www.mercadopago.com.br/developers/panel)
2. Vá para "Webhooks"
3. Adicione uma nova URL de webhook: `https://seu-dominio.com/mercado-pago/webhook`
4. Selecione os eventos que deseja receber (pelo menos "payment.updated")

## Testes

### Ambiente de Teste

O Mercado Pago fornece um ambiente de teste (sandbox) para testar a integração sem realizar pagamentos reais.

### Usuários de Teste

Para criar usuários de teste:

1. Acesse o [Dashboard do Mercado Pago](https://www.mercadopago.com.br/developers/panel)
2. Vá para "Usuários de teste"
3. Crie um usuário vendedor e um usuário comprador

### Cartões de Teste

Utilize os cartões de teste fornecidos pelo Mercado Pago para simular diferentes cenários:

| Tipo | Número | CVV | Data de Expiração | Status |
|------|--------|-----|-------------------|--------|
| Mastercard | 5031 4332 1540 6351 | 123 | 11/25 | Aprovado |
| Visa | 4235 6477 2802 5682 | 123 | 11/25 | Aprovado |
| American Express | 3753 651535 56885 | 1234 | 11/25 | Aprovado |
| Mastercard | 5031 1111 1111 1111 | 123 | 11/25 | Recusado |

### Testando o Checkout

Para testar o checkout completo:

1. Crie um pedido através da API
2. Utilize o SDK do Mercado Pago para gerar um token de cartão (no frontend)
3. Envie o token para o backend junto com os demais dados do pagamento
4. Verifique se o pagamento foi processado corretamente
5. Confirme se o webhook foi recebido e processado

### Testando Webhooks Localmente

Para testar webhooks em ambiente local, você pode utilizar ferramentas como [ngrok](https://ngrok.com/) para expor seu servidor local à internet:

```bash
ngrok http 3000
```

Utilize a URL gerada pelo ngrok para configurar o webhook no Mercado Pago.

## Considerações de Produção

### Segurança

1. **Utilize HTTPS** para todas as comunicações
2. **Valide a autenticidade dos webhooks** verificando a assinatura
3. **Nunca armazene dados sensíveis de cartão**
4. **Implemente rate limiting** para evitar abusos

### Monitoramento

1. Configure alertas para falhas de pagamento
2. Monitore o tempo de resposta da API do Mercado Pago
3. Implemente logs detalhados para facilitar a depuração

### Tratamento de Erros

1. Implemente retentativas para falhas temporárias
2. Crie um sistema de notificação para erros críticos
3. Mantenha um registro detalhado de erros para análise posterior

## Recursos Adicionais

- [Documentação oficial do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/landing)
- [Referência da API](https://www.mercadopago.com.br/developers/pt/reference)
- [Guia de integração](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate) 