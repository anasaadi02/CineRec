'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Film, Tv, Star } from 'lucide-react';
import { TMDBPersonDetails, TMDBPersonCredits, tmdbImageUrl } from '@/lib/tmdb';
import Navbar from './Navbar';
import Footer from './Footer';

interface PersonDetailsContentProps {
  details: TMDBPersonDetails;
  credits: TMDBPersonCredits;
}

export default function PersonDetailsContent({ details, credits }: PersonDetailsContentProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthday: string | null, deathday: string | null) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const age = calculateAge(details.birthday, details.deathday);
  const allCredits = [...credits.cast, ...credits.crew]
    .filter((credit, index, self) => 
      index === self.findIndex((c) => c.id === credit.id && c.media_type === credit.media_type)
    )
    .sort((a, b) => {
      const dateA = (a.release_date && a.release_date.length > 0) ? new Date(a.release_date).getTime() : 0;
      const dateB = (b.release_date && b.release_date.length > 0) ? new Date(b.release_date).getTime() : 0;
      return dateB - dateA;
    });

  const knownFor = allCredits
    .filter((credit) => credit.vote_average > 7 && credit.vote_average > 0)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {details.profile_path ? (
                <Image
                  src={tmdbImageUrl(details.profile_path, 'w500')}
                  alt={details.name}
                  width={300}
                  height={450}
                  className="rounded-lg shadow-2xl object-cover"
                />
              ) : (
                <div className="w-[300px] h-[450px] bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Photo</span>
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{details.name}</h1>
              
              {/* Meta Info */}
              <div className="space-y-3 mb-6">
                {details.birthday && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-5 w-5" />
                    <span>
                      Born: {formatDate(details.birthday)}
                      {age !== null && ` (${age} years old${details.deathday ? ' at death' : ''})`}
                    </span>
                  </div>
                )}
                
                {details.deathday && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-5 w-5" />
                    <span>Died: {formatDate(details.deathday)}</span>
                  </div>
                )}
                
                {details.place_of_birth && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="h-5 w-5" />
                    <span>{details.place_of_birth}</span>
                  </div>
                )}
                
                {details.known_for_department && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Film className="h-5 w-5" />
                    <span>Known for: {details.known_for_department}</span>
                  </div>
                )}
              </div>
              
              {/* Biography */}
              {details.biography && (
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-3">Biography</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {details.biography}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Known For */}
        {knownFor.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Known For</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {knownFor.map((credit) => (
                <Link
                  key={`${credit.id}-${credit.media_type}`}
                  href={`/${credit.media_type}/${credit.id}`}
                  className="group"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                    {credit.poster_path ? (
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={tmdbImageUrl(credit.poster_path)}
                          alt={credit.title || 'Movie or TV show poster'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                        {credit.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{credit.character || credit.job}</span>
                        {credit.vote_average > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{credit.vote_average.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filmography */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Filmography</h2>
          
          {/* Cast Credits */}
          {credits.cast.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Acting Credits ({credits.cast.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {credits.cast.slice(0, 18).map((credit) => (
                  <Link
                    key={`${credit.id}-${credit.media_type}`}
                    href={`/${credit.media_type}/${credit.id}`}
                    className="group"
                  >
                    <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                      {credit.poster_path ? (
                        <div className="relative aspect-[2/3]">
                          <Image
                            src={tmdbImageUrl(credit.poster_path)}
                            alt={credit.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                          {credit.title}
                        </h3>
                        <p className="text-gray-400 text-xs mb-1">{credit.character}</p>
                        {credit.release_date && credit.release_date.length > 0 && (
                          <p className="text-gray-500 text-xs">
                            {new Date(credit.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Crew Credits */}
          {credits.crew.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Production Credits ({credits.crew.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {credits.crew.slice(0, 18).map((credit) => (
                  <Link
                    key={`${credit.id}-${credit.media_type}-${credit.job}`}
                    href={`/${credit.media_type}/${credit.id}`}
                    className="group"
                  >
                    <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                      {credit.poster_path ? (
                        <div className="relative aspect-[2/3]">
                          <Image
                            src={tmdbImageUrl(credit.poster_path)}
                            alt={credit.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                          {credit.title}
                        </h3>
                        <p className="text-gray-400 text-xs mb-1">{credit.job}</p>
                        {credit.release_date && (
                          <p className="text-gray-500 text-xs">
                            {new Date(credit.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
