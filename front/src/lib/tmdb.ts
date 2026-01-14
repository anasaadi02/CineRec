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
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
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

  // Fetch from multiple sources and pages to get the best selection
  // 1. Top rated movies (best quality) - fetch first 2 pages
  // 2. Popular movies (current relevance) - fetch first 2 pages
  // Combine and filter for quality, then find the best one
  
  const [topRatedPage1, topRatedPage2, popularPage1, popularPage2] = await Promise.all([
    fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
    fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=2`),
    fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
    fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=2`)
  ]);

  if (!topRatedPage1.ok || !topRatedPage2.ok || !popularPage1.ok || !popularPage2.ok) {
    throw new Error('Failed to fetch featured movie');
  }

  const [topRatedData1, topRatedData2, popularData1, popularData2] = await Promise.all([
    topRatedPage1.json(),
    topRatedPage2.json(),
    popularPage1.json(),
    popularPage2.json()
  ]);
  
  // Combine all results, removing duplicates by ID
  const allMovies: TMDBMovie[] = [];
  const seenIds = new Set<number>();
  
  const allResults = [
    ...(topRatedData1.results || []),
    ...(topRatedData2.results || []),
    ...(popularData1.results || []),
    ...(popularData2.results || [])
  ];
  
  allResults.forEach((movie: TMDBMovie) => {
    if (!seenIds.has(movie.id)) {
      seenIds.add(movie.id);
      allMovies.push(movie);
    }
  });

  if (allMovies.length === 0) {
    throw new Error('No movies found');
  }
  
  // DATE FILTERING: Only include movies from the last month
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  // Filter movies by release date (only last month)
  const recentMovies = allMovies.filter((movie: TMDBMovie) => {
    if (!movie.release_date) return false;
    // Compare dates: movie release date should be >= one month ago
    return movie.release_date >= oneMonthAgoStr;
  });
  
  // If no movies from last month, expand to last 3 months as fallback
  let moviesToConsider = recentMovies;
  if (recentMovies.length === 0) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const threeMonthsAgoStr = threeMonthsAgo.toISOString().split('T')[0];
    
    moviesToConsider = allMovies.filter((movie: TMDBMovie) => {
      if (!movie.release_date) return false;
      return movie.release_date >= threeMonthsAgoStr;
    });
    
    if (moviesToConsider.length === 0) {
      throw new Error('No recent movies found');
    }
  }
  
  // STRICT FILTERING: Only consider movies that meet quality thresholds
  // For "Movie of the Month", we want movies that are both highly rated AND popular
  const MIN_RATING = 7.0;  // Minimum rating threshold
  const MIN_VOTES = 1000;   // Minimum vote count threshold
  
  // First, filter to only high-quality movies (from recent movies)
  let qualifiedMovies = moviesToConsider.filter((movie: TMDBMovie) => {
    return movie.vote_average >= MIN_RATING && movie.vote_count >= MIN_VOTES;
  });
  
  // If no movies meet strict criteria, relax slightly (but still maintain quality)
  if (qualifiedMovies.length === 0) {
    qualifiedMovies = moviesToConsider.filter((movie: TMDBMovie) => {
      return movie.vote_average >= 6.5 && movie.vote_count >= 500;
    });
  }
  
  // If still no movies, use all recent movies but prioritize better ones in scoring
  if (qualifiedMovies.length === 0) {
    qualifiedMovies = moviesToConsider;
  }
  
  // Calculate a weighted score that heavily favors both high ratings AND high vote counts
  // Scoring Algorithm:
  // - Rating component: (rating / 10) ^ 2 - squares the rating to heavily favor higher ratings
  // - Vote component: log scale normalized vote count
  // - Combined: 50% rating^2, 50% vote count (both normalized)
  const calculateWeightedScore = (movie: TMDBMovie): number => {
    const rating = movie.vote_average;
    const voteCount = movie.vote_count;
    
    // Square the normalized rating to heavily favor higher ratings
    // A 9.0 rating gets 0.81, while 7.0 gets 0.49 - big difference!
    const normalizedRating = rating / 10;
    const ratingScore = Math.pow(normalizedRating, 2);
    
    // Use logarithmic scale for vote count (handles wide range better)
    // Normalize to 0-1 scale where 10,000 votes = ~0.8, 100,000 votes = ~1.0
    const maxExpectedVotes = 100000;
    const normalizedVoteCount = Math.min(
      Math.log10(voteCount + 1) / Math.log10(maxExpectedVotes + 1),
      1
    );
    
    // Weighted formula: 50% squared rating, 50% vote count
    // This ensures we need BOTH high rating AND high votes
    const finalScore = (ratingScore * 0.5) + (normalizedVoteCount * 0.5);
    
    return finalScore;
  };
  
  // Find the movie with the best weighted score
  const bestMovie = qualifiedMovies.reduce((best: TMDBMovie, current: TMDBMovie) => {
    const bestScore = calculateWeightedScore(best);
    const currentScore = calculateWeightedScore(current);
    
    return currentScore > bestScore ? current : best;
  });
  
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