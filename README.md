# TVFlow

Plataforma web de descoberta e avaliação de filmes e séries, com interface estilo cinema + streaming + comunidade.

A aplicação usa a API do **TMDB (The Movie Database)** para dados de filmes e séries, um **backend** próprio (Fastify + Prisma) para autenticação, perfil, favoritos e avaliações, e um **frontend** em React.

## Estrutura do projeto

```
TVFlow/
├── frontend/    # Interface (React + TypeScript + Vite + Tailwind CSS)
├── backend/     # API (Fastify + TypeScript + Prisma + PostgreSQL)
└── package.json # Scripts que orquestram front e back juntos
```

## Pré-requisitos

- **Node.js** (18+; versões mais recentes recomendadas)
- **npm**
- **PostgreSQL** rodando localmente ou um serviço Postgres (ex.: Neon, Supabase, Railway)

## Configuração

### 1. Instalar dependências

Execute na raiz do projeto:

```bash
npm install
```

Isso instala as dependências da raiz, do `frontend/` e do `backend/`.

### 2. Configurar o backend (variáveis de ambiente)

Crie o arquivo de ambiente do backend a partir das variáveis exigidas pelo código:

```bash
cp backend/.env.example backend/.env   # se existir exemplo
```

Caso não exista `.env.example`, crie `backend/.env` manualmente com:

```bash
DATABASE_URL=postgresql://USUARIO:SENHA@localhost:5432/tvflow
JWT_SECRET=uma_chave_aleatoria_de_pelo_menos_32_caracteres
TMDB_TOKEN=seu_token_de_acesso_do_tmdb
PORT=3000
NODE_ENV=development
```

Explicação de cada variável:

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `DATABASE_URL` | Sim | Connection string do PostgreSQL (formato `postgresql://user:pass@host:port/db`) |
| `JWT_SECRET` | Sim | Segredo para assinar os tokens JWT (mínimo de 32 caracteres) |
| `TMDB_TOKEN` | Sim | Token de acesso à API do TMDB (`api.themoviedb.org`) |
| `PORT` | Não | Porta do backend (padrão **3000**) |
| `NODE_ENV` | Não | Ambiente (`development`/`production`/`test`; padrão `development`) |

> **TMDB:** crie uma conta em themoviedb.org e gere um token em *Settings → API*. O token é usado no header `Authorization: Bearer`.

### 3. Configurar o banco de dados e o schema Prisma

Na pasta `backend/`:

```bash
cd backend
npm run db:generate   # gera o client Prisma (geralmente automático no install)
npm run db:migrate    # aplica as migrations existentes no banco
```

Alternativa sem migrations: `npm run db:push`.

### 4. Configurar o frontend (variáveis de ambiente, opcional)

Crie `frontend/.env` apenas se quiser apontar para uma API em outro endereço:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

Sem o arquivo, o frontend usa por padrão `http://localhost:3000/api`.

## Como rodar

### Rodar tudo (frontend + backend)

Na raiz do projeto:

```bash
npm run dev
```

Inicia os dois processos simultaneamente (via `concurrently`):

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000 (health check em `http://localhost:3000/health`)

### Rodar apenas um dos lados

```bash
npm run dev:frontend   # apenas o frontend
npm run dev:backend    # apenas o backend
```

## Outros comandos úteis

### Frontend (`cd frontend`)

```bash
npm run dev              # servidor de desenvolvimento
npm run build            # build de produção (tsc + vite build)
npm run preview          # preview do build
npm run lint             # lint com oxlint
npm run test             # testes com vitest
```

### Backend (`cd backend`)

```bash
npm run dev              # servidor de desenvolvimento (tsx watch)
npm run build            # compila TypeScript para dist/
npm run start            # roda o build compilado
npm run db:generate      # gera o client Prisma
npm run db:migrate       # aplica migrations
npm run db:push          # sincroniza o schema sem migrations
npm run db:studio        # abre o Prisma Studio
npm run test             # testes automatizados
```

## Stack

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, Zustand, TanStack Query, Axios |
| Backend | Fastify 5, TypeScript, Prisma 7, PostgreSQL, JWT, Cloudinary (upload de avatar) |
| Dados de mídia | API do TMDB |
