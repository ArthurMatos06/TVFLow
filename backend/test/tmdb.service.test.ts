import { test, before, after } from "node:test";
import assert from "node:assert/strict";

// Configura variáveis de ambiente mínimas (placeholders de teste, sem segredos)
// antes de importar o módulo, pois env.ts valida na inicialização.
process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
process.env.JWT_SECRET = "this-is-a-32-char-jwt-secret-for-tests!!";
process.env.TMDB_TOKEN = "test-token";
process.env.NODE_ENV = "test";

type TmdbModule =
  typeof import("../src/services/tmdb.service.js");

let tmdbService: TmdbModule["tmdbService"];

const originalFetch = globalThis.fetch;

function mockFetchOk(json: unknown) {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify(json), {
      status: 200,
      headers: { "content-type": "application/json" },
    })) as unknown as typeof fetch;
}

function mockFetchError(status = 500, statusText = "Server Error") {
  globalThis.fetch = (async () =>
    new Response(null, { status, statusText })) as unknown as typeof fetch;
}

before(async () => {
  const mod: TmdbModule = await import("../src/services/tmdb.service.js");
  tmdbService = mod.tmdbService;
});

after(() => {
  globalThis.fetch = originalFetch;
});

test("getPopularMovies retorna os dados do TMDB", async () => {
  const corpo = { results: [{ id: 1, title: "Filme" }] };
  mockFetchOk(corpo);

  const data = await tmdbService.getPopularMovies();
  assert.deepEqual(data, corpo);
});

test("getMovieDetails concatena append_to_response", async () => {
  const corpo = { id: 550, titles: [] };
  mockFetchOk(corpo);

  const data = await tmdbService.getMovieDetails(550);
  assert.deepEqual(data, corpo);
});

test("tmdb lanca erro descritivo quando a API falha", async () => {
  mockFetchError(404, "Not Found");

  await assert.rejects(() => tmdbService.getPopularMovies(), /404/);
});

test("searchMovies valida a query e pagina", async () => {
  const corpo = { results: [] };
  mockFetchOk(corpo);

  const data = await tmdbService.searchMovies("matrix", 2);
  assert.deepEqual(data, corpo);
});
