# 🏟️ Sistema de Agendamento de Quadras - Setup

## 📋 Pré-requisitos

1. **Node.js** (versão 22.17.1 ou superior)
2. **Docker** e **Docker Compose**
3. **npm** ou **yarn**

**Nota**: O PostgreSQL não precisa ser instalado localmente, pois será executado via Docker.

## 🚀 Configuração do Banco de Dados

### 1. Iniciar PostgreSQL com Docker Compose

O projeto inclui um arquivo `docker-compose.yml` configurado para executar o PostgreSQL automaticamente:

```bash
# Iniciar o banco de dados PostgreSQL em segundo plano
docker-compose up -d
```

Isso irá:

- Baixar a imagem PostgreSQL 16 (se necessário)
- Criar o container `court_booking_db`
- Criar automaticamente o banco `court_booking`
- Configurar usuário e senha conforme definido no docker-compose.yml
- Expor o banco na porta 5432

### 2. Verificar se o Banco está Rodando

```bash
# Verificar status dos containers
docker-compose ps

# Ver logs do banco (opcional)
docker-compose logs postgres
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env` e ajuste as configurações para se conectar ao PostgreSQL do Docker:

```bash
cp .env .env.local
```

Edite o arquivo `.env` com as configurações do Docker Compose:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=court_booking
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

**Nota**: As credenciais devem corresponder às definidas no `docker-compose.yml`.

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
- ✅ **Cobertura de testes**: 88.91% com 186 testes (24 suites)

## 🚀 Como Começar

### Quick Start

```bash
# 1. Clonar o repositório
git clone <repository-url>
cd back-agenda

# 2. Instalar dependências
npm install

# 3. Iniciar banco PostgreSQL com Docker
docker-compose up -d

# 4. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as configurações do docker-compose.yml

# 5. Executar a aplicação
npm run start:dev

# 6. Acessar documentação
# http://localhost:3000/swagger
```

### Dados de Teste

Para facilitar os testes, você pode criar usuários iniciais:

```bash
# POST /auth/register
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "123456",
  "phone": "11999999999",
  "role": "admin"
}

# POST /auth/register
{
  "name": "Regular User",
  "email": "user@test.com",
  "password": "123456",
  "phone": "11888888888",
  "role": "user"
}
```

## 🛠️ Troubleshooting

### Erro de Conexão com o Banco

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solução**: Verifique se o PostgreSQL está rodando via Docker:

```bash
# Verificar status do container
docker-compose ps

# Reiniciar o banco se necessário
docker-compose restart postgres

# Ou parar e iniciar novamente
docker-compose down
docker-compose up -d
```

### Erro de Autenticação

```
Error: password authentication failed for user "your_username"
```

**Solução**: Verifique se as credenciais no arquivo `.env` correspondem às definidas no `docker-compose.yml`.

### Container PostgreSQL não Inicia

```bash
# Ver logs detalhados do container
docker-compose logs postgres

# Remover volumes e recriar (CUIDADO: apaga dados)
docker-compose down -v
docker-compose up -d
```

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
- 🛡️ **Validação de Email Único**: Implementada verificação automática de emails duplicados com ConflictException
- 🐛 **Correção de Bugs JWT**: Resolvido problema de autenticação que causava userId null
- 📊 **Cobertura de Testes**: Aumentada para 88.91% com 186 testes em 24 suites
- 🔍 **PostgreSQL**: Compatibilidade total com tipos timestamp e decimal
- ✨ **Código Limpo**: Interface simplificada e código mais maintível
- 📚 **Swagger Atualizado**: Schemas de API atualizados com a nova estrutura de dados
- 🏷️ **DTOs Aprimorados**: Criados novos DTOs para respostas (AuthenticatedUserDto, LoginResponseDto, UserResponseDto)
- 🧪 **Testes Completos**: Adicionado teste para user-response.dto.spec.ts
- 🔧 **ESLint**: Corrigidos todos os warnings de unsafe types e variáveis não utilizadas
- 🐳 **Docker Compose**: Configuração simplificada do PostgreSQL via container

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

## 🏗️ Arquitetura do Projeto

### Stack Tecnológica

- **Backend**: NestJS com TypeScript
- **Banco de Dados**: PostgreSQL (via Docker Compose)
- **ORM**: TypeORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest (unitários e integração)
- **Validação**: class-validator e class-transformer
- **Containerização**: Docker e Docker Compose

### Estrutura de Diretórios

```
src/
├── auth/                    # Módulo de autenticação
│   ├── dto/                # DTOs para autenticação
│   ├── interfaces/         # Interfaces TypeScript
│   ├── auth.controller.ts  # Controller de auth
│   ├── auth.service.ts     # Lógica de autenticação
│   ├── jwt.strategy.ts     # Estratégia JWT
│   └── roles.guard.ts      # Guard de autorização
├── users/                  # Módulo de usuários
│   ├── dto/               # DTOs de usuários
│   ├── users.controller.ts # Controller de usuários
│   └── users.service.ts   # Lógica de usuários
├── courts/                # Módulo de quadras
├── bookings/              # Módulo de agendamentos
├── entities/              # Entidades TypeORM
│   ├── user.entity.ts
│   ├── court.entity.ts
│   └── booking.entity.ts
└── main.ts               # Ponto de entrada da aplicação
```

### Fluxo de Autenticação

1. **Registro**: `POST /auth/register` - Cria novo usuário com senha hasheada
2. **Login**: `POST /auth/login` - Valida credenciais e retorna JWT
3. **Proteção**: Rotas protegidas validam JWT via `JwtAuthGuard`
4. **Autorização**: `RolesGuard` controla acesso baseado em roles

### Regras de Negócio

- **Usuários**: Email único, senhas hasheadas com bcryptjs
- **Quadras**: Múltiplas quadras disponíveis para agendamento
- **Agendamentos**:
  - Duração flexível (0.5h, 1h, 1.5h, etc.)
  - Detecção automática de conflitos de horário
  - Status: pending, confirmed, cancelled
  - Usuários só podem editar seus próprios agendamentos
  - Admins podem gerenciar todos os agendamentos
