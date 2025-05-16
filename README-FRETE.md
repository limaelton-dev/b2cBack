# Cálculo de Frete no Carrinho

Este documento descreve como usar a funcionalidade de cálculo de frete no carrinho de compras.

## Configuração Necessária

Antes de usar a funcionalidade de cálculo de frete, você precisa configurar a variável de ambiente `CORREIOS_CEP_ORIGEM` com o CEP de origem dos produtos (local de onde saem as mercadorias). Adicione esta variável ao seu arquivo `.env`:

```
CORREIOS_CEP_ORIGEM=00000000
```

Substitua `00000000` pelo CEP real de origem dos produtos.

## Utilização da API

### Calcular Frete para o Carrinho

Para calcular o frete do carrinho, use o seguinte endpoint:

```
GET /cart/shipping?zipCode=00000000&shippingType=ALL
```

Parâmetros:
- `zipCode` (obrigatório): CEP de destino para onde os produtos serão enviados
- `shippingType` (opcional): Tipo de serviço de entrega desejado
  - `ALL`: Calcula todas as opções disponíveis (padrão)
  - `SEDEX`: Calcula apenas a opção SEDEX
  - `PAC`: Calcula apenas a opção PAC (Nota: pode não estar disponível em ambiente de homologação)

### Exemplo de Resposta

```json
{
  "success": true,
  "message": "Frete calculado com sucesso para múltiplos serviços",
  "data": {
    "items": [
      {
        "productId": 1,
        "serviceCode": "04014",
        "quantity": 2,
        "price": 15.50,
        "deliveryTime": 3
      }
    ],
    "totalPrice": 15.50,
    "maxDeliveryTime": 3,
    "estimatedDeliveryDate": "2023-07-25T00:00:00.000Z",
    "availableServices": [
      {
        "serviceCode": "04014",
        "serviceName": "SEDEX",
        "price": 15.50,
        "deliveryTime": 3,
        "isEstimated": false
      },
      {
        "serviceCode": "04510",
        "serviceName": "PAC",
        "price": 10.25,
        "deliveryTime": 7,
        "isEstimated": false
      }
    ]
  }
}
```

## Integração no Frontend

Para integrar esta funcionalidade no frontend, siga estes passos:

1. Quando o usuário informar o CEP de entrega, faça uma chamada à API de cálculo de frete
2. Exiba as opções de frete disponíveis para o usuário escolher
3. Adicione o valor do frete escolhido ao total do pedido

Exemplo de uso com JavaScript/Fetch:

```javascript
async function calcularFrete(cep) {
  const response = await fetch(`/api/cart/shipping?zipCode=${cep}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  if (data.success) {
    // Exibir opções de frete para o usuário
    exibirOpcoesFrete(data.data.availableServices);
  } else {
    // Exibir mensagem de erro
    mostrarErro(data.message);
  }
}
```

## Observações

- O cálculo de frete é baseado no peso e dimensões dos produtos no carrinho
- As dimensões padrão são usadas quando os produtos não têm dimensões especificadas
- O serviço usa a API dos Correios para realizar os cálculos de frete
- Se o CEP de origem não estiver configurado, a API retornará um erro
- O serviço PAC pode não estar disponível no ambiente de homologação dos Correios 