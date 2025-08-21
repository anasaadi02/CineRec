'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchMulti, TMDBMovie, getGenres } from '@/lib/tmdb';

interface UseSearchReturn {
  searchQuery: string;
  searchResults: TMDBMovie[];
  loading: boolean;
  error: string | null;
  genres: { [key: number]: string };
  hasMore: boolean;
  currentPage: number;
  totalResults: number;
  search: (query: string) => void;
  loadMore: () => void;
  clearSearch: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load genres on mount
  useEffect(() => {
    if (!isClient) return;
    
    const loadGenres = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    };
    loadGenres();
  }, [isClient]);

  const search = useCallback(async (query: string) => {
    if (!isClient || !query.trim()) {
      setSearchResults([]);
      setTotalResults(0);
      setHasMore(false);
      setCurrentPage(1);
      return;
    }

    setSearchQuery(query);
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const response = await searchMulti(query, 1);
      setSearchResults(response.results);
      setTotalResults(response.total_results);
      setHasMore(response.page < response.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
      setSearchResults([]);
      setTotalResults(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Initialize search query from URL params on client side
  useEffect(() => {
    if (isClient && searchParams) {
      const query = searchParams.get('q');
      if (query && !searchQuery) {
        setSearchQuery(query);
      }
    }
  }, [isClient, searchParams, searchQuery]);

  // Handle URL search query - moved after search function is defined
  useEffect(() => {
    if (!isClient || !searchParams) return;
    
    const query = searchParams.get('q');
    if (query && query !== searchQuery) {
      search(query);
    }
  }, [searchParams, search, isClient, searchQuery]);

  const loadMore = useCallback(async () => {
    if (!isClient || !searchQuery.trim() || loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const response = await searchMulti(searchQuery, nextPage);
      setSearchResults(prev => [...prev, ...response.results]);
      setCurrentPage(nextPage);
      setHasMore(response.page < response.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more results');
    } finally {
      setLoading(false);
    }
  }, [isClient, searchQuery, loading, hasMore, currentPage]);

  const clearSearch = useCallback(() => {
    if (!isClient) return;
    
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setCurrentPage(1);
    setTotalResults(0);
    setHasMore(false);
  }, [isClient]);

  return {
    searchQuery,
    searchResults,
    loading,
    error,
    genres,
    hasMore,
    currentPage,
    totalResults,
    search,
    loadMore,
    clearSearch,
  };
};
