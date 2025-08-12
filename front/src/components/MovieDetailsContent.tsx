'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Play, Plus, Clock, DollarSign, Calendar, Users } from 'lucide-react';
import { TMDBMovieDetails, TMDBCredits, tmdbImageUrl } from '@/lib/tmdb';
import Navbar from './Navbar';
import Footer from './Footer';

interface MovieDetailsContentProps {
  details: TMDBMovieDetails;
  credits: TMDBCredits;
}

export default function MovieDetailsContent({ details, credits }: MovieDetailsContentProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'crew'>('overview');

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Safe array access with fallbacks
  const directors = credits?.crew?.filter(person => person.job === 'Director') || [];
  const producers = credits?.crew?.filter(person => person.job === 'Producer') || [];
  const writers = credits?.crew?.filter(person => person.department === 'Writing') || [];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        {details.backdrop_path && (
          <Image
            src={tmdbImageUrl(details.backdrop_path, 'w780')}
            alt={details.title || 'Movie'}
            fill
            className="object-cover"
            priority
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              {/* Poster */}
              <div className="flex-shrink-0">
                {details.poster_path && (
                  <Image
                    src={tmdbImageUrl(details.poster_path, 'w500')}
                    alt={details.title || 'Movie'}
                    width={300}
                    height={450}
                    className="rounded-lg shadow-2xl"
                  />
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{details.title || 'Unknown Title'}</h1>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span>{details.vote_average?.toFixed(1) || 'N/A'}</span>
                    <span className="text-gray-400">({details.vote_count?.toLocaleString() || '0'})</span>
                  </div>
                  
                  <span>•</span>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{details.release_date ? new Date(details.release_date).getFullYear() : 'N/A'}</span>
                  </div>
                  
                  <span>•</span>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatRuntime(details.runtime)}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                    <Play className="h-5 w-5" />
                    Watch Now
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                    <Plus className="h-5 w-5" />
                    Add to List
                  </button>
                </div>
                
                {/* Overview */}
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                  {details.overview || 'No overview available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          {['overview', 'cast', 'crew'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-semibold text-lg transition-colors ${
                activeTab === tab
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Financial Info */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Financial Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Budget:</span>
                    <span className="text-white">{formatCurrency(details.budget || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Revenue:</span>
                    <span className="text-white">{formatCurrency(details.revenue || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white">{details.status || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              {/* Production Companies */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Production Companies</h3>
                <div className="space-y-2">
                  {details.production_companies && details.production_companies.length > 0 ? (
                    details.production_companies.map((company) => (
                      <div key={company.id} className="text-gray-300">
                        {company.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No production company information available.</p>
                  )}
                </div>
              </div>

              {/* Genres */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {details.genre_ids && details.genre_ids.length > 0 ? (
                    details.genre_ids.map((genreId) => (
                      <span
                        key={genreId}
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        Genre {genreId}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">No genre information available.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {credits?.cast && credits.cast.length > 0 ? (
                credits.cast.slice(0, 12).map((person) => (
                  <div key={person.id} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      {person.profile_path ? (
                        <Image
                          src={tmdbImageUrl(person.profile_path, 'w500')}
                          alt={person.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Photo</span>
                        </div>
                      )}
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1">{person.name}</h4>
                    <p className="text-gray-400 text-xs">{person.character}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No cast information available.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'crew' && (
            <div className="space-y-6">
              {directors.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Directors</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {directors.map((person) => (
                      <div key={person.id} className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-3">
                          {person.profile_path ? (
                            <Image
                              src={tmdbImageUrl(person.profile_path, 'w500')}
                              alt={person.name}
                              fill
                              className="object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Photo</span>
                            </div>
                          )}
                        </div>
                        <h4 className="text-white font-medium text-sm">{person.name}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {producers.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Producers</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {producers.map((person) => (
                      <div key={person.id} className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-3">
                          {person.profile_path ? (
                            <Image
                              src={tmdbImageUrl(person.profile_path, 'w500')}
                              alt={person.name}
                              fill
                              className="object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Photo</span>
                            </div>
                          )}
                        </div>
                        <h4 className="text-white font-medium text-sm">{person.name}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {directors.length === 0 && producers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No crew information available.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}