'use client';

import { useState, useEffect, useCallback } from 'react';
import { TMDBMovie, TMDBResponse } from '@/lib/tmdb';

export type MovieCategory = 'popular' | 'top-rated' | 'now-playing' | 'upcoming';

interface UseMovieCategoriesReturn {
  movies: TMDBMovie[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  loadMore: () => void;
  refetch: () => void;
}

const categoryEndpoints: Record<MovieCategory, string> = {
  'popular': 'popular',
  'top-rated': 'top_rated',
  'now-playing': 'now_playing',
  'upcoming': 'upcoming'
};

export const useMovieCategories = (
  category: MovieCategory,
  selectedGenres: number[] = []
): UseMovieCategoriesReturn => {
  const [allMovies, setAllMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const fetchMovies = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      if (!apiKey) {
        throw new Error('TMDB API key is not configured');
      }

      const endpoint = categoryEndpoints[category];
      let url = `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${apiKey}&language=en-US&page=${page}`;
      
      // Add genre filter if selected
      if (selectedGenres.length > 0) {
        url += `&with_genres=${selectedGenres.join(',')}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} movies`);
      }

      const data: TMDBResponse = await response.json();
      const newMovies = data.results || [];

      if (append) {
        setAllMovies(prev => {
          // Create a map of existing movie IDs to avoid duplicates
          const existingIds = new Set(prev.map(movie => movie.id));
          const uniqueNewMovies = newMovies.filter(movie => !existingIds.has(movie.id));
          return [...prev, ...uniqueNewMovies];
        });
      } else {
        setAllMovies(newMovies);
      }

      // Only set hasMore to false if we're not appending and there are no more pages
      // When appending, we might still have more pages even if current page is the last
      if (!append) {
        setHasMore(page < data.total_pages);
      } else {
        // When appending, check if we actually got new unique movies
        setHasMore(page < data.total_pages && newMovies.length > 0);
      }
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${category} movies`);
    } finally {
      setLoading(false);
    }
  }, [category, selectedGenres]);

  // Ensure we're on the client side before doing anything
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't run on server
    
    setCurrentPage(1);
    setAllMovies([]);
    fetchMovies(1, false);
  }, [category, isClient, fetchMovies]); // Include fetchMovies in dependencies

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      // Prevent loading if we're already at the last page
      fetchMovies(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchMovies]);

  const refetch = () => {
    fetchMovies(1, false);
  };

  // Infinite scroll effect - only on client
  useEffect(() => {
    if (!isClient) return; // Don't run on server
    
    const handleScroll = () => {
      if (loading || !hasMore) return;
      
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Load more when user is near the bottom (within 100px)
      if (scrollTop + windowHeight >= documentHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadMore, isClient]);

  // Filter movies by selected genres on the client side and ensure uniqueness
  const filteredMovies = selectedGenres.length > 0 
    ? allMovies.filter(movie => 
        movie.genre_ids.some(genreId => selectedGenres.includes(genreId))
      )
    : allMovies;

  // Ensure no duplicate movies by ID (additional safety)
  const uniqueFilteredMovies = filteredMovies.filter((movie, index, self) => 
    index === self.findIndex(m => m.id === movie.id)
  );

  return {
    movies: uniqueFilteredMovies,
    loading,
    error,
    hasMore,
    currentPage,
    loadMore,
    refetch
  };
};
