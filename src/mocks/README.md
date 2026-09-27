# Mocks

Dados mockados usados enquanto o backend real (`src/services/api`) não está disponível.

Cada mock deve ficar em um arquivo próprio (ex: `users.mock.ts`, `favorites.mock.ts`) e nunca ser importado diretamente pelos componentes — sempre através da camada de serviço correspondente.
