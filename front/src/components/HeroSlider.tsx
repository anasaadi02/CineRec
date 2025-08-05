'use client';

import { Play, Star, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import ClientOnly from './ClientOnly';
import CircularText from './CircularText';
import { useFeaturedMovie } from '@/hooks/useMovies';
import { tmdbImageUrl } from '@/lib/tmdb';

function HeroContent() {
  const { movie, loading, error } = useFeaturedMovie();

  if (loading) {
    return (
      <div className="relative h-[70vh] overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between">
              <div className="max-w-2xl">
                              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-300">2024</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">8.5</span>
                </div>
              </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Loading Featured Movie...
                </h1>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Please wait while we load the movie of the week for you.
                </p>
              </div>
              <div className="hidden lg:block">
                <ClientOnly fallback={<div className="w-[200px] h-[200px]"></div>}>
                  <CircularText
                    text="MOVIE OF THE MONTH "
                    spinDuration={30}
                    onHover="speedUp"
                    className="opacity-50"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="relative h-[70vh] overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Movie of the Week
                </h1>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Unable to load the featured movie. Please try again later.
                </p>
              </div>
              <div className="hidden lg:block">
                <ClientOnly fallback={<div className="w-[200px] h-[200px]"></div>}>
                  <CircularText
                    text="MOVIE OF THE MONTH "
                    spinDuration={30}
                    onHover="speedUp"
                    className="opacity-50"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {movie.backdrop_path && (
          <Image
            src={tmdbImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-300 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {releaseYear}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">{rating}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {movie.title}
              </h1>
              
              <p className="text-gray-300 text-lg mb-8 leading-relaxed line-clamp-3">
                {movie.overview || 'No description available for this movie.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Watch Trailer</span>
                </button>
                <button className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors">
                  More Info
                </button>
              </div>
            </div>
            
            {/* Circular Text on the right side */}
            <div className="hidden lg:block">
              <ClientOnly fallback={<div className="w-[200px] h-[200px]"></div>}>
                <CircularText
                  text="MOVIE OF THE MONTH "
                  spinDuration={30}
                  onHover="speedUp"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const fallback = (
    <div className="relative h-[70vh] overflow-hidden bg-gray-800">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-300">2024</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">8.5</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Loading Featured Movie...
              </h1>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Please wait while we load the movie of the week for you.
              </p>
            </div>
            <div className="hidden lg:block">
              <ClientOnly fallback={<div className="w-[200px] h-[200px]"></div>}>
                <CircularText
                  text="MOVIE OF THE MONTH "
                  spinDuration={30}
                  onHover="speedUp"
                  className="opacity-50"
                />
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ClientOnly fallback={fallback}>
      <HeroContent />
    </ClientOnly>
  );
}