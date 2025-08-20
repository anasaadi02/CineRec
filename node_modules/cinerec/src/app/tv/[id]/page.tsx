'use client';

import { useParams } from 'next/navigation';
import { useMediaDetails } from '@/hooks/useMediaDetails';
import TVShowDetailsContent from '@/components/TVShowDetailsContent';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function TVShowPage() {
  const params = useParams();
  const tvId = parseInt(params.id as string);
  const { details, credits, loading, error } = useMediaDetails(tvId, 'tv');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !details) {
    return <ErrorDisplay error={error || 'TV Show not found'} />;
  }

  return <TVShowDetailsContent details={details} credits={credits} />;
}