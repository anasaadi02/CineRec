'use client';

import { useState, useEffect } from 'react';
import { Star, Plus, Play, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { TMDBMovie, tmdbImageUrl } from '@/lib/tmdb';
import { useMovies, useTVShows } from '@/hooks/useMovies';
import ClientOnly from './ClientOnly';
import Link from 'next/link';
import { useTrailerContext } from '@/contexts/TrailerContext';
import WatchlistButton from './WatchlistButton';
import LikeButton from './LikeButton';

interface MediaCardProps {
  item: TMDBMovie;
  genres: { [key: number]: string };
  type: 'movie' | 'tv';
}

function MediaCard({ item, genres, type }: MediaCardProps) {
  const { playTrailer, stopTrailer, isTrailerActive, getActiveTrailerKey } = useTrailerContext();
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const title = item.title || item.name || 'Unknown Title';
  const releaseDate = item.release_date || item.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : 'N/A';
  const primaryGenre = item.genre_ids.length > 0 ? genres[item.genre_ids[0]] || 'Unknown' : 'Unknown';
  
    const showTrailer = isTrailerActive(item.id, type);
  const trailerKey = getActiveTrailerKey();
  
  // Cleanup: stop trailer when component unmounts or when this trailer is no longer active
  useEffect(() => {
    return () => {
      if (showTrailer) {
        stopTrailer();
      }
    };
  }, [showTrailer, stopTrailer]);
  
  const fetchTrailer = async () => {
    if (showTrailer) return; // Already have trailer
    
    setLoadingTrailer(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const response = await fetch(
        `https://api.themoviedb.org/3/${type}/${item.id}/videos?api_key=${apiKey}&language=en-US`
      );
      
      if (response.ok) {
        const data = await response.json();
        const trailer = data.results.find((video: { type: string; site: string; key: string }) => 
          video.type === 'Trailer' && video.site === 'YouTube'
        );
        
        if (trailer) {
          playTrailer(item.id, type, trailer.key);
        }
      }
    } catch (error) {
      console.error('Failed to fetch trailer:', error);
    } finally {
      setLoadingTrailer(false);
    }
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (showTrailer) {
      stopTrailer();
    } else {
      fetchTrailer();
    }
  };

  return (
    <Link href={`/${type}/${item.id}`}>
      <div className="group relative bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        {/* Media Poster or Trailer */}
        <div className="relative aspect-[2/3] overflow-hidden">
        {showTrailer && trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=0&loop=1&playlist=${trailerKey}`}
            title={`${title} Trailer`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : item.poster_path ? (
          <Image
            src={tmdbImageUrl(item.poster_path)}
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
                  onClick={handleTrailerClick}
                  disabled={loadingTrailer}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors disabled:opacity-50"
                >
                  {loadingTrailer ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : showTrailer ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>
                <div onClick={(e) => e.stopPropagation()} className="flex space-x-3">
                  <LikeButton
                    movieId={item.id}
                    title={item.title || item.name || 'Unknown Title'}
                    posterPath={item.poster_path}
                    releaseDate={item.release_date || item.first_air_date}
                  />
                  <WatchlistButton
                    movieId={item.id}
                    title={item.title || item.name || 'Unknown Title'}
                    posterPath={item.poster_path}
                    releaseDate={item.release_date || item.first_air_date}
                  />
                </div>
              </div>
            </div>

            {/* Type Badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                type === 'movie' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-green-600 text-white'
              }`}>
                {type === 'movie' ? 'Movie' : 'Series'}
              </span>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-medium">{item.vote_average.toFixed(1)}</span>
            </div>
          </div>

          {/* Media Info */}
          <div className="p-4">
            <h3 className="text-white font-semibold text-lg mb-1 truncate">{title}</h3>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{year}</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">{primaryGenre}</span>
            </div>
          </div>
        </div>
      </Link>
      
  );
}

function MoviesTab() {
  const { items: movies, loading, error, genres, hasMore, loadMore } = useMovies();

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-8">
          <h3 className="text-red-400 text-xl font-semibold mb-2">Error Loading Movies</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Loading State */}
      {loading && movies.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <span className="ml-2 text-gray-400">Loading movies...</span>
        </div>
      )}

      {/* Movies Grid */}
      {movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MediaCard key={movie.id} item={movie} genres={genres} type="movie" />
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
  );
}

function TVShowsTab() {
  const { items: shows, loading, error, genres, hasMore, loadMore } = useTVShows();

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-8">
          <h3 className="text-red-400 text-xl font-semibold mb-2">Error Loading TV Shows</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Loading State */}
      {loading && shows.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <span className="ml-2 text-gray-400">Loading TV shows...</span>
        </div>
      )}

      {/* TV Shows Grid */}
      {shows.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {shows.map((show) => (
            <MediaCard key={show.id} item={show} genres={genres} type="tv" />
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
  );
}

function MediaTabsContent() {
  const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Popular Content</h2>
            <p className="text-gray-400">Discover the most popular movies and TV shows</p>
          </div>
          <button className="text-red-500 hover:text-red-400 font-medium transition-colors">
            View All →
          </button>
        </div>

                          {/* Tabs */}
         <div className="flex justify-center mb-8">
           <div className="flex space-x-2 bg-gray-800 p-2 rounded-xl">
             <button
               onClick={() => setActiveTab('movies')}
               className={`w-32 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform ${
                 activeTab === 'movies'
                   ? 'bg-red-600 text-white shadow-lg scale-105'
                   : 'text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-102'
               }`}
             >
               Movies
             </button>
             <button
               onClick={() => setActiveTab('tv')}
               className={`w-32 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform ${
                 activeTab === 'tv'
                   ? 'bg-red-600 text-white shadow-lg scale-105'
                   : 'text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-102'
               }`}
             >
               TV Shows
             </button>
           </div>
         </div>

         {/* Tab Content */}
         <div className="relative overflow-hidden">
           <div 
             className={`transition-transform duration-500 ease-in-out ${
               activeTab === 'movies' ? 'translate-x-0' : '-translate-x-full'
             }`}
           >
             <MoviesTab />
           </div>
           <div 
             className={`absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out ${
               activeTab === 'tv' ? 'translate-x-0' : 'translate-x-full'
             }`}
           >
             <TVShowsTab />
           </div>
         </div>
      </div>
    </section>
  );
}

export default function MediaTabs() {
  const fallback = (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Popular Content</h2>
            <p className="text-gray-400">Discover the most popular movies and TV shows</p>
          </div>
          <button className="text-red-500 hover:text-red-400 font-medium transition-colors">
            View All →
          </button>
        </div>
                 <div className="flex justify-center mb-8">
           <div className="flex space-x-2 bg-gray-800 p-2 rounded-xl">
             <button className="w-32 py-4 rounded-lg font-semibold text-lg bg-red-600 text-white shadow-lg scale-105">
               Movies
             </button>
             <button className="w-32 py-4 rounded-lg font-semibold text-lg text-gray-400">
               TV Shows
             </button>
           </div>
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
      <MediaTabsContent />
    </ClientOnly>
  );
} 