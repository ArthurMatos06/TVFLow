# TvFlow Frontend --- Auditoria, TODOs, Refatoração e Testes

## Objetivo

O frontend do TvFlow já possui suas principais funcionalidades
implementadas. O objetivo é auditar o projeto, concluir TODOs
aplicáveis, melhorar a organização e criar ou completar testes
automatizados, mantendo a interface e os fluxos atuais funcionando.

Trabalhe no repositório do frontend. Leia o código real antes de tomar
decisões. Não faça uma reescrita completa, não remova funcionalidades e
não substitua integrações reais por mocks na aplicação.

## Regras obrigatórias

1.  Leia `AGENTS.md`, `README.md`, `package.json`, configurações de
    Vite, TypeScript, Tailwind, ESLint e testes, quando existirem.
2.  Examine a estrutura de pastas e os principais fluxos antes de
    editar.
3.  Procure todos os `TODO`, `FIXME`, `HACK`, `XXX`, `WORKAROUND` e
    comentários de pendências em português ou inglês.
4.  Implemente todos os TODOs aplicáveis. Não apague comentários apenas
    para removê-los. Registre bloqueios que dependam de decisão,
    credenciais ou sistemas externos.
5.  Preserve a aparência, acessibilidade, rotas, comportamentos,
    chamadas de API e regras de negócio existentes, salvo correções
    justificadas.
6.  Não exponha segredos nem inclua credenciais reais em código, logs,
    documentação ou testes.
7.  Não faça commit, push, deploy ou alterações em produção sem
    autorização explícita.
8.  Informe apenas verificações realmente executadas.

## Contexto técnico conhecido --- confirme no repositório

O frontend foi descrito como React + TypeScript + Vite, Tailwind CSS,
React Router, Zustand e Axios, com integração ao backend do TvFlow e ao
TMDB. As funcionalidades incluem autenticação, catálogo de filmes e
séries, busca, filtros, perfil, avatar, favoritos e avaliações. Confirme
o que realmente existe no repositório antes de implementar mudanças.

## Fase 1 --- Auditoria

-   Identifique scripts para desenvolvimento, lint, type-check, build e
    testes.
-   Mapeie páginas, rotas, componentes, hooks, stores, serviços HTTP,
    tipos, validações e utilitários.
-   Rastreie os principais fluxos: autenticação, carregamento de sessão,
    catálogo, pesquisa, filtros, perfil, avatar, favoritos e avaliações.
-   Procure código duplicado, componentes excessivamente grandes,
    efeitos colaterais mal gerenciados, dependências não utilizadas,
    `any` evitáveis, problemas de acessibilidade e erros de tratamento
    de requisições.
-   Procure TODOs com uma busca equivalente a:

``` bash
grep -RInE 'TODO|FIXME|HACK|XXX|WORKAROUND' . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=dist \
  --exclude-dir=build
```

Procure também comentários como `// depois implementar`,
`// falta fazer`, `// colocar no service`, `// temporário` e
equivalentes. Não trate comentários de dependências como tarefas do
projeto sem verificar.

Crie um inventário com arquivo, contexto, solução proposta, risco e
estado de cada pendência.

## Fase 2 --- Refatoração da estrutura

Organize o código conforme a arquitetura que já existe e as necessidades
reais. Avalie a separação de:

-   páginas e configuração de rotas;
-   componentes compartilhados e componentes específicos de
    funcionalidades;
-   hooks;
-   clientes HTTP e serviços de API;
-   stores e gerenciamento de estado;
-   tipos e interfaces;
-   schemas e validações;
-   utilitários;
-   estilos e assets;
-   testes.

Regras:

-   Evite abstrações prematuras e excesso de arquivos pequenos sem
    responsabilidade clara.
-   Mantenha componentes reutilizáveis quando isso realmente reduzir
    duplicação.
-   Separe chamadas HTTP da apresentação quando isso melhorar a
    manutenção.
-   Evite colocar lógica complexa de negócio diretamente em componentes
    visuais.
-   Preserve os caminhos e contratos públicos sempre que possível.
-   Atualize imports ao mover arquivos.
-   Não mude o design, os textos, os fluxos ou a navegação sem
    necessidade concreta.
-   Não adicione bibliotecas apenas por preferência pessoal.
-   Não atualize todas as dependências de uma vez.
-   Mantenha mudanças pequenas e fáceis de revisar.

## Fase 3 --- API, estado e erros

Revise a comunicação com o backend e os estados da interface:

-   Confirme que o cliente Axios usa a base URL correta e envia
    credenciais quando necessário.
-   Garanta que a sessão seja hidratada de forma consistente ao carregar
    a aplicação.
-   Verifique estados de carregamento, sucesso, lista vazia e erro.
-   Evite requisições duplicadas ou atualizações de estado após
    desmontagem quando isso for relevante.
-   Garanta que falhas da API não sejam silenciosamente mascaradas por
    dados fictícios.
-   Não use fallback de mocks no fluxo normal de produção quando a
    funcionalidade deve utilizar dados reais.
-   Centralize a lógica HTTP quando houver duplicação clara, mantendo os
    serviços existentes compatíveis.
-   Evite armazenar segredos no frontend. Tudo o que é enviado ao
    navegador deve ser considerado público.
-   Preserve os contratos do backend e trate corretamente respostas de
    erro.
-   Confira que operações otimistas, se existentes, sejam revertidas ou
    reconciliadas quando a requisição falhar.

## Fase 4 --- Implementação dos TODOs

Para cada TODO:

1.  Leia o contexto e rastreie os usos do código.
2.  Entenda o comportamento esperado a partir da aplicação existente.
3.  Implemente a solução na camada correta.
4.  Acrescente ou atualize testes.
5.  Remova ou atualize o comentário somente quando estiver resolvido.
6.  Documente qualquer bloqueio com justificativa.

Não implemente requisitos de produto por suposição. Se uma decisão não
puder ser inferida do projeto, documente a pergunta pendente.

## Fase 5 --- Testes

Reutilize a infraestrutura existente sempre que possível. Se não houver
testes, escolha uma configuração compatível com as versões e ferramentas
do projeto, justificando qualquer nova dependência.

Crie ou complete testes para:

### Componentes e formulários

-   renderização de estados de carregamento, sucesso, erro e lista
    vazia;
-   validação de nome, username e campos obrigatórios;
-   seleção de avatar, formatos aceitos, limite de tamanho e
    pré-visualização;
-   envio de formulários e exibição de erros;
-   navegação após operações bem-sucedidas.

### Autenticação

-   login e logout;
-   hidratação da sessão;
-   usuário autenticado e não autenticado;
-   proteção de rotas;
-   comportamento após falhas da API.

### Catálogo e busca

-   listagem de filmes e séries;
-   pesquisa;
-   filtros e ordenação;
-   paginação ou carregamento incremental, se existir;
-   erros da API e resultados vazios;
-   confirmação de que o fluxo normal não depende de mocks.

### Favoritos e avaliações

-   adicionar e remover favoritos;
-   estado visual do favorito;
-   hidratação dos favoritos ao entrar;
-   limpeza do estado ao sair ou trocar de usuário;
-   envio e apresentação de avaliações;
-   tratamento de falhas e reconciliação do estado.

### Perfil e avatar

-   carregamento e edição dos dados;
-   envio do arquivo como `multipart/form-data`;
-   atualização do avatar após resposta do backend;
-   exibição correta após recarregar a página;
-   erros de upload e atualização.

### Qualidade dos testes

-   Prefira testar o comportamento observável.
-   Inclua casos válidos, inválidos e limites importantes.
-   Não crie testes sem asserções úteis.
-   Evite testes frágeis dependentes de detalhes internos.
-   Use mocks de API somente nos testes e mantenha-os separados do fluxo
    real da aplicação.

## Fase 6 --- Verificações

Execute os comandos disponíveis no projeto para:

1.  testes automatizados;
2.  ESLint;
3.  verificação de tipos TypeScript;
4.  build de produção.

Se existirem testes de integração ou ferramentas de acessibilidade,
execute-os quando apropriado.

Corrija erros introduzidos pelas alterações. Diferencie problemas
preexistentes de problemas novos. Não desative regras nem modifique
scripts para mascarar erros.

## Fase 7 --- Revisão final

-   Revise o diff completo.
-   Confirme que imports e rotas continuam funcionando.
-   Verifique se não foram adicionados `.env`, segredos, logs sensíveis,
    artefatos de build ou arquivos desnecessários.
-   Confirme que todos os TODOs foram resolvidos ou documentados como
    bloqueados/não aplicáveis.
-   Atualize a documentação e os comandos de teste se necessário.
-   Não faça commit, push ou deploy sem autorização.

## Entregáveis finais

Apresente um relatório com:

-   resumo das melhorias;
-   inventário de TODOs e resultado de cada um;
-   arquivos e pastas criados, removidos ou movidos;
-   componentes, hooks e serviços refatorados;
-   testes executados e resultados reais;
-   lint, TypeScript e build, quando disponíveis;
-   verificações não executadas e motivo;
-   riscos e passos manuais restantes.

## Critério de conclusão

Todos os TODOs encontrados devem ter sido avaliados. Os aplicáveis devem
estar implementados e testados; a refatoração deve preservar os fluxos
existentes; e as verificações possíveis devem ter sido executadas.
Pendências bloqueadas devem ser relatadas com transparência.

**Ordem de prioridade:** preservar a experiência e as funcionalidades \>
corrigir bugs comprovados \> concluir TODOs \> adicionar testes úteis \>
refatorar incrementalmente.

Comece pela auditoria e pelo inventário de TODOs. Trabalhe em etapas
pequenas, sem reescrever o projeto inteiro.
