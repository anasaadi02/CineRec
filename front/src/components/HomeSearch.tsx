'use client';

import { Search, Film, Tv } from 'lucide-react';
import SearchInput from './SearchInput';
import { useRouter } from 'next/navigation';

export default function HomeSearch() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Amazing Content
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Search through thousands of movies and TV shows. Find your next favorite entertainment.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchInput
            onSearch={handleSearch}
            className="w-full"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-3 text-gray-300">
            <Film className="h-6 w-6 text-red-500" />
            <span className="text-sm">Movies</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-300">
            <Tv className="h-6 w-6 text-blue-500" />
            <span className="text-sm">TV Shows</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-300">
            <Search className="h-6 w-6 text-green-500" />
            <span className="text-sm">Instant Search</span>
          </div>
        </div>
      </div>
    </section>
  );
}

