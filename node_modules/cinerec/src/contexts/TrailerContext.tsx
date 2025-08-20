'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useTrailerManager } from '@/hooks/useTrailerManager';

interface TrailerContextType {
  activeTrailer: {
    movieId: number | null;
    mediaType: string | null;
    trailerKey: string | null;
  };
  playTrailer: (movieId: number, mediaType: string, trailerKey: string) => void;
  stopTrailer: () => void;
  isTrailerActive: (movieId: number, mediaType: string) => boolean;
  getActiveTrailerKey: () => string | null;
}

const TrailerContext = createContext<TrailerContextType | undefined>(undefined);

export const useTrailerContext = () => {
  const context = useContext(TrailerContext);
  if (context === undefined) {
    throw new Error('useTrailerContext must be used within a TrailerProvider');
  }
  return context;
};

interface TrailerProviderProps {
  children: ReactNode;
}

export const TrailerProvider: React.FC<TrailerProviderProps> = ({ children }) => {
  const trailerManager = useTrailerManager();

  return (
    <TrailerContext.Provider value={trailerManager}>
      {children}
    </TrailerContext.Provider>
  );
};
