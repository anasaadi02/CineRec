'use client';

import { useState, useEffect, useCallback } from 'react';
import { TMDBMovie, TMDBResponse, getPopularTVShows, getTopRatedTVShows, getOnTheAirTVShows, getAiringTodayTVShows } from '@/lib/tmdb';

export type TVShowCategory = 'popular' | 'top_rated' | 'on_the_air' | 'airing_today';

export interface UseTVShowCategoriesReturn {
  tvShows: TMDBMovie[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  loadMore: () => void;
  refetch: () => void;
}

const categoryEndpoints: Record<TVShowCategory, string> = {
  popular: 'popular',
  top_rated: 'top_rated',
  on_the_air: 'on_the_air',
  airing_today: 'airing_today'
};

const categoryFunctions: Record<TVShowCategory, (page: number) => Promise<TMDBResponse>> = {
  popular: getPopularTVShows,
  top_rated: getTopRatedTVShows,
  on_the_air: getOnTheAirTVShows,
  airing_today: getAiringTodayTVShows
};

export const useTVShowCategories = (
  category: TVShowCategory,
  selectedGenres: number[] = []
): UseTVShowCategoriesReturn => {
  const [allTVShows, setAllTVShows] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const fetchTVShows = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      if (!apiKey) {
        throw new Error('TMDB API key is not configured');
      }

      const fetchFunction = categoryFunctions[category];
      const data: TMDBResponse = await fetchFunction(page);
      const newTVShows = data.results || [];

      if (append) {
        setAllTVShows(prev => {
          // Create a map of existing TV show IDs to avoid duplicates
          const existingIds = new Set(prev.map(tvShow => tvShow.id));
          const uniqueNewTVShows = newTVShows.filter(tvShow => !existingIds.has(tvShow.id));
          
          // Log if we're filtering out duplicates
          if (uniqueNewTVShows.length < newTVShows.length) {
            console.log(`Filtered out ${newTVShows.length - uniqueNewTVShows.length} duplicate TV shows`);
          }
          
          return [...prev, ...uniqueNewTVShows];
        });
      } else {
        setAllTVShows(newTVShows);
      }

      // Only set hasMore to false if we're not appending and there are no more pages
      // When appending, we might still have more pages even if current page is the last
      if (!append) {
        setHasMore(page < data.total_pages);
      } else {
        // When appending, check if we actually got new unique TV shows
        setHasMore(page < data.total_pages && newTVShows.length > 0);
      }
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${category} TV shows`);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Ensure we're on the client side before doing anything
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't run on server
    
    setCurrentPage(1);
    setAllTVShows([]);
    fetchTVShows(1, false);
  }, [category, isClient, fetchTVShows]); // Include fetchTVShows in dependencies

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      // Prevent loading if we're already at the last page
      fetchTVShows(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchTVShows]);

  const refetch = () => {
    fetchTVShows(1, false);
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

  // Filter TV shows by selected genres on the client side and ensure uniqueness
  const filteredTVShows = allTVShows.filter(tvShow => {
    if (selectedGenres.length === 0) return true;
    return selectedGenres.some(genreId => tvShow.genre_ids.includes(genreId));
  });

  // Additional safety check to ensure no duplicates in the final filtered list
  const uniqueFilteredTVShows = filteredTVShows.filter((tvShow, index, self) =>
    index === self.findIndex(t => t.id === tvShow.id)
  );

  return {
    tvShows: uniqueFilteredTVShows,
    loading,
    error,
    hasMore,
    currentPage,
    loadMore,
    refetch
  };
};
