# TvFlow Backend --- Auditoria, TODOs, Refatoração e Testes

## Objetivo

O backend do TvFlow já possui funcionalidades implementadas. O objetivo
é auditar o código, concluir os TODOs aplicáveis, melhorar a organização
e confiabilidade, e criar ou completar testes automatizados **sem
quebrar os contratos da API nem as regras de negócio existentes**.

Trabalhe no repositório do backend. Antes de alterar arquivos, leia o
projeto e entenda a arquitetura real. Não faça uma reescrita completa
nem implemente funcionalidades inventadas.

## Regras obrigatórias

1.  Leia `AGENTS.md`, `README.md`, `package.json`, configuração
    TypeScript, configuração Prisma e documentação relevante, se
    existirem.
2.  Inspecione a estrutura de pastas e os principais pontos de entrada
    antes de editar.
3.  Procure todos os `TODO`, `FIXME`, `HACK`, `XXX`, `WORKAROUND` e
    comentários de pendências em português ou inglês.
4.  Implemente todos os TODOs aplicáveis. Não remova comentários sem
    resolver a pendência. Se algo depender de uma decisão de produto,
    credenciais ou serviço externo indisponível, documente o bloqueio.
5.  Preserve endpoints, métodos HTTP, formatos de resposta, códigos
    HTTP, nomes de campos, autenticação, autorização e regras de
    negócio, exceto quando houver um bug comprovado que justifique a
    correção.
6.  Nunca revele, registre ou versione credenciais, tokens, senhas,
    chaves privadas ou valores sensíveis de `.env`.
7.  Não faça commit, push, deploy nem alterações em produção sem
    autorização explícita.
8.  Não declare uma verificação aprovada se ela não tiver sido
    executada.

## Contexto técnico conhecido --- confirme no repositório

O backend foi descrito como Fastify + TypeScript + Prisma + PostgreSQL,
com integração ao TMDB. A aplicação tem ou planeja ter autenticação por
cookie/JWT, usuários, perfis, upload de avatar via Cloudinary, favoritos
e avaliações. Use isso apenas como orientação inicial e confirme os
detalhes lendo o código real.

## Fase 1 --- Auditoria

-   Identifique scripts disponíveis para desenvolvimento, lint,
    type-check, build, migrações e testes.
-   Leia o schema Prisma e entenda os modelos, enums, relações, índices
    e restrições únicas.
-   Mapeie plugins, hooks, autenticação/autorização, rotas, services,
    schemas, acesso ao banco e integrações externas.
-   Procure validações inconsistentes, tratamento de erros inadequado,
    duplicação, dependências não utilizadas, tipos `any` evitáveis e
    regras de negócio colocadas na camada errada.
-   Procure TODOs com uma busca equivalente a:

``` bash
grep -RInE 'TODO|FIXME|HACK|XXX|WORKAROUND' . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=dist \
  --exclude-dir=build
```

Examine também comentários como `// depois implementar`,
`// falta fazer`, `// colocar no service`, `// temporário` e
equivalentes. Ignore ocorrências de dependências externas quando não
representarem tarefas do projeto.

Monte um inventário com arquivo, contexto, solução proposta, risco e
estado de cada pendência.

## Fase 2 --- Refatoração da arquitetura

Avalie a estrutura existente e melhore-a incrementalmente, sem impor
camadas desnecessárias. Conforme fizer sentido, mantenha
responsabilidades claras entre:

-   registro e configuração do Fastify;
-   rotas e handlers/controllers;
-   services com regras de negócio;
-   schemas e validação de entradas;
-   autenticação e autorização;
-   acesso ao Prisma/banco;
-   integrações externas, como TMDB e Cloudinary;
-   configuração e variáveis de ambiente;
-   tipos compartilhados e erros;
-   testes.

Regras:

-   Preserve os contratos atuais da API.
-   Valide entradas externas usando os padrões e bibliotecas já adotados
    no projeto.
-   Não confie em `userId` enviado pelo cliente para operações que devem
    usar o usuário autenticado; utilize a identidade autenticada no
    servidor.
-   Garanta autorização por recurso, evitando que um usuário altere ou
    consulte dados privados de outro.
-   Não retorne hashes de senha, tokens internos ou outros campos
    sensíveis.
-   Evite capturar todos os erros e transformá-los indiscriminadamente
    em `500`; use respostas apropriadas e mantenha logs seguros.
-   Não registre cookies, tokens, senhas, chaves ou dados pessoais
    desnecessários.
-   Evite duplicar lógica de negócio entre rotas.
-   Use transações quando uma operação precisar manter consistência
    entre múltiplas escritas.
-   Não altere o schema Prisma ou gere migrações destrutivas sem
    necessidade comprovada. Nunca execute migrações contra produção.
-   Não atualize dependências em massa; justifique alterações de versões
    e valide compatibilidade.
-   Atualize imports e testes após mover arquivos.

## Fase 3 --- Revisão de segurança e confiabilidade

Inspecione, conforme aplicável:

-   autenticação, expiração e validação de JWT/cookies;
-   autorização em todas as rotas privadas;
-   CORS e configuração de credenciais;
-   validação de payloads, query strings, parâmetros e arquivos;
-   limites de tamanho e tipos MIME no upload de avatar;
-   erros de autenticação e respostas sem vazamento de informação;
-   senha: hashing seguro e nunca retornada em respostas;
-   segredos via variáveis de ambiente e validação de configuração;
-   queries e operações Prisma;
-   limites, paginação e parâmetros enviados ao TMDB;
-   conflitos de favoritos/avaliações e restrições únicas;
-   concorrência, idempotência e integridade dos dados quando
    relevantes.

Não afirme que a aplicação está segura apenas porque os testes passam.
Registre limitações e pontos que exigem revisão manual.

## Fase 4 --- Implementação dos TODOs

Para cada pendência:

1.  Leia o código relacionado e rastreie seus usos.
2.  Determine o comportamento esperado com base na arquitetura e nas
    funcionalidades existentes.
3.  Implemente a solução na camada correta.
4.  Acrescente ou atualize testes.
5.  Remova ou atualize o comentário somente quando resolvido.
6.  Documente qualquer bloqueio com motivo concreto.

Não substitua integrações reais por mocks no código de produção. Mocks
são permitidos em testes isolados, quando apropriado.

## Fase 5 --- Testes

Reutilize as ferramentas já instaladas quando possível. Não adicione um
framework de testes sem necessidade justificada.

Crie ou complete testes para:

-   validação de dados e schemas;
-   registro, login, logout e sessão, conforme implementados;
-   rotas protegidas e não autenticadas;
-   permissões e acesso a dados de outros usuários;
-   criação e atualização de perfil;
-   upload de avatar: ausência de arquivo, MIME inválido, tamanho
    excedido e sucesso;
-   favoritos: adicionar, listar, remover e evitar duplicações;
-   avaliações: criação, edição, consulta e restrições únicas;
-   endpoints de filmes/séries, filtros, paginação e erros do TMDB;
-   erros do Prisma e respostas HTTP;
-   casos-limite e entradas inválidas.

### Banco e serviços externos

-   Use banco isolado para testes de integração.
-   Não use nem limpe dados de produção.
-   Não execute migrações destrutivas ou comandos de limpeza em banco
    compartilhado sem autorização explícita.
-   Use mocks/fakes para TMDB e Cloudinary em testes unitários quando
    apropriado.
-   Não inclua segredos reais nos testes nem em fixtures.
-   Se uma integração real exigir credenciais, documente como configurar
    as variáveis sem revelar seus valores.

## Fase 6 --- Verificações

Execute os comandos que existirem no projeto para:

1.  testes automatizados;
2.  lint;
3.  type-check do TypeScript;
4.  build;
5.  validação do schema Prisma;
6.  verificação de migrações, quando possível e seguro.

Corrija problemas introduzidos pelas alterações. Diferencie falhas
preexistentes de falhas novas. Não desative regras ou altere scripts
para mascarar falhas.

## Entregáveis finais

Apresente um relatório com:

-   resumo das alterações;
-   inventário dos TODOs e resultado de cada um;
-   arquivos/pastas criados, removidos ou movidos;
-   endpoints e contratos preservados ou alterados, com justificativa;
-   testes executados e resultados reais;
-   comandos que não puderam ser executados e motivo;
-   riscos, limitações e passos manuais restantes.

## Critério de conclusão

O trabalho termina quando todos os TODOs encontrados tiverem sido
avaliados, os aplicáveis estiverem implementados e testados, as
refatorações preservarem os contratos existentes e as verificações
possíveis tiverem sido executadas. Pendências bloqueadas devem ser
documentadas, nunca escondidas.

**Ordem de prioridade:** preservar o comportamento e os dados \>
corrigir bugs comprovados \> concluir TODOs \> adicionar testes úteis \>
refatorar incrementalmente.

Comece pela auditoria e pelo inventário dos TODOs. Não faça uma grande
reescrita de uma só vez.
