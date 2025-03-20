# Backend B2C

Backend para plataforma B2C utilizando NestJS, TypeORM e PostgreSQL.

## Estrutura do Projeto

O projeto segue a estrutura modular do NestJS, com os seguintes módulos principais:

- **Auth**: Autenticação e autorização
- **Users**: Gerenciamento de usuários
- **Profiles**: Perfis de usuários (PF e PJ)
- **Addresses**: Endereços dos usuários
- **Phones**: Telefones dos usuários
- **Cards**: Cartões de pagamento
- **Products**: Produtos disponíveis na plataforma
- **Orders**: Pedidos realizados pelos usuários
- **Payments**: Pagamentos associados aos pedidos
- **Discounts**: Descontos e cupons

## Pré-requisitos

- Node.js >= 14.x
- PostgreSQL >= 12.x
- npm >= 6.x

## Configuração

1. Clone o repositório
2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
   - Crie um arquivo `.env` baseado no `.env.example`
   - Ajuste as variáveis conforme sua configuração local

```
# DADOS DB
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=b2c_dev
DB_MIGRATIONS_RUN=false

# SECRET
JWT_SECRET=sua_chave_secreta_jwt

# MERCADO PAGO
MERCADO_PAGO_ACCESS_TOKEN=seu_token_mercado_pago
MERCADO_PAGO_PUBLIC_KEY=sua_chave_publica_mercado_pago
```

## Executando as Migrations

Para criar as tabelas necessárias no banco de dados:

```bash
# Compilar o projeto
npm run build

# Executar migrations
npm run migration:run
```

## Executando a Aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000/api`.

## Principais Rotas

### Autenticação

- **POST /api/auth/login**: Login de usuário
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }
  ```

### Usuários

- **POST /api/users**: Criar novo usuário
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }
  ```
- **GET /api/users**: Listar todos usuários
- **GET /api/users/:id**: Buscar usuário por ID
- **PATCH /api/users/:id**: Atualizar usuário
- **DELETE /api/users/:id**: Remover usuário

### Perfis

- **POST /api/profiles**: Criar perfil (PF ou PJ)
- **GET /api/profiles**: Listar perfis
- **GET /api/profiles/:id**: Buscar perfil por ID

### Telefones

- **POST /api/phones**: Adicionar telefone
  ```json
  {
    "profileId": 1,
    "ddd": "11",
    "number": "999999999",
    "isDefault": true
  }
  ```
- **GET /api/phones/profile/:profileId**: Buscar telefones por perfil
- **PATCH /api/phones/:id**: Atualizar telefone
- **DELETE /api/phones/:id**: Remover telefone

### Cartões

- **POST /api/cards**: Adicionar cartão
  ```json
  {
    "profileId": 1,
    "cardNumber": "4111111111111111",
    "holderName": "NOME DO TITULAR",
    "expirationDate": "12/2025",
    "brand": "visa",
    "isDefault": true
  }
  ```
- **GET /api/cards/profile/:profileId**: Buscar cartões por perfil
- **PATCH /api/cards/:id**: Atualizar cartão
- **DELETE /api/cards/:id**: Remover cartão

### Pedidos

- **POST /api/orders**: Criar pedido
  ```json
  {
    "fullAddress": "Rua Exemplo, 123 - Bairro - Cidade/UF - CEP 00000-000",
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ],
    "discountId": 1
  }
  ```
- **GET /api/orders**: Listar pedidos do usuário
- **GET /api/orders/:id**: Buscar pedido por ID
- **PUT /api/orders/:id/status**: Atualizar status do pedido

### Pagamentos

- **POST /api/payments**: Registrar pagamento
  ```json
  {
    "orderId": 1,
    "transactionAmount": 100.50,
    "paymentMethodId": 1,
    "installments": 1,
    "payerEmail": "cliente@exemplo.com",
    "payerIdentificationType": "CPF",
    "payerIdentificationNumber": "12345678900",
    "payerFirstName": "João",
    "payerLastName": "Silva"
  }
  ```
- **GET /api/payments**: Listar todos pagamentos
- **GET /api/payments/:id**: Buscar pagamento por ID
- **GET /api/payments/order/:orderId**: Buscar pagamentos de um pedido
- **PATCH /api/payments/:id/status**: Atualizar status do pagamento
  ```json
  {
    "status": "approved"
  }
  ```
- **GET /api/payments/methods**: Listar métodos de pagamento
- **GET /api/payments/methods/:id**: Buscar método de pagamento por ID

## Licença

Este projeto é privado e proprietário.