# Relatório de Auditoria e Execução — backendTV-Flow

Executado conforme o guia `README_TvFlow_Backend.md`.

## 1. Pendencias encontradas e resolvidas

| # | Arquivo | Pendência | Ação |
|---|---------|-----------|------|
| 1 | `src/services/cloudinary.service.ts` | `// TODO: APAGAR` — arquivo redundante, duplicava a configuração do Cloudinary (`src/lib/cloudinary.ts`) e não era importado em lugar nenhum | **Removido** |
| 2 | `src/routes/ratings.routes.ts` | `// TODO: colocar schemas` — body sem validação Zod | **Adicionada validação Zod** (`mediaId`, `mediaType`, `score`) |
| 3 | `src/routes/ratings.routes.ts` | `// TODO: listando por usuario` — já satisfeito (endpoint filtra por `req.user.sub`) | **Comentário removido** |
| 4 | `src/services/ratings.service.ts` | `// talvez nem precisa desse get` — `get()` e `isRatings()` nunca usados | **Código morto removido** |
| 5 | `src/routes/favorite.routes.ts` | `favoriteBody` comentado, sem validação; `console.log(favorites); //teste` | **Validação Zod adicionada; log de teste removido** |
| 6 | `package.json` | `"prisma": { "schema": "src/prisma/contract.prisma" }` aponta para arquivo **inexistente**, quebrando scripts `db:*` | **Removido** (schema gerenciado por `prisma7.config.ts` → `prisma/schema.prisma`) |
| 7 | `src/middlewares/auth.ts` | `requireAuth` nunca usado, com comportamento inconsistente (`onlyCookie: true`) vs `app.authenticate` | **Removido** |

## 2. Segurança corrigida

| Arquivo | Vulnerabilidade | Correção |
|---------|-----------------|----------|
| `src/services/auth.service.ts` | `getUserById` retornava o usuário **sem select**, vazando o hash da senha em `GET /me` | Aplicado `select: safeUserSelect` (incluindo `username`) |
| `src/services/auth.service.ts` | `login` selecionava todos os campos e dependia de "lembrar" de remover a senha | Agora seleciona apenas `safeUserSelect + password` (para comparar) e remove a senha antes de retornar |
| `src/types/fastify-jwt.d.ts` | Declaração de payload JWT inconsistente (`id` vs `sub`) e duplicada inline em `routes/auth.ts` | Unificado em `{ sub: string }` em um único módulo |
| `src/services/tmdb.service.ts` | Múltiplos `console.log("URL TMDB:")` expondo ruído/URLs em produção | Removidos os logs de debug |

## 3. Validação de entradas (Zod)

Centralizados em `src/schemas.ts` e consumidos pelas rotas `media`, `favorites` e `ratings`:

- `mediaId`/`id` numéricos positivos inteiros (rejeitam `NaN`, negativos e não numéricos).
- `mediaType` restrito a `MOVIE`/`TV`.
- `score` inteiro entre 1 e 10.
- `page` converte string→número, com `default('1')`.
- `primary_release_year` com 4 dígitos; `query` obrigatória na busca.

## 4. Logs

- Substituídos `console.error` dos handlers por `req.log.error` (preserva request id; padrão recomendado pelo Fastify).

## 5. Testes

Criados com o runner nativo do Node (`node:test`) via `tsx` — **sem adicionar framework** de testes (conforme orientação de reutilizar o que já existe).

- `test/schemas.test.ts` — validação de favoritos, ratings e media.
- `test/tmdb.service.test.ts` — chamadas ao TMDB com `fetch` mockado.

Comando: `npm test` → **16 testes, 16 passando**.

Testes de integração com o banco/Cloudinary **não** foram criados: exigiram credenciais reais e/ou um banco isolado (o `.env` aponta para um Postgres da Neon de produção), o que o README proíbe usar para testes.

## 6. Verificações finais (Fase 6)

| Verificação | Comando | Resultado |
|-------------|---------|-----------|
| Type-check | `npx tsc --noEmit` | ✅ 0 erros |
| Build | `npm run build` | ✅ |
| Schema Prisma | `npx prisma validate` | ✅ válido |
| Migrações | `npx prisma migrate status` | ✅ schema up to date |
| Testes | `npm test` | ✅ 16/16 |
| TODOs remanescentes | `grep -RIn 'TODO\|FIXME…'` | ✅ nenhum |

## 7. Remanescente / fora do escopo

- Status 500 para "e-mail já cadastrado" no register (idealmente 409): **preservado** para não quebrar contrato.
- Testes de integração (banco/Cloudinary): pendentes até haver ambiente isolado e credenciais de teste.
- Não foi aplicada migração nem dado `db push` (proibido contra produção).
