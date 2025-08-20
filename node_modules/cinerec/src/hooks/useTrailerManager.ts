import { useState, useCallback } from 'react';

interface TrailerState {
  movieId: number | null;
  mediaType: string | null;
  trailerKey: string | null;
}

export const useTrailerManager = () => {
  const [activeTrailer, setActiveTrailer] = useState<TrailerState>({
    movieId: null,
    mediaType: null,
    trailerKey: null,
  });

  const playTrailer = useCallback((movieId: number, mediaType: string, trailerKey: string) => {
    setActiveTrailer({ movieId, mediaType, trailerKey });
  }, []);

  const stopTrailer = useCallback(() => {
    setActiveTrailer({ movieId: null, mediaType: null, trailerKey: null });
  }, []);

  const isTrailerActive = useCallback((movieId: number, mediaType: string) => {
    return activeTrailer.movieId === movieId && activeTrailer.mediaType === mediaType;
  }, [activeTrailer.movieId, activeTrailer.mediaType]);

  const getActiveTrailerKey = useCallback(() => {
    return activeTrailer.trailerKey;
  }, [activeTrailer.trailerKey]);

  return {
    activeTrailer,
    playTrailer,
    stopTrailer,
    isTrailerActive,
    getActiveTrailerKey,
  };
};
