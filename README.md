# 🏟️ Sistema de Agendamento de Quadras - Setup

## 📋 Pré-requisitos

1. **Node.js** (versão 18 ou superior)
2. **PostgreSQL** (versão 12 ou superior)
3. **npm** ou **yarn**

## 🚀 Configuração do Banco de Dados

### 1. Instalar PostgreSQL

**macOS (usando Homebrew):**

```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Criar o Banco de Dados

```bash
# Conectar ao PostgreSQL como usuário postgres
sudo -u postgres psql

# Criar usuário e banco de dados
CREATE USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE court_booking OWNER postgres;
GRANT ALL PRIVILEGES ON DATABASE court_booking TO postgres;

# Sair do psql
\q
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env` e ajuste as configurações conforme necessário:

```bash
cp .env .env.local
```

Edite o arquivo `.env` com suas configurações:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=court_booking
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

## 🏗️ Instalação e Execução

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar Migrações (se necessário)

```bash
npm run migration:run
```

### 3. Executar a Aplicação

**Modo Desenvolvimento:**

```bash
npm run start:dev
```

**Modo Produção:**

```bash
npm run build
npm run start:prod
```

### 4. Executar Testes

```bash
# Testes unitários
npm test

# Testes com cobertura
npm run test:cov

# Testes e2e
npm run test:e2e
```

## 📚 Documentação da API

Após executar a aplicação, acesse:

- **Swagger UI**: http://localhost:3000/api
- **API Base**: http://localhost:3000

## 🔗 Endpoints Principais

### Autenticação

- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login

### Quadras

- `GET /courts` - Listar quadras
- `POST /courts` - Criar quadra
- `PUT /courts/:id` - Atualizar quadra
- `DELETE /courts/:id` - Remover quadra

### Agendamentos

- `GET /bookings` - Listar agendamentos
- `GET /bookings?date=YYYY-MM-DD` - Agendamentos por data
- `POST /bookings` - Criar agendamento
- `GET /my-bookings` - Meus agendamentos
- `PATCH /bookings/:id` - Atualizar agendamento
- `DELETE /bookings/:id` - Cancelar agendamento

## 🎯 Funcionalidades

- ✅ **Sistema flexível de horários**: 30min, 1h, 1h30, etc.
- ✅ **Detecção automática de conflitos**: Previne sobreposição de horários
- ✅ **Autenticação JWT**: Segurança baseada em tokens
- ✅ **Controle de acesso**: Usuários só editam suas próprias reservas
- ✅ **Status de reservas**: PENDING, CONFIRMED, CANCELLED
- ✅ **Relacionamentos**: Quadras ↔ Reservas ↔ Usuários
- ✅ **Documentação automática**: Swagger/OpenAPI
- ✅ **Cobertura de testes**: 88.59% com 182 testes

## 🛠️ Troubleshooting

### Erro de Conexão com o Banco

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solução**: Verifique se o PostgreSQL está rodando:

```bash
# macOS
brew services restart postgresql

# Linux
sudo systemctl restart postgresql
```

### Erro de Autenticação

```
Error: password authentication failed for user "postgres"
```

**Solução**: Verifique as credenciais no arquivo `.env` e reconfigure o usuário PostgreSQL se necessário.

### Erro de TypeORM

```
DataTypeNotSupportedError: Data type "datetime" not supported
```

**Solução**: ✅ **Já corrigido!** As entidades agora usam `timestamp` compatível com PostgreSQL.

## 📞 Suporte

Para problemas ou dúvidas, verifique:

1. Os logs da aplicação
2. Se o banco está conectado corretamente
3. Se todas as dependências foram instaladas
4. Se as variáveis de ambiente estão configuradas
