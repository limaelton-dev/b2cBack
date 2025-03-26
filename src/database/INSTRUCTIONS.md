# Instruções para Reset e Migração do Banco de Dados

Este documento contém instruções para resetar completamente o banco de dados e aplicar a nova migração consolidada com as tabelas no singular.

## 1. Preparação

Antes de iniciar o processo, certifique-se de:
- Ter um backup do banco de dados atual, se necessário
- Estar com as dependências do projeto instaladas (`npm install`)
- Ter as variáveis de ambiente configuradas corretamente

## 2. Reset do Banco de Dados

### 2.1. Usando o Comando Automatizado (Recomendado)

A maneira mais simples de resetar o banco de dados é usar o comando NPM que criamos:

```bash
npm run db:reset
```

Este comando irá:
1. Conectar ao banco de dados
2. Limpar a tabela de migrações (se existir)
3. Remover todas as tabelas e tipos existentes
4. Executar a migração consolidada
5. Popular o banco com dados iniciais (seeders)

### 2.2. Reset Manual

Se preferir fazer o processo manualmente, siga estas etapas:

#### 2.2.1. Remover Migrações Antigas

As migrações antigas (`1710974400000-CreateTables.ts` e `1714561400000-RenameUsersTableToUser.ts`) foram consolidadas na nova migração `1714680000000-ConsolidatedMigration.ts`. Se desejar, você pode manter os arquivos antigos por referência, mas eles não serão mais necessários para execução.

#### 2.2.2. Limpar a Tabela de Migrações no Banco

```bash
# Conecte-se ao banco de dados e execute:
DELETE FROM migrations;
```

Alternativamente, você pode simplesmente excluir o banco de dados atual e criar um novo banco vazio:

```bash
# PostgreSQL
dropdb seu_banco_de_dados
createdb seu_banco_de_dados
```

#### 2.2.3. Executar a Nova Migração

Execute o comando para aplicar a nova migração consolidada:

```bash
npm run migration:run
```

Isso executará apenas a migração `1714680000000-ConsolidatedMigration.ts`, criando todas as tabelas (com nomes no singular) em uma única operação.

#### 2.2.4. Executar os Seeders

Para popular o banco de dados com dados iniciais:

```bash
# Para execução normal
npm run seed

# Para forçar a recriação dos dados mesmo se já existirem
npm run seed:force
```

## 3. Observações Importantes

1. **Alterações nos Nomes das Tabelas**: Todas as tabelas agora estão no singular (`user` em vez de `users`, `profile` em vez de `profiles`, etc.).

2. **Sem Alterações nas Entidades**: As entidades do código permanecem inalteradas. O TypeORM gerencia o mapeamento entre os nomes das tabelas no banco e as classes de entidade.

3. **Reversão**: Se precisar reverter a migração, execute:
   ```bash
   npm run migration:revert
   ```
   
4. **Ambientes de Desenvolvimento/Produção**: Certifique-se de aplicar estas alterações em ambientes de testes antes de aplicar em produção.

## 4. Solução de Problemas

Se encontrar erros durante o processo:

1. **Erro ao Executar Migração**: Verifique se não há conexões ativas com o banco de dados que possam estar bloqueando operações.

2. **Erro nos Seeders**: Verifique se as entidades e repositórios estão corretamente importados e se correspondem à nova estrutura do banco.

3. **Problemas de Relações**: Se houver problemas com chaves estrangeiras, a ordem de criação das tabelas na migração pode precisar de ajustes. 