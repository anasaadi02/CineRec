'use client';

import { useParams } from 'next/navigation';
import { useMediaDetails } from '@/hooks/useMediaDetails';
import MovieDetailsContent from '@/components/MovieDetailsContent';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function MoviePage() {
    const params = useParams();
    const movieId = parseInt(params.id as string);
    const { details, credits, loading, error } = useMediaDetails(movieId, 'movie');

    if (loading) return <LoadingSpinner />;
    if (error || !details) return <ErrorDisplay message={error || 'Failed to load movie details'} />;

    return <MovieDetailsContent details={details} credits={credits} />;
}