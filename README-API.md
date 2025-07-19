# Back Agenda API

API para agendamento de quadras esportivas desenvolvida com NestJS, PostgreSQL e JWT.

## 🚀 Funcionalidades

- ✅ **Autenticação JWT** com roles (admin/user)
- ✅ **CRUD de Usuários** com senhas criptografadas
- ✅ **Controle de Acesso** baseado em roles
- ✅ **Documentação Swagger**
- ✅ **Validação de dados**
- ✅ **Docker Compose** para PostgreSQL

## 📋 Pré-requisitos

- Node.js 18+
- Docker & Docker Compose
- npm ou yarn

## 🔧 Configuração

### 1. Clone o repositório

```bash
git clone <repository-url>
cd back-agenda
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Edite o arquivo `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=court_booking
JWT_SECRET=your_jwt_secret
```

### 4. Inicie o banco de dados

```bash
docker-compose up -d
```

### 5. Execute a aplicação

```bash
npm run start:dev
```

## 📖 Documentação da API

Acesse a documentação Swagger em: `http://localhost:3000/swagger`

## 🛡️ Endpoints

### Autenticação

- `POST /auth/login` - Login (retorna JWT token)

### Usuários

- `POST /users` - Cadastro de usuário (público)
- `GET /users` - Listar usuários (apenas admin)
- `GET /users/:id` - Buscar usuário (admin ou próprio usuário)
- `PUT /users/:id` - Atualizar usuário (admin ou próprio usuário)
- `DELETE /users/:id` - Deletar usuário (admin ou próprio usuário)

## 🔐 Autenticação

Para acessar rotas protegidas, inclua o token JWT no header:

```
Authorization: Bearer <seu-jwt-token>
```

## 📝 Exemplo de Uso

### 1. Cadastrar usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "password": "123456",
    "role": "user"
  }'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### 3. Acessar rota protegida

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <seu-jwt-token>"
```

## 🗂️ Estrutura do Projeto

```
src/
├── auth/              # Módulo de autenticação
│   ├── guards/        # Guards JWT e Roles
│   ├── strategies/    # Estratégias Passport
│   └── interfaces/    # Interfaces TypeScript
├── entities/          # Entidades TypeORM
├── users/             # Módulo de usuários
│   ├── dto/          # Data Transfer Objects
│   └── ...
└── main.ts           # Arquivo principal
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e
```

## 📦 Scripts Disponíveis

- `npm run start` - Inicia a aplicação
- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run build` - Build da aplicação
- `npm run test` - Executa testes
- `npm run lint` - Executa linter

## 🐳 Docker

O projeto inclui `docker-compose.yml` para PostgreSQL:

```bash
# Iniciar banco
docker-compose up -d

# Parar banco
docker-compose down
```

## 🛠️ Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **class-validator** - Validação de dados
- **Swagger** - Documentação da API
