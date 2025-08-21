'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import SearchResultsSkeleton from './SearchResultsSkeleton';

// Dynamically import SearchResults to avoid SSR issues
const SearchResults = dynamic(() => import('./SearchResults'), {
  ssr: false,
  loading: () => <SearchResultsSkeleton />
});

export default function SearchResultsWrapper() {
  return (
    <Suspense fallback={<SearchResultsSkeleton />}>
      <SearchResults />
    </Suspense>
  );
}

