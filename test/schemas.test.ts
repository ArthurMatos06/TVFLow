import { test } from "node:test";
import assert from "node:assert/strict";
import {
  favoriteBodySchema,
  mediaIdParamSchema,
  ratingBodySchema,
  ratingQuerySchema,
  genreQuerySchema,
  discoverQuerySchema,
  searchQuerySchema,
  idParamSchema,
} from "../src/schemas.js";

test("favoriteBodySchema aceita payload válido", () => {
  const parsed = favoriteBodySchema.safeParse({
    mediaId: 42,
    mediaType: "MOVIE",
  });
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.mediaId, 42);
    assert.equal(parsed.data.mediaType, "MOVIE");
  }
});

test("favoriteBodySchema rejeita mediaType inválido", () => {
  const parsed = favoriteBodySchema.safeParse({ mediaId: 1, mediaType: "movie" });
  assert.equal(parsed.success, false);
});

test("favoriteBodySchema rejeita mediaId ausente ou inválido", () => {
  assert.equal(favoriteBodySchema.safeParse({ mediaType: "TV" }).success, false);
  assert.equal(
    favoriteBodySchema.safeParse({ mediaId: -5, mediaType: "TV" }).success,
    false,
  );
  assert.equal(
    favoriteBodySchema.safeParse({ mediaId: 1.5, mediaType: "TV" }).success,
    false,
  );
});

test("mediaIdParamSchema valida e converte o param", () => {
  const parsed = mediaIdParamSchema.safeParse({ mediaId: "123" });
  assert.equal(parsed.success, true);
  if (parsed.success) assert.equal(parsed.data.mediaId, 123);
  assert.equal(
    mediaIdParamSchema.safeParse({ mediaId: "abc" }).success,
    false,
  );
});

test("ratingBodySchema aceita score válido", () => {
  const parsed = ratingBodySchema.safeParse({
    mediaId: 7,
    mediaType: "TV",
    score: 9,
  });
  assert.equal(parsed.success, true);
});

test("ratingBodySchema rejeita score fora do intervalo", () => {
  assert.equal(
    ratingBodySchema.safeParse({ mediaId: 1, mediaType: "TV", score: 0 }).success,
    false,
  );
  assert.equal(
    ratingBodySchema.safeParse({ mediaId: 1, mediaType: "TV", score: 11 }).success,
    false,
  );
});

test("ratingQuerySchema aceita query vazia ou com mediaType", () => {
  assert.equal(ratingQuerySchema.safeParse({}).success, true);
  assert.equal(ratingQuerySchema.safeParse({ mediaType: "MOVIE" }).success, true);
  assert.equal(ratingQuerySchema.safeParse({ mediaType: "weird" }).success, false);
});

test("genreQuerySchema exige with_genres numérico e converte page", () => {
  const parsed = genreQuerySchema.safeParse({ with_genres: "28" });
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.with_genres, 28);
    assert.equal(parsed.data.page, 1);
  }
  assert.equal(genreQuerySchema.safeParse({ with_genres: "x" }).success, false);
  assert.equal(
    genreQuerySchema.safeParse({ with_genres: "28", page: "nao-numero" }).success,
    false,
  );
});

test("discoverQuerySchema aceita filtros opcionais", () => {
  const parsed = discoverQuerySchema.safeParse({
    with_genres: "27",
    primary_release_year: "2023",
    sort_by: "popularity.desc",
  });
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.with_genres, 27);
    assert.equal(parsed.data.primary_release_year, "2023");
    assert.equal(parsed.data.sort_by, "popularity.desc");
  }
});

test("discoverQuerySchema rejeita ano malformado", () => {
  assert.equal(
    discoverQuerySchema.safeParse({ primary_release_year: "23" }).success,
    false,
  );
});

test("searchQuerySchema exige termo de busca", () => {
  assert.equal(searchQuerySchema.safeParse({ query: "" }).success, false);
  assert.equal(searchQuerySchema.safeParse({ query: "matrix" }).success, true);
});

test("idParamSchema valida id numérico", () => {
  const parsed = idParamSchema.safeParse({ id: "550" });
  assert.equal(parsed.success, true);
  if (parsed.success) assert.equal(parsed.data.id, 550);
  assert.equal(idParamSchema.safeParse({ id: "5o0" }).success, false);
});
