'use client';

import { useSearch } from '@/hooks/useSearch';

export default function SearchDebug() {
  const searchState = useSearch();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Search Debug</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(searchState, null, 2)}
      </pre>
    </div>
  );
}

