'use client';

import { useState, useEffect } from 'react';
import { TMDBMovie, TMDBResponse, getTrendingAll, getPopularMovies, getPopularTVShows, getGenres, getFeaturedMovie } from '@/lib/tmdb';

export interface MovieData {
  movies: TMDBMovie[];
  loading: boolean;
  error: string | null;
  genres: { [key: number]: string };
  hasMore: boolean;
  currentPage: number;
}

// Generic hook for any media type
export const useMedia = (
  fetchFunction: (page: number) => Promise<TMDBResponse>,
  initialPage: number = 1
) => {
  const [items, setItems] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const [itemsResponse, genresResponse] = await Promise.all([
        fetchFunction(page),
        getGenres()
      ]);

      const newItems = itemsResponse.results;
      setGenres(genresResponse);
      setHasMore(page < itemsResponse.total_pages);

      if (append) {
        setItems(prev => [...prev, ...newItems]);
      } else {
        setItems(newItems);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchItems(nextPage, true);
    }
  };

  useEffect(() => {
    // Only fetch on client-side
    if (typeof window !== 'undefined') {
      fetchItems(currentPage);
    }
  }, []);

  return {
    items,
    loading,
    error,
    genres,
    hasMore,
    currentPage,
    loadMore,
    refetch: () => fetchItems(1, false)
  };
};

// Hook specifically for movies
export const useMovies = (initialPage: number = 1) => {
  return useMedia(getPopularMovies, initialPage);
};

// Hook specifically for TV shows
export const useTVShows = (initialPage: number = 1) => {
  return useMedia(getPopularTVShows, initialPage);
};

// Legacy hook for trending all (keeping for backward compatibility)
export const useTrendingAll = (initialPage: number = 1) => {
  return useMedia(getTrendingAll, initialPage);
};

export const useFeaturedMovie = () => {
  const [movie, setMovie] = useState<TMDBMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedMovie = async () => {
    try {
      setLoading(true);
      setError(null);
      const featuredMovie = await getFeaturedMovie();
      setMovie(featuredMovie);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured movie');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch on client-side
    if (typeof window !== 'undefined') {
      fetchFeaturedMovie();
    }
  }, []);

  return {
    movie,
    loading,
    error,
    refetch: fetchFeaturedMovie
  };
}; 