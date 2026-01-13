'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ratingsService } from '@/lib/ratings';

interface RatingButtonProps {
  movieId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  releaseDate?: string;
  className?: string;
}

export default function RatingButton({
  movieId,
  mediaType,
  title,
  posterPath,
  releaseDate,
  className = ''
}: RatingButtonProps) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRatingPicker, setShowRatingPicker] = useState(false);

  // Check if user has already rated this movie/show
  useEffect(() => {
    if (!user) return;

    const checkRating = async () => {
      try {
        const response = await ratingsService.getUserRating(movieId, mediaType);
        if (response.data.rating) {
          setUserRating(response.data.rating.rating);
        } else {
          setUserRating(null);
        }
      } catch (error) {
        console.error('Error checking rating:', error);
        setUserRating(null);
      }
    };

    checkRating();
  }, [user, movieId, mediaType]);

  const handleRate = async (rating: number) => {
    if (!user) return;

    setLoading(true);

    try {
      await ratingsService.rateMedia({
        movieId,
        mediaType,
        rating,
        title,
        posterPath,
        releaseDate
      });
      setUserRating(rating);
      setShowRatingPicker(false);
    } catch (error) {
      console.error('Error rating media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRating = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    setLoading(true);

    try {
      await ratingsService.removeRating(movieId, mediaType);
      setUserRating(null);
      setShowRatingPicker(false);
    } catch (error) {
      console.error('Error removing rating:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const displayRating = hoveredRating || userRating || 0;
  const stars = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowRatingPicker(!showRatingPicker);
        }}
        disabled={loading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
          userRating
            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={userRating ? `Your rating: ${userRating}/10` : 'Rate this'}
      >
        <Star className={`h-5 w-5 ${userRating ? 'fill-current' : ''}`} />
        {userRating ? `${userRating}/10` : 'Rate'}
      </button>

      {showRatingPicker && (
        <div
          className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-lg p-4 shadow-xl z-50 min-w-[300px]"
          onMouseLeave={() => setShowRatingPicker(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">Rate this</span>
              {userRating && (
                <button
                  onClick={handleRemoveRating}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Remove rating
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 justify-center">
              {stars.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRate(star);
                  }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  disabled={loading}
                  className={`transition-colors ${
                    star <= displayRating
                      ? 'text-yellow-400'
                      : 'text-gray-400'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-yellow-300'}`}
                  title={`${star}/10`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= displayRating ? 'fill-current' : ''
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
