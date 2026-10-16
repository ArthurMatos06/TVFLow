import { env } from "../env.js";

// ── Config ────────────────────────────────────────────────────

const BASE_URL = "https://api.themoviedb.org/3";

const GENRE = {
  ACTION: 28,
  COMEDY: 35,
  HORROR: 27,
  SCI_FI: 878,
} as const;

function buildOptions(): RequestInit {
  return {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${env.TMDB_TOKEN}`,
    },
  };
}

type DiscoverFilters = {
  genreId?: number;
  year?: string;
  sortBy?: string;
};

// ── Fetch helper ──────────────────────────────────────────────

async function tmdbFetch(url: string): Promise<unknown> {
  const response = await fetch(url, buildOptions());

  if (!response.ok) {
    throw new Error(`TMDB error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ── Service ───────────────────────────────────────────────────

export const tmdbService = {
  getPopularMovies: () =>
    tmdbFetch(`${BASE_URL}/movie/popular?language=pt-BR&page=1`),
  getPopularSeries: () =>
    tmdbFetch(`${BASE_URL}/tv/popular?language=pt-BR&page=1`),
  getTopRated: () =>
    tmdbFetch(`${BASE_URL}/movie/top_rated?language=pt-BR&page=1`),
  getUpcoming: () =>
    tmdbFetch(`${BASE_URL}/movie/upcoming?language=pt-BR&page=1`),
  getTrending: () =>
    tmdbFetch(`${BASE_URL}/trending/movie/week?language=pt-BR`),
  getMoviesByGenre: (genreId: number, page = 1) =>
    tmdbFetch(
      `${BASE_URL}/discover/movie?language=pt-BR&with_genres=${genreId}&page=${page}`,
    ),
  discoverMovies: (
    { genreId, year, sortBy }: DiscoverFilters = {},
    page = 1,
  ) => {
    const params = new URLSearchParams({
      language: "pt-BR",
      page: String(page),
    });

    if (genreId) {
      params.set("with_genres", String(genreId));
    }

    if (year) {
      params.set("primary_release_year", String(year));
    }

    if (sortBy) {
      params.set("sort_by", sortBy);
    }

    return tmdbFetch(`${BASE_URL}/discover/movie?${params}`);
  },
  discoverSeries: (
    { genreId, year, sortBy }: DiscoverFilters = {},
    page = 1,
  ) => {
    const params = new URLSearchParams({
      language: "pt-BR",
      page: String(page),
    });

    if (genreId) {
      params.set("with_genres", String(genreId));
    }

    if (year) {
      params.set("first_air_date_year", String(year));
    }

    if (sortBy) {
      params.set("sort_by", sortBy);
    }

    return tmdbFetch(`${BASE_URL}/discover/tv?${params}`);
  },

  async searchMovies(query: string, page = 1) {
    const params = new URLSearchParams({
      language: "pt-BR",
      query,
      page: String(page),
    });

    return tmdbFetch(`${BASE_URL}/search/movie?${params}`);
  },
  async searchSeries(query: string, page = 1) {
    const params = new URLSearchParams({
      language: "pt-BR",
      query,
      page: String(page),
    });

    return tmdbFetch(`${BASE_URL}/search/tv?${params}`);
  },
  async searchMulti(query: string, page = 1) {
    const params = new URLSearchParams({
      language: "pt-BR",
      query,
      page: String(page),
    });

    return tmdbFetch(`${BASE_URL}/search/multi?${params}`);
  },


  async getMovieDetails(id: number) {
  const params = new URLSearchParams({
    language: 'pt-BR',
    append_to_response: 'credits,videos',
  })

  return tmdbFetch(
    `${BASE_URL}/movie/${id}?${params}`,
  )
},

async getSimilarMovies(id: number) {
  const params = new URLSearchParams({
    language: 'pt-BR',
  })

  const data = await tmdbFetch(
    `${BASE_URL}/movie/${id}/similar?${params}`,
  ) as { results: unknown[] }

  return data.results
},

async getTVShowDetails(id: number) {
  const params = new URLSearchParams({
    language: 'pt-BR',
    append_to_response: 'credits,videos',
  })

  return tmdbFetch(
    `${BASE_URL}/tv/${id}?${params}`,
  )
},

async getSimilarTVShows(id: number) {
  const params = new URLSearchParams({
    language: 'pt-BR',
  })

  const data = await tmdbFetch(
    `${BASE_URL}/tv/${id}/similar?${params}`,
  ) as { results: unknown[] }

  return data.results
}
};
