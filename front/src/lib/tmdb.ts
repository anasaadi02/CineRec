const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export interface TMDBMovie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export const tmdbImageUrl = (path: string, size: 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getPopularMovies = async (page: number = 1): Promise<TMDBResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }

  return response.json();
};

export const getPopularTVShows = async (page: number = 1): Promise<TMDBResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch popular TV shows');
  }

  return response.json();
};

export const getTrendingAll = async (page: number = 1): Promise<TMDBResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch trending content');
  }

  return response.json();
};

export const getGenres = async (): Promise<{ [key: number]: string }> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const [movieGenresResponse, tvGenresResponse] = await Promise.all([
    fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`),
    fetch(`${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`)
  ]);

  if (!movieGenresResponse.ok || !tvGenresResponse.ok) {
    throw new Error('Failed to fetch genres');
  }

  const movieGenres = await movieGenresResponse.json();
  const tvGenres = await tvGenresResponse.json();

  const genres: { [key: number]: string } = {};
  
  movieGenres.genres.forEach((genre: { id: number; name: string }) => {
    genres[genre.id] = genre.name;
  });
  
  tvGenres.genres.forEach((genre: { id: number; name: string }) => {
    genres[genre.id] = genre.name;
  });

  return genres;
};

export const getFeaturedMovie = async (): Promise<TMDBMovie> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  // Get the first movie from trending movies for the featured spot
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch featured movie');
  }

  const data = await response.json();
  return data.results[0]; // Return the first (most popular) movie
}; 