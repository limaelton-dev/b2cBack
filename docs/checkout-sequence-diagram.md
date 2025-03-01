# Diagrama de Sequência do Checkout

O diagrama abaixo ilustra o fluxo completo do processo de checkout, desde a validação até o processamento do pagamento.

```mermaid
sequenceDiagram
    participant Cliente as Cliente (Frontend)
    participant CC as CheckoutController
    participant CVS as CheckoutValidationService
    participant OS as OrderService
    participant CS as CartService
    participant PS as ProfileService
    participant AS as AddressService
    participant CaS as CardService
    participant PrS as ProdutoService
    participant MPS as MercadoPagoService
    participant MP as Mercado Pago API
    
    %% Fluxo de Validação do Checkout
    Cliente->>CC: POST /checkout/validate
    Note over Cliente,CC: Envia shipping_address_id, payment_method, card_id
    CC->>PS: findByUserId(userId)
    PS-->>CC: Retorna perfil do usuário
    CC->>CS: getCarrinhoUser(userId)
    CS-->>CC: Retorna dados do carrinho
    
    CC->>CVS: validateCheckout(profileId, cartData, shippingAddressId, paymentMethod, cardId)
    
    %% Validações
    CVS->>PS: findById(profileId)
    PS-->>CVS: Verifica se o perfil existe
    
    CVS->>AS: findOne(shippingAddressId)
    AS-->>CVS: Verifica se o endereço existe e pertence ao perfil
    
    alt Pagamento com cartão
        CVS->>CaS: findOne(cardId)
        CaS-->>CVS: Verifica se o cartão existe e pertence ao perfil
    end
    
    CVS->>PrS: getProduto(productCodesStr)
    PrS-->>CVS: Verifica disponibilidade dos produtos
    
    alt Validação falhou
        CVS-->>CC: Retorna erros de validação
        CC-->>Cliente: Resposta com erros (400 Bad Request)
    else Validação bem-sucedida
        %% Criação do pedido
        CVS->>CVS: Prepara DTO do pedido
        CVS-->>CC: Retorna DTO do pedido
        CC->>OS: create(orderDto)
        OS-->>CC: Retorna pedido criado
        CC-->>Cliente: Resposta com order_id (200 OK)
        
        %% Fluxo de Processamento do Pagamento
        Cliente->>CC: POST /checkout/process-payment
        Note over Cliente,CC: Envia order_id, payment_method, payment_method_id, token, etc.
        
        CC->>PS: findByUserId(userId)
        PS-->>CC: Retorna perfil do usuário
        
        CC->>OS: findOne(orderId)
        OS-->>CC: Retorna pedido
        
        CC->>CVS: validateOrderForPayment(orderId, paymentMethod, cardId)
        CVS-->>CC: Valida o pedido para pagamento
        
        alt Validação do pagamento falhou
            CC-->>Cliente: Resposta com erros (400 Bad Request)
        else Validação do pagamento bem-sucedida
            CC->>CC: Prepara dados para o Mercado Pago
            CC->>MPS: createPayment(paymentRequest)
            MPS->>MP: Envia requisição de pagamento
            MP-->>MPS: Resposta do pagamento
            MPS-->>CC: Retorna resposta do pagamento
            
            CC->>OS: updateStatus(orderId, status)
            OS-->>CC: Atualiza status do pedido
            
            alt Pagamento aprovado
                CC->>CS: updateCarrinhoUser(userId, { cart_data: [] })
                CS-->>CC: Limpa o carrinho
            end
            
            CC-->>Cliente: Resposta com detalhes do pagamento (200 OK)
        end
    end
    
    %% Webhook do Mercado Pago (assíncrono)
    MP->>MPS: POST /mercado-pago/webhook
    MPS->>OS: updateStatus(orderId, newStatus)
    OS-->>MPS: Atualiza status do pedido
    MPS-->>MP: Resposta do webhook (200 OK)
```

## Explicação do Fluxo

1. **Validação do Checkout**:
   - O cliente envia os dados do checkout para o endpoint `/checkout/validate`
   - O sistema valida todos os aspectos do checkout
   - Se a validação for bem-sucedida, um pedido é criado
   - O ID do pedido é retornado para o cliente

2. **Processamento do Pagamento**:
   - O cliente envia os dados do pagamento para o endpoint `/checkout/process-payment`
   - O sistema valida o pedido e os dados do pagamento
   - O pagamento é processado através do Mercado Pago
   - O status do pedido é atualizado com base na resposta do pagamento
   - Se o pagamento for aprovado, o carrinho é limpo
   - Os detalhes do pagamento são retornados para o cliente

3. **Webhook (Assíncrono)**:
   - O Mercado Pago envia notificações de mudanças no status do pagamento
   - O sistema processa a notificação e atualiza o status do pedido
   - Isso permite acompanhar pagamentos pendentes (como PIX e boleto) 