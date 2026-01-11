'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { listsService } from '@/lib/lists';

interface LikeButtonProps {
  movieId: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
  variant?: 'icon' | 'full';
  className?: string;
}

export default function LikeButton({
  movieId,
  title,
  posterPath,
  releaseDate,
  variant = 'icon',
  className = ''
}: LikeButtonProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likedListId, setLikedListId] = useState<string | null>(null);

  // Check if movie is already liked
  useEffect(() => {
    if (!user) return;

    const checkLikeStatus = async () => {
      try {
        const response = await listsService.getListByType('liked');
        const likedList = response.data.list;
        setLikedListId(likedList._id);
        const isInList = likedList.movies.some(movie => movie.movieId === movieId);
        setIsLiked(isInList);
      } catch (error) {
        // Error is handled - list will be created automatically on first like
        console.error('Error checking like status:', error);
        setLikedListId(null);
        setIsLiked(false);
      }
    };

    checkLikeStatus();
  }, [user, movieId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Could redirect to login or show a toast
      return;
    }

    setLoading(true);

    try {
      // Get or ensure liked list exists (backend will create it if it doesn't exist)
      let listId = likedListId;
      if (!listId) {
        const response = await listsService.getListByType('liked');
        listId = response.data.list._id;
        setLikedListId(listId);
      }

      if (isLiked) {
        // Unlike: remove from list
        await listsService.removeMovieFromList(listId, movieId);
        setIsLiked(false);
      } else {
        // Like: add to list
        await listsService.addMovieToList(listId, {
          movieId,
          title,
          posterPath,
          releaseDate
        });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Could show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't show like button if not logged in
  }

  if (variant === 'full') {
    return (
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
          isLiked
            ? 'bg-pink-600 hover:bg-pink-700 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        {isLiked ? 'Liked' : 'Like'}
      </button>
    );
  }

  // Icon variant
  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`bg-gray-800/80 hover:bg-gray-700 text-white p-3 rounded-full transition-colors ${
        isLiked ? 'bg-pink-600 hover:bg-pink-700' : ''
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isLiked ? 'Unlike' : 'Like'}
    >
      <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
    </button>
  );
}
