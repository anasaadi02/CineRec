'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { listsService, List } from '@/lib/lists';
import { useAuth } from '@/hooks/useAuth';

interface WatchlistButtonProps {
  movieId: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
  onToggle?: (isInWatchlist: boolean) => void;
}

export default function WatchlistButton({ 
  movieId, 
  title, 
  posterPath, 
  releaseDate,
  onToggle
}: WatchlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [watchlist, setWatchlist] = useState<List | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      checkWatchlistStatus();
    }
  }, [isAuthenticated, movieId]);

  const checkWatchlistStatus = async () => {
    try {
      const response = await listsService.getListByType('watchlist');
      const watchlistData = response.data.list;
      setWatchlist(watchlistData);
      const isInList = watchlistData.movies.some(movie => movie.movieId === movieId);
      setIsInWatchlist(isInList);
    } catch (err) {
      console.error('Error checking watchlist status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check watchlist');
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !watchlist) return;

    try {
      setIsLoading(true);
      setError('');

      if (isInWatchlist) {
        // Remove from watchlist
        await listsService.removeMovieFromList(watchlist._id, movieId);
        setIsInWatchlist(false);
        // Update local state
        setWatchlist({
          ...watchlist,
          movies: watchlist.movies.filter(m => m.movieId !== movieId)
        });
        if (onToggle) {
          onToggle(false);
        }
      } else {
        // Add to watchlist
        await listsService.addMovieToList(watchlist._id, {
          movieId,
          title,
          posterPath,
          releaseDate
        });
        setIsInWatchlist(true);
        // Update local state
        setWatchlist({
          ...watchlist,
          movies: [...watchlist.movies, {
            movieId,
            title,
            posterPath,
            releaseDate,
            addedAt: new Date().toISOString()
          }]
        });
        if (onToggle) {
          onToggle(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update watchlist');
      console.error('Error toggling watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="bg-gray-800/80 hover:bg-gray-700 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isInWatchlist ? (
        <BookmarkCheck className="h-5 w-5 text-blue-500" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
    </button>
  );
}
