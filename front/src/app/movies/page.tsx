'use client';

import { useState, useEffect } from 'react';
import { Star, Filter, Grid, List, TrendingUp, Clock, Flame, Award, ArrowUp } from 'lucide-react';
import { TMDBMovie, tmdbImageUrl } from '@/lib/tmdb';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import { useMovieCategories, MovieCategory } from '@/hooks/useMovieCategories';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface MovieCategoryConfig {
  id: MovieCategory;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const movieCategories: MovieCategoryConfig[] = [
  {
    id: 'popular',
    name: 'Popular',
    icon: <Flame className="h-5 w-5" />,
    description: 'Trending movies right now'
  },
  {
    id: 'top-rated',
    name: 'Top Rated',
    icon: <Award className="h-5 w-5" />,
    description: 'Highest rated movies of all time'
  },
  {
    id: 'now-playing',
    name: 'Now Playing',
    icon: <Clock className="h-5 w-5" />,
    description: 'Currently in theaters'
  },
  {
    id: 'upcoming',
    name: 'Upcoming',
    icon: <TrendingUp className="h-5 w-5" />,
    description: 'Coming soon to theaters'
  }
];

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

export default function MoviesPage() {
  const [selectedCategory, setSelectedCategory] = useState<MovieCategory>('popular');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'date'>('popularity');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { movies, loading, error, hasMore, loadMore } = useMovieCategories(selectedCategory, selectedGenres);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Scroll to top functionality - only on client
  useEffect(() => {
    if (!isClient) return; // Don't run on server
    
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('popularity');
  };

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.vote_average - a.vote_average;
      case 'date':
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      default:
        return b.popularity - a.popularity;
    }
  });

  const MovieCard = ({ movie }: { movie: TMDBMovie }) => {
    const title = movie.title || 'Unknown Title';
    const releaseDate = movie.release_date || '';
    const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : 'N/A';
    const primaryGenre = (movie.genre_ids && movie.genre_ids.length > 0) 
      ? genres.find(g => g.id === movie.genre_ids![0])?.name || 'Unknown'
      : 'Unknown';

    return (
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="group relative bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <div className="relative aspect-[2/3] overflow-hidden">
            {movie.poster_path ? (
              <Image
                src={tmdbImageUrl(movie.poster_path)}
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
            
            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-medium">{(movie.vote_average || 0).toFixed(1)}</span>
            </div>
          </div>

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
  };

  const MovieListItem = ({ movie }: { movie: TMDBMovie }) => {
    const title = movie.title || 'Unknown Title';
    const releaseDate = movie.release_date || '';
    const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : 'N/A';
    const primaryGenre = (movie.genre_ids && movie.genre_ids.length > 0) 
      ? genres.find(g => g.id === movie.genre_ids![0])?.name || 'Unknown'
      : 'Unknown';

    return (
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
          <div className="relative w-16 h-24 flex-shrink-0">
            {movie.poster_path ? (
              <Image
                src={tmdbImageUrl(movie.poster_path, 'w500')}
                alt={title}
                fill
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
              <span>{year}</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">{primaryGenre}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            {movie.overview && (
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{movie.overview}</p>
            )}
          </div>
        </div>
      </Link>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-8">
            <h3 className="text-red-400 text-xl font-semibold mb-2">Error Loading Movies</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Movies</h1>
          <p className="text-xl text-gray-300">Discover the latest and greatest films</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {movieCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Genre Filters */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <h3 className="text-white font-semibold">Genres</h3>
              {selectedGenres.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedGenres.includes(genre.id)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {genre.name}
                  {selectedGenres.includes(genre.id) && (
                    <span className="ml-1 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'popularity' | 'rating' | 'date')}
                    className="appearance-none bg-gray-800 text-white px-4 py-2.5 pr-10 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors cursor-pointer min-w-[140px] hover:border-gray-600 hover:bg-gray-700"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="rating">Rating</option>
                    <option value="date">Release Date</option>
                  </select>
                  
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg 
                      className="w-4 h-4 text-gray-400 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Movies Display */}
        {!isClient ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : loading && movies.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 text-gray-400">
              {selectedGenres.length > 0 ? (
                <span>
                  Showing {sortedMovies.length} movies filtered by {selectedGenres.length} genre{selectedGenres.length > 1 ? 's' : ''}
                </span>
              ) : (
                <span>Showing {sortedMovies.length} movies</span>
              )}
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {sortedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedMovies.map((movie) => (
                  <MovieListItem key={movie.id} movie={movie} />
                ))}
              </div>
            )}

            {/* Loading indicator at bottom for infinite scroll */}
            {loading && hasMore && (
              <div className="text-center mt-12">
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                  <span>Loading more movies...</span>
                </div>
              </div>
            )}
            
            {/* End of results indicator */}
            {!hasMore && movies.length > 0 && (
              <div className="text-center mt-12">
                <div className="text-gray-500 text-sm">
                  🎬 You've reached the end of the results
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Scroll to top button */}
      {isClient && showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
