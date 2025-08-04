'use client';

import { Star, Plus, Play } from 'lucide-react';
import Image from 'next/image';

const movies = [
  {
    id: 1,
    title: "Action Hero",
    year: "2024",
    rating: 8.5,
    genre: "Action",
    image: "/api/placeholder/300/450",
    type: "movie"
  },
  {
    id: 2,
    title: "Mystery Series",
    year: "2024",
    rating: 9.1,
    genre: "Mystery",
    image: "/api/placeholder/300/450",
    type: "series"
  },
  {
    id: 3,
    title: "Comedy Night",
    year: "2024",
    rating: 7.8,
    genre: "Comedy",
    image: "/api/placeholder/300/450",
    type: "movie"
  },
  {
    id: 4,
    title: "Sci-Fi Adventure",
    year: "2024",
    rating: 8.9,
    genre: "Sci-Fi",
    image: "/api/placeholder/300/450",
    type: "movie"
  },
  {
    id: 5,
    title: "Drama Special",
    year: "2024",
    rating: 8.3,
    genre: "Drama",
    image: "/api/placeholder/300/450",
    type: "series"
  },
  {
    id: 6,
    title: "Thriller Night",
    year: "2024",
    rating: 8.7,
    genre: "Thriller",
    image: "/api/placeholder/300/450",
    type: "movie"
  },
  {
    id: 7,
    title: "Romance Story",
    year: "2024",
    rating: 7.9,
    genre: "Romance",
    image: "/api/placeholder/300/450",
    type: "movie"
  },
  {
    id: 8,
    title: "Horror Tales",
    year: "2024",
    rating: 8.2,
    genre: "Horror",
    image: "/api/placeholder/300/450",
    type: "series"
  }
];

interface MovieCardProps {
  movie: typeof movies[0];
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group relative bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Movie Poster</span>
        </div>
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors">
              <Play className="h-5 w-5" />
            </button>
            <button className="bg-gray-800/80 hover:bg-gray-700 text-white p-3 rounded-full transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            movie.type === 'movie' 
              ? 'bg-blue-600 text-white' 
              : 'bg-green-600 text-white'
          }`}>
            {movie.type === 'movie' ? 'Movie' : 'Series'}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-medium">{movie.rating}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-1 truncate">{movie.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{movie.year}</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-xs">{movie.genre}</span>
        </div>
      </div>
    </div>
  );
}

export default function MovieGrid() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Popular Now</h2>
            <p className="text-gray-400">Trending movies and series everyone&apos;s watching</p>
          </div>
          <button className="text-red-500 hover:text-red-400 font-medium transition-colors">
            View All →
          </button>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Load More
          </button>
        </div>
      </div>
    </section>
  );
}