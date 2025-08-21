'use client';

import { Search, Clock, TrendingUp } from 'lucide-react';
import { useSearchContext } from '@/contexts/SearchContext';
import SearchHistory from './SearchHistory';

interface SearchSuggestionsProps {
  onSuggestionClick: (query: string) => void;
}

const popularSearches = [
  'Marvel', 'Star Wars', 'Harry Potter', 'Lord of the Rings',
  'Game of Thrones', 'Breaking Bad', 'Friends', 'The Office',
  'Inception', 'The Dark Knight', 'Pulp Fiction', 'Forrest Gump'
];

export default function SearchSuggestions({ onSuggestionClick }: SearchSuggestionsProps) {
  const { searchQuery } = useSearchContext();

  if (searchQuery && searchQuery.trim()) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Search History */}
      <SearchHistory onSearchClick={onSuggestionClick} />

      {/* Popular Searches */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-300">Popular Searches</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(search)}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors text-left hover:bg-red-600 hover:text-white"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Search Tips */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Search Tips</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Use specific titles for better results</li>
          <li>• Try actor or director names</li>
          <li>• Search by genre or year</li>
          <li>• Use quotes for exact phrases</li>
        </ul>
      </div>
    </div>
  );
}
