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
  popularity: number;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBCredits {
  id: number;
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

export interface TMDBTVShowDetails extends TMDBMovie {
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  status: string;
  networks: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  created_by: Array<{
    id: number;
    name: string;
    profile_path: string | null;
  }>;
  seasons: Array<{
    id: number;
    name: string;
    poster_path: string | null;
    season_number: number;
    episode_count: number;
    air_date: string;
  }>;
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

export const getTopRatedMovies = async (page: number = 1): Promise<TMDBResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch top rated movies');
  }

  return response.json();
};

export const getNowPlayingMovies = async (page: number = 1): Promise<TMDBResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch now playing movies');
  }

  return response.json();
};

export const getUpcomingMovies = async (page: number = 1): Promise<TMDBResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch upcoming movies');
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

export const getTopRatedTVShows = async (page: number = 1): Promise<TMDBResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch top rated TV shows');
  }

  return response.json();
};

export const getOnTheAirTVShows = async (page: number = 1): Promise<TMDBResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch on the air TV shows');
  }

  return response.json();
};

export const getAiringTodayTVShows = async (page: number = 1): Promise<TMDBResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/tv/airing_today?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch airing today TV shows');
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

// Test function to demonstrate the scoring algorithm (can be removed in production)
export const testScoringAlgorithm = () => {
  const testMovies = [
    { title: 'High Rating, Low Votes', vote_average: 9.5, vote_count: 50 },
    { title: 'High Rating, Medium Votes', vote_average: 9.0, vote_count: 500 },
    { title: 'Medium Rating, High Votes', vote_average: 7.5, vote_count: 2000 },
    { title: 'High Rating, High Votes', vote_average: 8.8, vote_count: 1500 },
    { title: 'Low Rating, High Votes', vote_average: 6.0, vote_count: 3000 }
  ];

  const calculateWeightedScore = (movie: { vote_average: number; vote_count: number }): number => {
    const rating = movie.vote_average;
    const voteCount = movie.vote_count;
    
    const minVotes = 100;
    
    if (voteCount < minVotes) {
      const penalty = Math.pow(voteCount / minVotes, 2);
      return rating * penalty;
    }
    
    const ratingScore = rating * 0.7;
    const voteScore = Math.min(voteCount / 1000, 1) * 0.3;
    
    return ratingScore + voteScore;
  };

  return testMovies.map(movie => ({
    ...movie,
    score: calculateWeightedScore(movie)
  })).sort((a, b) => b.score - a.score);
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
  const results = data.results || [];
  if (results.length === 0) {
    throw new Error('No popular movies found');
  }
  
  // Calculate a weighted score that considers both rating and vote count
  // This prevents movies with high ratings but very few votes from being selected
  // 
  // Scoring Algorithm:
  // 1. Movies with < 100 votes get penalized using a quadratic penalty
  // 2. Movies with >= 100 votes use a weighted formula:
  //    - 70% weight for rating (vote_average)
  //    - 30% weight for vote count (normalized to 0-1 scale)
  // 3. This ensures movies need both good ratings AND sufficient votes to be featured
  const calculateWeightedScore = (movie: TMDBMovie): number => {
    const rating = movie.vote_average;
    const voteCount = movie.vote_count;
    
    // Minimum vote threshold to be considered credible
    const minVotes = 100;
    
    // If vote count is below threshold, apply a penalty
    if (voteCount < minVotes) {
      const penalty = Math.pow(voteCount / minVotes, 2);
      return rating * penalty;
    }
    
    // For movies above threshold, use a weighted formula
    // Rating weight: 70%, Vote count weight: 30%
    const ratingScore = rating * 0.7;
    const voteScore = Math.min(voteCount / 1000, 1) * 0.3; // Normalize vote count
    
    return ratingScore + voteScore;
  };
  
  // Find the movie with the best weighted score
  const bestMovie = results.reduce((best: TMDBMovie | null, current: TMDBMovie) => {
    if (!best) return current;
    
    const bestScore = calculateWeightedScore(best);
    const currentScore = calculateWeightedScore(current);
    
    if (currentScore > bestScore) return current;
    return best;
  }, results[0] as TMDBMovie | null)!;
  
  return bestMovie;
}; 

export const getMovieDetails = async (movieId: number): Promise<TMDBMovieDetails> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,images,recommendations`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }

  return response.json();
};

export const getTVShowDetails = async (tvId: number): Promise<TMDBTVShowDetails> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,images,recommendations`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch TV show details');
  }

  return response.json();
};

export const getMovieCredits = async (movieId: number): Promise<TMDBCredits> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie credits');
  }

  return response.json();
};

export const getTVShowCredits = async (tvId: number): Promise<TMDBCredits> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/tv/${tvId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch TV show credits');
  }

  return response.json();
};

export const searchMulti = async (query: string, page: number = 1): Promise<TMDBResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }

  return response.json();
};