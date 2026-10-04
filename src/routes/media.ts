import { FastifyInstance } from 'fastify'
import { tmdbService } from '../services/tmdb.service.js'

// ── Helper ────────────────────────────────────────────────────

function wrap(handler: () => Promise<unknown>, errMsg: string) {
  return async (_req: unknown, res: any) => {
    try {
      return await handler()
    } catch (err) {
      return res.status(500).send({ error: errMsg })
    }
  }
}

// ── Routes ────────────────────────────────────────────────────

export async function mediaRoutes(app: FastifyInstance) {
  // ── Filmes ────────────────────────────────────────────────
  app.get('/movies/popular',  wrap(() => tmdbService.getPopularMovies(), 'Erro ao buscar filmes populares.'))
  app.get('/movies/top-rated',wrap(() => tmdbService.getTopRated(),      'Erro ao buscar filmes mais bem avaliados.'))
  app.get('/movies/upcoming', wrap(() => tmdbService.getUpcoming(),      'Erro ao buscar lançamentos.'))
  app.get('/movies/trending', wrap(() => tmdbService.getTrending(),      'Erro ao buscar tendências.'))
  app.get('/movies/by-genre', async (req, reply) => {
    const { with_genres, page } = req.query as {
      with_genres: string
      page?: string
    }

    try {
      const movies = await tmdbService.getMoviesByGenre(
        Number(with_genres),
        Number(page ?? 1),
      )

      console.log('MOVIES BY GENRE:', movies)

      return reply.send(movies)
    } catch {
      return reply.status(500).send({
        error: 'Erro ao buscar filmes por gênero.',
      })
    }
  })
  app.get('/movies/discover', async (req, reply) => {
  const { with_genres, primary_release_year, sort_by, page } = req.query as {
    with_genres?: string
    primary_release_year?: string
    sort_by?: string
    page?: string
  }

  try {
    const movies = await tmdbService.discoverMovies(
      {
        genreId: with_genres ? Number(with_genres) : undefined,
        year: primary_release_year,
        sortBy: sort_by,
      },
      Number(page ?? 1),
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
  const { with_genres, primary_release_year, sort_by, page } = req.query as {
    with_genres?: string
    primary_release_year?: string
    sort_by?: string
    page?: string
  }

  try {
    const series = await tmdbService.discoverSeries(
      {
        genreId: with_genres ? Number(with_genres) : undefined,
        year: primary_release_year,
        sortBy: sort_by,
      },
      Number(page ?? 1),
    )

    return reply.send(series)
  } catch {
    return reply.status(500).send({
      error: 'Erro ao descobrir series.',
    })
  }
})

  app.get('/series/popular',  wrap(() => tmdbService.getPopularSeries(), 'Erro ao buscar séries populares.'))


    // ── Search ─────────────────────────────────────────────────
    app.get('/movies/search', async (req, reply) => {
  const { query, page } = req.query as {
    query?: string
    page?: string
  }

  try {
    const movies = await tmdbService.searchMovies(
      query ?? '',
      Number(page ?? 1),
    )

    return reply.send(movies)
  } catch {
    return reply.status(500).send({
      error: 'Erro ao pesquisar filmes.',
    })
  }
})

app.get('/series/search', async (req, reply) => {
  const { query, page } = req.query as {
    query?: string
    page?: string
  }

  try {
    const series = await tmdbService.searchSeries(
      query ?? '',
      Number(page ?? 1),
    )

    return reply.send(series)
  } catch {
    return reply.status(500).send({
      error: 'Erro ao pesquisar séries.',
    })
  }
})
app.get('/search/multi', async (req, reply) => {
  const { query, page } = req.query as {
    query?: string
    page?: string
  }

  try {
    const results = await tmdbService.searchMulti(
      query ?? '',
      Number(page ?? 1),
    )

    return reply.send(results)
  } catch {
    return reply.status(500).send({
      error: 'Erro ao pesquisar filmes e séries.',
    })
  }
})

app.get('/movies/:id', async (req, reply) => {
  const { id } = req.params as { id: string }

  try {
    const movie = await tmdbService.getMovieDetails(Number(id))

    return reply.send(movie)
  } catch {
    return reply.status(500).send({
      error: 'Erro ao buscar detalhes do filme.',
    })
  }
})

app.get('/movies/:id/similar', async (req, reply) => {
  const { id } = req.params as { id: string }

  try {
    const movies = await tmdbService.getSimilarMovies(Number(id))

    return reply.send(movies)
  } catch {
    return reply.status(500).send({
      error: 'Erro ao buscar filmes similares.',
    })
  }
})

app.get('/series/:id', async (req, reply) => {
  const { id } = req.params as { id: string }

  try {
    const series = await tmdbService.getTVShowDetails(Number(id))

    return reply.send(series)
  } catch {
    return reply.status(500).send({
      error: 'Erro ao buscar detalhes da série.',
    })
  }
})

app.get('/series/:id/similar', async (req, reply) => {
  const { id } = req.params as { id: string }

  try {
    const series = await tmdbService.getSimilarTVShows(Number(id))

    return reply.send(series)
  } catch {
    return reply.status(500).send({
      error: 'Erro ao buscar séries similares.',
    })
  }
})
}



