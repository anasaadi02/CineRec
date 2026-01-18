'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TMDBPersonDetails, TMDBPersonCredits, getPersonDetails, getPersonCredits } from '@/lib/tmdb';
import PersonDetailsContent from '@/components/PersonDetailsContent';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function PersonPage() {
  const params = useParams();
  const personId = parseInt(params.id as string);
  const [details, setDetails] = useState<TMDBPersonDetails | null>(null);
  const [credits, setCredits] = useState<TMDBPersonCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [personDetails, personCredits] = await Promise.all([
          getPersonDetails(personId),
          getPersonCredits(personId),
        ]);
        setDetails(personDetails);
        setCredits(personCredits);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load person details');
      } finally {
        setLoading(false);
      }
    };

    if (personId) {
      fetchData();
    }
  }, [personId]);

  if (loading) return <LoadingSpinner />;
  if (error || !details) return <ErrorDisplay message={error || 'Failed to load person details'} />;

  return <PersonDetailsContent details={details} credits={credits || { cast: [], crew: [] }} />;
}
