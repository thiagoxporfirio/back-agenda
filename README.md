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

- **Swagger UI**: http://localhost:3000/swagger
- **API Base**: http://localhost:3000

### 📋 Schemas Atualizados

#### AuthenticatedUser (Simplificado)

```typescript
{
  "id": 1,                    // ✅ ID único do usuário
  "email": "user@email.com",  // ✅ Email do usuário
  "role": "user"              // ✅ Papel (user/admin)
}
```

#### LoginResponse

```typescript
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@email.com",
    "role": "user"
  }
}
```

#### Booking (PostgreSQL Compatível)

```typescript
{
  "id": 1,
  "courtId": 1,
  "startTime": "2024-07-20T10:00:00.000Z",  // ✅ timestamp
  "endTime": "2024-07-20T11:00:00.000Z",    // ✅ timestamp
  "duration": 1.0,                          // ✅ decimal (0.5, 1.0, 1.5...)
  "status": "confirmed",
  "notes": "Reserva para treinamento"
}
```

## 🔗 Endpoints Principais

### Usuários

- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login
- `GET /users` - Listar usuários (admin)
- `GET /users/:id` - Buscar usuário específico
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário

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
- ✅ **Validação de email único**: Previne duplicação de usuários
- ✅ **Interface otimizada**: AuthenticatedUser simplificada (removido userId redundante)
- ✅ **Documentação automática**: Swagger/OpenAPI
- ✅ **Cobertura de testes**: 88.19% com 179 testes (23 suites)

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

### Erro de TypeORM - Data Type

```
DataTypeNotSupportedError: Data type "datetime" not supported
```

**Solução**: ✅ **Já corrigido!** As entidades agora usam `timestamp` compatível com PostgreSQL.

### Erro de Constraint - userId null

```
Error: null value in column "userId" of relation "booking" violates not-null constraint
```

**Solução**: ✅ **Já corrigido!** A autenticação JWT foi corrigida e a interface `AuthenticatedUser` otimizada.

### Erro de Email Duplicado

```
ConflictException: Email já está em uso
```

**Solução**: ✅ **Funcionalidade implementada!** O sistema agora valida emails únicos automaticamente.

## 📞 Suporte

Para problemas ou dúvidas, verifique:

1. Os logs da aplicação
2. Se o banco está conectado corretamente
3. Se todas as dependências foram instaladas
4. Se as variáveis de ambiente estão configuradas

## 🚀 Últimas Atualizações

### v1.1.0 - Refatoração e Melhorias (Julho 2025)

- 🔧 **Refatoração da Interface AuthenticatedUser**: Removida propriedade `userId` redundante, mantendo apenas `id`
- 🛡️ **Validação de Email Único**: Implementada verificação automática de emails duplicados
- 🐛 **Correção de Bugs JWT**: Resolvido problema de autenticação que causava userId null
- 📊 **Cobertura de Testes**: Mantida alta cobertura (88.19%) com 179 testes
- 🔍 **PostgreSQL**: Compatibilidade total com tipos timestamp
- ✨ **Código Limpo**: Interface simplificada e código mais maintível
- 📚 **Swagger Atualizado**: Schemas de API atualizados com a nova estrutura de dados
- 🏷️ **DTOs Aprimorados**: Criados novos DTOs para respostas (AuthenticatedUserDto, LoginResponseDto, UserResponseDto)

### Estrutura de Dados Atualizada

```typescript
// Interface AuthenticatedUser (simplificada)
interface AuthenticatedUser {
  id: number; // ✅ ID único do usuário
  email: string; // ✅ Email do usuário
  role: string; // ✅ Papel (user/admin)
}

// Entidade Booking (PostgreSQL compatível)
@Entity()
export class Booking {
  @Column({ type: 'timestamp' }) // ✅ Compatível com PostgreSQL
  startTime: Date;

  @Column({ type: 'timestamp' }) // ✅ Compatível com PostgreSQL
  endTime: Date;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  duration: number; // ✅ Suporte a 0.5, 1.0, 1.5 horas
}
```
