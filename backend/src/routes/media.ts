import type { FastifyInstance, FastifyReply } from 'fastify'
import { tmdbService } from '../services/tmdb.service.js'
import {
  genreQuerySchema,
  discoverQuerySchema,
  searchQuerySchema,
  idParamSchema,
} from '../schemas.js'

// ── Helper ────────────────────────────────────────────────────

function wrap(handler: () => Promise<unknown>, errMsg: string) {
  return async (_req: unknown, res: FastifyReply) => {
    try {
      return await handler()
    } catch {
      return res.status(500).send({ error: errMsg })
    }
  }
}

// ── Routes ────────────────────────────────────────────────────

export async function mediaRoutes(app: FastifyInstance) {
  // ── Filmes ────────────────────────────────────────────────
  app.get('/movies/popular', wrap(() => tmdbService.getPopularMovies(), 'Erro ao buscar filmes populares.'))
  app.get('/movies/top-rated', wrap(() => tmdbService.getTopRated(), 'Erro ao buscar filmes mais bem avaliados.'))
  app.get('/movies/upcoming', wrap(() => tmdbService.getUpcoming(), 'Erro ao buscar lançamentos.'))
  app.get('/movies/trending', wrap(() => tmdbService.getTrending(), 'Erro ao buscar tendências.'))

  app.get('/movies/by-genre', async (req, reply) => {
    const parsed = genreQuerySchema.safeParse(req.query)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Parâmetros inválidos.',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    try {
      const movies = await tmdbService.getMoviesByGenre(
        parsed.data.with_genres,
        parsed.data.page,
      )

      return reply.send(movies)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao buscar filmes por gênero.',
      })
    }
  })

  app.get('/movies/discover', async (req, reply) => {
    const parsed = discoverQuerySchema.safeParse(req.query)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Parâmetros inválidos.',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    const { with_genres, primary_release_year, sort_by, page } = parsed.data

    try {
      const movies = await tmdbService.discoverMovies(
        {
          genreId: with_genres,
          year: primary_release_year,
          sortBy: sort_by,
        },
        page,
      )

      return reply.send(movies)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao descobrir filmes.',
      })
    }
  })

  // ── Séries ────────────────────────────────────────────────
  app.get('/series/discover', async (req, reply) => {
    const parsed = discoverQuerySchema.safeParse(req.query)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Parâmetros inválidos.',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    const { with_genres, primary_release_year, sort_by, page } = parsed.data

    try {
      const series = await tmdbService.discoverSeries(
        {
          genreId: with_genres,
          year: primary_release_year,
          sortBy: sort_by,
        },
        page,
      )

      return reply.send(series)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao descobrir séries.',
      })
    }
  })

  app.get('/series/popular', wrap(() => tmdbService.getPopularSeries(), 'Erro ao buscar séries populares.'))

  // ── Search ─────────────────────────────────────────────────
  app.get('/movies/search', async (req, reply) => {
    const parsed = searchQuerySchema.safeParse(req.query)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Parâmetros inválidos.',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    try {
      const movies = await tmdbService.searchMovies(
        parsed.data.query,
        parsed.data.page,
      )

      return reply.send(movies)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao pesquisar filmes.',
      })
    }
  })

  app.get('/series/search', async (req, reply) => {
    const parsed = searchQuerySchema.safeParse(req.query)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Parâmetros inválidos.',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    try {
      const series = await tmdbService.searchSeries(
        parsed.data.query,
        parsed.data.page,
      )

      return reply.send(series)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao pesquisar séries.',
      })
    }
  })

  app.get('/search/multi', async (req, reply) => {
    const parsed = searchQuerySchema.safeParse(req.query)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Parâmetros inválidos.',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    try {
      const results = await tmdbService.searchMulti(
        parsed.data.query,
        parsed.data.page,
      )

      return reply.send(results)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao pesquisar filmes e séries.',
      })
    }
  })

  app.get('/movies/:id', async (req, reply) => {
    const parsed = idParamSchema.safeParse(req.params)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'id inválido.',
      })
    }

    try {
      const movie = await tmdbService.getMovieDetails(parsed.data.id)

      return reply.send(movie)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao buscar detalhes do filme.',
      })
    }
  })

  app.get('/movies/:id/similar', async (req, reply) => {
    const parsed = idParamSchema.safeParse(req.params)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'id inválido.',
      })
    }

    try {
      const movies = await tmdbService.getSimilarMovies(parsed.data.id)

      return reply.send(movies)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao buscar filmes similares.',
      })
    }
  })

  app.get('/series/:id', async (req, reply) => {
    const parsed = idParamSchema.safeParse(req.params)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'id inválido.',
      })
    }

    try {
      const series = await tmdbService.getTVShowDetails(parsed.data.id)

      return reply.send(series)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao buscar detalhes da série.',
      })
    }
  })

  app.get('/series/:id/similar', async (req, reply) => {
    const parsed = idParamSchema.safeParse(req.params)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'id inválido.',
      })
    }

    try {
      const series = await tmdbService.getSimilarTVShows(parsed.data.id)

      return reply.send(series)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao buscar séries similares.',
      })
    }
  })
}
