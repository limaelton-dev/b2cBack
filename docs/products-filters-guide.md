# Guia de Filtros de Produtos - Categoria e Marca

## Visão Geral

O sistema de produtos possui filtros avançados que permitem buscar produtos por categoria, marca e termo de busca. Todos os filtros são aplicados automaticamente garantindo que apenas produtos ativos (`isProductActive = true`) sejam retornados.

## Endpoint Principal

```http
GET /products
```

## Parâmetros de Filtro Disponíveis

### 1. Filtros de Categoria

#### Por ID de Categoria Única
```http
GET /products?categories=123
```

#### Por Múltiplas Categorias (Array)
```http
GET /products?categories=123,456,789
```

#### Por Nome de Categoria
```http
GET /products?categories=eletronicos,smartphones
```

### 2. Filtros de Marca

#### Por ID de Marca Única
```http
GET /products?brands=10
```

#### Por Múltiplas Marcas (Array)
```http
GET /products?brands=10,20,30
```

#### Por Nome de Marca
```http
GET /products?brands=samsung,apple,xiaomi
```

### 3. Combinação de Filtros

#### Categoria + Marca
```http
GET /products?categories=123&brands=10,20
```

#### Categoria + Marca + Termo de Busca
```http
GET /products?categories=smartphones&brands=samsung&term=galaxy
```

## Parâmetros de Paginação

### Paginação por Page/Size (Recomendado)
```http
GET /products?page=1&size=20&categories=123
```

### Paginação por Offset/Limit
```http
GET /products?offset=0&limit=20&categories=123
```

## Exemplos Práticos

### 1. Buscar Smartphones Samsung
```http
GET /products?categories=smartphones&brands=samsung
```

### 2. Buscar Produtos Eletrônicos com Paginação
```http
GET /products?categories=eletronicos&page=1&size=10
```

### 3. Buscar por Termo em Múltiplas Categorias
```http
GET /products?term=wireless&categories=eletronicos,acessorios&page=1&size=20
```

### 4. Filtro Complexo
```http
GET /products?term=smartphone&categories=123,456&brands=samsung,apple&page=1&size=15
```

## Estrutura da Resposta

```json
{
  "items": [
    {
      "id": "123",
      "title": "Samsung Galaxy S24",
      "description": "Smartphone Samsung...",
      "model": "SM-S921B",
      "slug": "samsung-galaxy-s24",
      "brand": {
        "id": "10",
        "name": "Samsung"
      },
      "category": {
        "id": "123",
        "name": "Smartphones",
        "path": "Eletrônicos > Smartphones"
      },
      "characteristics": [
        {
          "name": "Cor",
          "value": "Preto"
        },
        {
          "name": "Memória",
          "value": "256GB"
        }
      ],
      "skus": [
        {
          "id": "456",
          "title": "Samsung Galaxy S24 256GB Preto",
          "partnerId": "SM-S921B-256-BK",
          "ean": "8806095123456"
        }
      ],
      "isProductActive": true
    }
  ],
  "offset": 0,
  "limit": 20,
  "totalMatched": 150,
  "currentPage": 1,
  "lastPage": 8
}
```

## Como Funcionam os Filtros

### 1. **Filtro por Categoria**
- Aceita IDs numéricos ou strings
- Compara com `product.category.id`
- Suporta múltiplas categorias (OR logic)

### 2. **Filtro por Marca**
- Aceita IDs numéricos ou strings
- Compara com `product.brand.id`
- Suporta múltiplas marcas (OR logic)

### 3. **Termo de Busca (term)**
- Busca normalizada (sem acentos, case-insensitive)
- Pesquisa nos campos:
  - `title` (título do produto)
  - `description` (descrição)
  - `model` (modelo)
  - `skus[].title` (título dos SKUs)
  - `skus[].partnerId` (código do SKU)
  - `skus[].ean` (código de barras)
  - `characteristics[].name` (nome das características)
  - `characteristics[].value` (valor das características)

### 4. **Combinação de Filtros**
- Todos os filtros são aplicados com lógica AND
- Dentro de cada filtro (categorias/marcas), a lógica é OR
- Exemplo: `categories=123,456&brands=10` = (categoria 123 OU 456) E marca 10

## Validações e Transformações

### Categorias e Marcas
```typescript
// Aceita string separada por vírgula
?categories=123,456,789

// Ou array de query parameters
?categories=123&categories=456&categories=789

// Automaticamente convertido para array
categories: ["123", "456", "789"]
```

### Termo de Busca
```typescript
// Automaticamente normalizado
?term="  SMARTPHONE Samsung  "

// Vira
term: "smartphone samsung"
```

## Casos de Uso Comuns

### 1. **Catálogo por Categoria**
```javascript
// Frontend: Mostrar produtos de uma categoria
const response = await fetch('/products?categories=smartphones&page=1&size=12');
```

### 2. **Filtro de Marca na Página de Categoria**
```javascript
// Frontend: Filtrar por marca dentro de uma categoria
const response = await fetch('/products?categories=smartphones&brands=samsung,apple&page=1&size=12');
```

### 3. **Busca com Filtros**
```javascript
// Frontend: Busca com filtros aplicados
const response = await fetch('/products?term=galaxy&categories=smartphones&brands=samsung&page=1&size=12');
```

### 4. **Navegação de Catálogo**
```javascript
// Frontend: Múltiplas categorias relacionadas
const response = await fetch('/products?categories=smartphones,tablets,smartwatches&page=1&size=20');
```

## Performance e Otimizações

### 1. **Stream Processing**
- Os filtros são aplicados em stream para melhor performance
- Produtos inativos são filtrados automaticamente
- Paginação é aplicada após os filtros

### 2. **Recomendações**
- Use paginação (`page`/`size`) para melhor UX
- Combine filtros para resultados mais específicos
- Cache as respostas no frontend quando possível

### 3. **Limites**
- Tamanho máximo por página: definido pelo sistema
- Offset mínimo: 0
- Page mínima: 1

## Exemplos de Integração Frontend

### React/JavaScript
```javascript
const ProductsFilter = () => {
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    term: '',
    page: 1,
    size: 12
  });

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    
    if (filters.categories.length) {
      params.append('categories', filters.categories.join(','));
    }
    
    if (filters.brands.length) {
      params.append('brands', filters.brands.join(','));
    }
    
    if (filters.term) {
      params.append('term', filters.term);
    }
    
    params.append('page', filters.page);
    params.append('size', filters.size);

    const response = await fetch(`/products?${params}`);
    return response.json();
  };

  // ... resto do componente
};
```

### cURL Examples
```bash
# Buscar smartphones Samsung
curl -X GET "http://localhost:3000/products?categories=smartphones&brands=samsung"

# Buscar com termo e paginação
curl -X GET "http://localhost:3000/products?term=wireless&page=1&size=10"

# Filtro complexo
curl -X GET "http://localhost:3000/products?term=smartphone&categories=123,456&brands=samsung,apple&page=1&size=15"
```

## Troubleshooting

### 1. **Nenhum resultado retornado**
- Verifique se os IDs de categoria/marca existem
- Confirme se há produtos ativos nessas categorias/marcas
- Teste sem filtros para ver se há produtos disponíveis

### 2. **Paginação incorreta**
- Use `page`/`size` em vez de `offset`/`limit` quando possível
- Verifique se `totalMatched` está sendo retornado corretamente

### 3. **Busca por termo não funciona**
- O termo é normalizado (sem acentos, minúsculo)
- Busca é feita por substring, não palavra exata
- Tente termos mais simples

Este sistema de filtros oferece flexibilidade total para criar experiências de catálogo ricas e performáticas! 🚀
