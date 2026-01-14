'use client';

import { Star, Plus, Play, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TMDBMovie, tmdbImageUrl } from '@/lib/tmdb';
import { useTVShows } from '@/hooks/useMovies';
import ClientOnly from './ClientOnly';
import WatchlistButton from './WatchlistButton';
import LikeButton from './LikeButton';

interface TVShowCardProps {
  show: TMDBMovie;
  genres: { [key: number]: string };
}

function TVShowCard({ show, genres }: TVShowCardProps) {
  const title = show.title || show.name || 'Unknown Title';
  const releaseDate = show.release_date || show.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : 'N/A';
  const primaryGenre = (show.genre_ids && show.genre_ids.length > 0) ? genres[show.genre_ids[0]] || 'Unknown' : 'Unknown';

  return (
    <Link href={`/tv/${show.id}`}>
      <div className="group relative bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
        {/* TV Show Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {show.poster_path ? (
            <Image
              src={tmdbImageUrl(show.poster_path)}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
              >
                <Play className="h-5 w-5" />
              </button>
              <LikeButton
                movieId={show.id}
                title={show.title || show.name || 'Unknown Title'}
                posterPath={show.poster_path}
                releaseDate={show.release_date || show.first_air_date}
              />
              <WatchlistButton
                movieId={show.id}
                title={show.title || show.name || 'Unknown Title'}
                posterPath={show.poster_path}
                releaseDate={show.release_date || show.first_air_date}
              />
            </div>
          </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
            Series
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-medium">{(show.vote_average || 0).toFixed(1)}</span>
        </div>
      </div>

      {/* TV Show Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-1 truncate">{title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{year}</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-xs">{primaryGenre}</span>
        </div>
      </div>
    </div>
  );
}

function TVShowGridContent() {
  const { items: shows, loading, error, genres, hasMore, loadMore } = useTVShows();

  if (error) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-8">
            <h3 className="text-red-400 text-xl font-semibold mb-2">Error Loading TV Shows</h3>
            <p className="text-gray-400">{error}</p>
            <p className="text-gray-500 text-sm mt-4">
              Please make sure you have set up your TMDB API key in the environment variables.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Popular TV Shows</h2>
            <p className="text-gray-400">The most popular series right now</p>
          </div>
          <button className="text-red-500 hover:text-red-400 font-medium transition-colors">
            View All →
          </button>
        </div>

        {/* Loading State */}
        {loading && shows.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            <span className="ml-2 text-gray-400">Loading TV shows...</span>
          </div>
        )}

        {/* TV Show Grid */}
        {shows.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {shows.map((show) => (
              <TVShowCard key={show.id} show={show} genres={genres} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <button 
              onClick={loadMore}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function TVShowGrid() {
  const fallback = (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Popular TV Shows</h2>
            <p className="text-gray-400">The most popular series right now</p>
          </div>
          <button className="text-red-500 hover:text-red-400 font-medium transition-colors">
            View All →
          </button>
        </div>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <span className="ml-2 text-gray-400">Loading...</span>
        </div>
      </div>
    </section>
  );

  return (
    <ClientOnly fallback={fallback}>
      <TVShowGridContent />
    </ClientOnly>
  );
} 