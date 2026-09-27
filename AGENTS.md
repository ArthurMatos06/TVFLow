# TvFlow — Frontend Development Guide

## 1. Contexto do projeto

TvFlow é uma aplicação web de filmes e séries.

O frontend será responsável exclusivamente pela interface e experiência do usuário.

A aplicação utilizará a API do The Movie Database (TMDB) para obter informações sobre filmes e séries.

O backend será desenvolvido separadamente pelo proprietário do projeto.

### Responsabilidade do agente

Você é responsável por desenvolver o **frontend completo do TvFlow**.

Não implemente backend, banco de dados, autenticação no servidor ou regras de negócio que pertencem ao backend.

Quando alguma funcionalidade depender do backend, crie uma camada de serviço/interface bem definida para que posteriormente os endpoints reais possam ser conectados.

---

# 2. Stack obrigatória

Utilize:

* React
* TypeScript
* Tailwind CSS
* React Router
* Fetch ou Axios para requisições
* Componentização reutilizável
* Design responsivo

Não introduza frameworks ou bibliotecas desnecessárias sem justificar.

Priorize soluções simples e fáceis de manter.

---

# 3. Objetivo do frontend

Criar uma experiência semelhante a uma plataforma moderna de descoberta e avaliação de filmes.

O usuário deve conseguir:

* Criar uma conta
* Fazer login
* Navegar pela página inicial
* Descobrir filmes e séries
* Pesquisar filmes e séries
* Visualizar detalhes de um filme
* Visualizar detalhes de uma série
* Avaliar filmes
* Visualizar avaliações
* Criar e editar seu perfil
* Visualizar seus filmes avaliados
* Favoritar filmes
* Navegar por categorias
* Ver conteúdos populares
* Ver conteúdos mais bem avaliados
* Ver lançamentos
* Navegar facilmente entre as páginas

---

# 4. Páginas obrigatórias

Crie as seguintes páginas:

## Autenticação

### Login

Rota:

`/login`

Deve possuir:

* Logo TvFlow
* Campo de email
* Campo de senha
* Mostrar/ocultar senha
* Botão de login
* Link para cadastro
* Feedback visual de erro
* Estado de loading
* Layout moderno e responsivo

---

### Cadastro

Rota:

`/register`

Campos:

* Nome
* Email
* Senha
* Confirmar senha

Também deve possuir:

* Validação visual
* Estados de loading
* Mensagens de erro
* Link para login

---

# 5. Home

Rota:

`/`

A Home deve ser a principal experiência do usuário.

Criar:

### Hero

Um filme em destaque.

Mostrar:

* Poster/backdrop
* Título
* Descrição
* Ano
* Nota
* Gênero
* Botão "Ver detalhes"
* Botão para favoritar

O hero deve possuir uma aparência cinematográfica.

---

### Seções de conteúdo

Criar carrosséis ou grids para:

* Filmes populares
* Séries populares
* Mais bem avaliados
* Lançamentos
* Tendências
* Filmes de ação
* Comédia
* Terror
* Ficção científica

Cada item deve utilizar um componente reutilizável de card.

---

# 6. Search

Rota:

`/search`

Criar uma experiência completa de pesquisa.

Deve possuir:

* Barra de pesquisa
* Busca por filmes
* Busca por séries
* Resultados em grid
* Filtros
* Ordenação
* Estado vazio
* Estado de loading
* Tratamento de erro
* Paginação ou carregamento progressivo

A busca deve ser visualmente clara e agradável.

---

# 7. Movie Details

Rota:

`/movie/:id`

Criar página detalhada.

Mostrar:

* Backdrop
* Poster
* Título
* Título original
* Sinopse
* Data de lançamento
* Duração
* Gêneros
* Nota
* Número de avaliações
* Direção
* Elenco
* Trailer quando disponível
* Filmes similares
* Botão de favorito
* Sistema de avaliação do usuário

Criar uma seção visualmente destacada para o usuário avaliar o filme.

---

# 8. TV Show Details

Rota:

`/tv/:id`

Mostrar:

* Poster
* Backdrop
* Título
* Sinopse
* Nota
* Gêneros
* Número de temporadas
* Número de episódios
* Elenco
* Temporadas
* Séries similares
* Favoritar
* Avaliação do usuário

---

# 9. Profile

Rota:

`/profile`

Criar uma página de perfil completa.

Mostrar:

* Avatar
* Nome
* Username
* Data de criação
* Estatísticas

Exemplo:

* Filmes avaliados
* Filmes favoritos
* Média das avaliações
* Séries avaliadas

Criar seções:

* Minhas avaliações
* Favoritos
* Filmes assistidos

Adicionar botão:

`Editar perfil`

---

# 10. Edit Profile

Rota:

`/profile/edit`

Permitir:

* Alterar nome
* Alterar username
* Alterar avatar
* Alterar informações do perfil

O frontend deve estar preparado para enviar essas alterações posteriormente para o backend.

---

# 11. Favorites

Rota:

`/favorites`

Mostrar filmes e séries favoritos do usuário.

Criar:

* Grid responsivo
* Cards
* Remover dos favoritos
* Estado vazio
* Loading
* Error state

---

# 12. Rating system

Criar componente reutilizável:

`Rating`

O componente deve permitir:

* Avaliação de 1 a 5 estrelas
* Hover
* Seleção
* Visualização da nota existente
* Estado desabilitado

O componente deve ser reutilizável em qualquer filme ou série.

---

# 13. Componentes reutilizáveis

Criar componentes reutilizáveis para:

* Navbar
* Sidebar, se necessário
* MovieCard
* TvCard
* Rating
* SearchBar
* Hero
* Carousel
* GenreBadge
* Modal
* Button
* Input
* Loading
* Skeleton
* EmptyState
* ErrorState
* Pagination

Evite duplicação de código.

---

# 14. Navegação

A aplicação deve possuir uma navegação consistente.

Navbar deve permitir acesso a:

* Home
* Filmes
* Séries
* Buscar
* Favoritos
* Perfil

Quando o usuário estiver autenticado, mostrar seu avatar/perfil.

Quando não estiver autenticado, mostrar:

* Login
* Criar conta

---

# 15. TMDB

O frontend pode consumir a API do TMDB para dados públicos de filmes e séries.

Crie uma camada específica para isso.

Exemplo:

```text
src/services/tmdb/
```

Não espalhe chamadas diretamente pelos componentes.

Preferir algo semelhante a:

```ts
tmdbService.getPopularMovies()
tmdbService.getTrendingMovies()
tmdbService.searchMovies(query)
tmdbService.getMovie(id)
tmdbService.getSimilarMovies(id)
```

A implementação deve ser organizada e fácil de substituir ou modificar.

---

# 16. Backend

O backend será implementado separadamente.

NÃO criar:

* servidor Express
* servidor Fastify
* banco de dados
* Prisma
* migrations
* controllers backend
* rotas backend
* autenticação server-side
* JWT backend
* lógica de persistência

Porém, o frontend deve estar preparado para consumir uma API posteriormente.

Criar uma camada:

```text
src/services/api/
```

Exemplo:

```ts
authService.login()
authService.register()

userService.getProfile()
userService.updateProfile()

movieService.rateMovie()
movieService.addFavorite()
movieService.removeFavorite()
```

As funções podem inicialmente utilizar mocks ou interfaces bem definidas caso os endpoints ainda não existam.

Não invente endpoints arbitrariamente sem documentá-los.

---

# 17. Estados da interface

Todas as páginas que realizam requisições devem possuir:

### Loading

Utilizar Skeleton ou indicador de carregamento apropriado.

### Error

Mostrar uma mensagem amigável.

### Empty

Mostrar uma interface específica quando não houver resultados.

Nunca deixar a página simplesmente em branco.

---

# 18. Responsividade

O projeto deve funcionar corretamente em:

* Mobile
* Tablet
* Desktop
* Monitores grandes

Prioridade:

1. Mobile
2. Tablet
3. Desktop

Utilizar as classes responsivas do Tailwind.

---

# 19. Design

O TvFlow deve possuir uma identidade visual de plataforma cinematográfica moderna.

Direção visual:

* Dark mode como padrão
* Fundo escuro
* Alto contraste
* Cards modernos
* Imagens grandes
* Gradientes discretos
* Bordas sutis
* Microinterações
* Hover states
* Transições suaves

Evitar:

* Interface genérica
* Excesso de cores
* Gradientes exagerados
* Sombras excessivas
* Elementos visualmente poluídos
* Cards gigantes em telas pequenas

A interface deve transmitir uma sensação de:

**cinema + streaming + comunidade de filmes.**

---

# 20. UX

Priorizar:

* Navegação intuitiva
* Feedback imediato
* Estados de loading
* Estados de erro
* Acessibilidade
* Hierarquia visual
* Boa utilização de espaço
* Performance

Botões devem deixar claro o que acontecerá quando forem clicados.

Inputs devem possuir labels ou identificação acessível.

---

# 21. Arquitetura

Organizar o projeto de forma escalável.

Uma possível estrutura:

```text
src/
├── components/
│   ├── ui/
│   ├── movie/
│   ├── tv/
│   ├── navigation/
│   └── profile/
│
├── pages/
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   ├── Search/
│   ├── MovieDetails/
│   ├── TvDetails/
│   ├── Profile/
│   ├── EditProfile/
│   └── Favorites/
│
├── services/
│   ├── api/
│   └── tmdb/
│
├── hooks/
├── types/
├── layouts/
├── utils/
└── routes/
```

Adapte a estrutura caso exista uma organização melhor para o projeto atual.

Não reorganize o projeto inteiro sem necessidade.

---

# 22. TypeScript

Utilizar TypeScript corretamente.

Evitar:

```ts
any
```

Sempre que possível, criar interfaces/types para:

* Movie
* TVShow
* Genre
* User
* Rating
* Favorite
* SearchResult
* API responses

---

# 23. Dados mockados

Enquanto o backend não estiver pronto, utilizar mocks quando necessário.

Os mocks devem ficar separados da lógica principal.

Exemplo:

```text
src/mocks/
```

Nunca misturar dados mockados diretamente dentro dos componentes.

---

# 24. Regras importantes

Antes de implementar qualquer coisa:

1. Analise a estrutura atual do projeto.
2. Não apague código existente sem necessidade.
3. Não altere configurações importantes sem verificar o impacto.
4. Reutilize componentes existentes.
5. Evite dependências desnecessárias.
6. Mantenha o código simples.
7. Priorize componentes reutilizáveis.
8. Não implemente backend.
9. Não invente funcionalidades fora do escopo.
10. Garanta que o projeto continue compilando após as alterações.

---

# 25. Processo de desenvolvimento

Implemente em etapas.

### Etapa 1

Estrutura base:

* Layout
* Router
* Navbar
* Design system
* Componentes base

### Etapa 2

Autenticação:

* Login
* Register
* Protected routes

### Etapa 3

Home:

* Hero
* Movie cards
* Carousels
* Categorias

### Etapa 4

Busca:

* Search
* Filtros
* Resultados

### Etapa 5

Detalhes:

* Movie details
* TV details
* Rating

### Etapa 6

Usuário:

* Profile
* Edit profile
* Favorites

### Etapa 7

Polimento:

* Responsividade
* Loading states
* Error states
* Empty states
* Animações
* Acessibilidade
* Performance

---

# 26. Regra principal

O resultado final deve parecer uma **aplicação real pronta para produção**, e não apenas um projeto acadêmico.

Priorize qualidade visual, arquitetura limpa, componentes reutilizáveis e boa experiência do usuário.

Sempre que existir uma decisão de implementação, prefira a solução:

**simples → reutilizável → escalável → fácil de conectar ao backend.**

