'use client';

import { Search } from 'lucide-react';
import { useSearchContext } from '@/contexts/SearchContext';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  variant?: 'desktop' | 'mobile';
}

export default function SearchInput({ 
  placeholder = "Search movies, series...", 
  className = "", 
  onSearch,
  variant = 'desktop'
}: SearchInputProps) {
  const { searchQuery, setSearchQuery } = useSearchContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const bgColor = variant === 'mobile' ? 'bg-gray-700' : 'bg-gray-800';

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery || ''}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`${bgColor} text-white placeholder-gray-400 rounded-full py-2 pl-10 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200`}
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

    </form>
  );
}
