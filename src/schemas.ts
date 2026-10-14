import { z } from "zod";

// ── Enums ─────────────────────────────────────────────────────

export const mediaTypeSchema = z.enum(["MOVIE", "TV"]);

// ── Favoritos ─────────────────────────────────────────────────

export const favoriteBodySchema = z.object({
  mediaId: z
    .number({ invalid_type_error: "mediaId é obrigatório." })
    .int("mediaId deve ser um inteiro.")
    .positive("mediaId deve ser um número positivo."),
  mediaType: mediaTypeSchema,
});

export const mediaIdParamSchema = z.object({
  mediaId: z
    .string()
    .regex(/^\d+$/, "mediaId deve ser um número válido.")
    .transform((v) => Number(v)),
});

// ── Avaliações ────────────────────────────────────────────────

export const ratingBodySchema = z.object({
  mediaId: z
    .number({ invalid_type_error: "mediaId é obrigatório." })
    .int("mediaId deve ser um inteiro.")
    .positive("mediaId deve ser um número positivo."),
  mediaType: mediaTypeSchema,
  score: z
    .number({ invalid_type_error: "score é obrigatório." })
    .int("score deve ser um inteiro.")
    .min(1, "score deve estar entre 1 e 10.")
    .max(10, "score deve estar entre 1 e 10."),
});
    
export const ratingQuerySchema = z.object({
  mediaType: mediaTypeSchema.optional(),
});

// ── Mídia (TMDB) ──────────────────────────────────────────────

export const pageQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "page deve ser um inteiro válido.")
    .optional()
    .default("1")
    .transform((v) => Number(v)),
});

export const genreQuerySchema = z.object({
  with_genres: z
    .string()
    .regex(/^\d+$/, "with_genres deve ser um inteiro válido.")
    .transform((v) => Number(v)),
  page: pageQuerySchema.shape.page,
});

export const discoverQuerySchema = z.object({
  with_genres: z
    .string()
    .regex(/^\d+$/, "with_genres deve ser um inteiro válido.")
    .optional()
    .transform((v) => (v ? Number(v) : undefined)),
  primary_release_year: z
    .string()
    .regex(/^\d{4}$/, "Ano deve ter 4 dígitos.")
    .optional(),
  sort_by: z.string().optional(),
  page: pageQuerySchema.shape.page,
});

export const searchQuerySchema = z.object({
  query: z.string().min(1, "Informe um termo para pesquisar."),
  page: pageQuerySchema.shape.page,
});

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "id deve ser um inteiro válido.")
    .transform((v) => Number(v)),
});
