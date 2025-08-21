'use client';

import { Clock, X } from 'lucide-react';
import { useSearchContext } from '@/contexts/SearchContext';

interface SearchHistoryProps {
  onSearchClick: (query: string) => void;
  maxItems?: number;
}

export default function SearchHistory({ onSearchClick, maxItems = 5 }: SearchHistoryProps) {
  const { searchQuery } = useSearchContext();

  // Mock search history - in a real app, this would come from localStorage or a backend
  const searchHistory = [
    'Avengers: Endgame',
    'Breaking Bad',
    'Inception',
    'Game of Thrones',
    'The Dark Knight',
    'Pulp Fiction'
  ].slice(0, maxItems);

  if ((searchQuery && searchQuery.trim()) || searchHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-300">Recent Searches</h3>
        </div>
        <button className="text-gray-500 hover:text-gray-400 text-xs">
          Clear All
        </button>
      </div>
      <div className="space-y-2">
        {searchHistory.map((search, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer group"
            onClick={() => onSearchClick(search)}
          >
            <span className="text-gray-300 text-sm truncate flex-1">{search}</span>
            <button
              className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                // Handle remove from history
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
