'use client';

import { Star, Plus, Play, Loader2, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TMDBMovie, tmdbImageUrl } from '@/lib/tmdb';
import { useSearch } from '@/hooks/useSearch';
import SearchSuggestions from './SearchSuggestions';
import SearchInput from './SearchInput';
import SearchFilters, { SearchFilters as SearchFiltersType } from './SearchFilters';
import SearchResultsSkeleton from './SearchResultsSkeleton';
import WatchlistButton from './WatchlistButton';
import LikeButton from './LikeButton';

interface SearchResultCardProps {
  item: TMDBMovie;
  genres: { [key: number]: string };
}

function SearchResultCard({ item, genres }: SearchResultCardProps) {
  const title = item.title || item.name || 'Unknown Title';
  const releaseDate = item.release_date || item.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : 'N/A';
  const primaryGenre = (item.genre_ids && item.genre_ids.length > 0) ? genres[item.genre_ids[0]] || 'Unknown' : 'Unknown';
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const detailUrl = mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <Link href={detailUrl}>
      <div className="group relative bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        {/* Media Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {item.poster_path ? (
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
              >
                <Play className="h-5 w-5" />
              </button>
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

          {/* Type Badge */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
              mediaType === 'movie' ? 'bg-blue-600' : 'bg-purple-600'
            }`}>
              {mediaType === 'movie' ? 'Movie' : 'TV Show'}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">{(item.vote_average || 0).toFixed(1)}</span>
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

function SearchResultsContent() {
  const { 
    searchQuery, 
    searchResults, 
    loading, 
    error, 
    genres, 
    hasMore, 
    totalResults,
    loadMore 
  } = useSearch();

  if (!searchQuery) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Search className="h-16 w-16 text-gray-600 mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-white mb-2">Search for Movies & TV Shows</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Find your favorite movies, TV shows, and discover new content to watch
          </p>
          <div className="max-w-md mx-auto">
            <SearchInput
              onSearch={(query) => window.location.href = `/search?q=${encodeURIComponent(query)}`}
            />
          </div>
        </div>
        <SearchSuggestions onSuggestionClick={(query) => window.location.href = `/search?q=${encodeURIComponent(query)}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-8 max-w-md">
          <h3 className="text-red-400 text-xl font-semibold mb-2">Search Error</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (loading && searchResults.length === 0) {
    return <SearchResultsSkeleton />;
  }

  if (searchResults.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Search className="h-16 w-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Results Found</h2>
        <p className="text-gray-400 max-w-md">
          We couldn't find any movies or TV shows matching "{searchQuery}". Try different keywords or check your spelling.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Search Results for "{searchQuery}"
        </h1>
        <p className="text-gray-400 mb-6">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''}
        </p>
        <div className="max-w-md mx-auto mb-6">
          <SearchInput
            onSearch={(query) => window.location.href = `/search?q=${encodeURIComponent(query)}`}
          />
        </div>
        <div className="flex justify-center">
          <SearchFilters
            genres={genres}
            onFiltersChange={(filters) => {
              // Handle filter changes - in a real app, this would filter the results
              console.log('Filters changed:', filters);
            }}
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {searchResults.map((item) => (
          <SearchResultCard key={`${item.id}-${item.media_type || 'unknown'}`} item={item} genres={genres} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-8">
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
              'Load More Results'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchResults() {
  return <SearchResultsContent />;
}
