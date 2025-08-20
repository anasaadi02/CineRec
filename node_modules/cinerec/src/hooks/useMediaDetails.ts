'use client';

import { useState, useEffect } from 'react';
import {TMDBMovieDetails, TMDBTVShowDetails, TMDBCredits} from '@/lib/tmdb';

interface UseMediaDetailsReturn {
    details: TMDBMovieDetails | TMDBTVShowDetails | null;
    credits: TMDBCredits | null;
    loading: boolean;
    error: string | null;
}

export const useMediaDetails = (
    mediaId: number,
    mediaType: 'movie' | 'tv'
): UseMediaDetailsReturn => {
    const [details, setDetails] = useState<TMDBMovieDetails | TMDBTVShowDetails | null>(null);
    const [credits, setCredits] = useState<TMDBCredits | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const { getMovieDetails, getTVShowDetails, getMovieCredits, getTVShowCredits } = await import('@/lib/tmdb');

                if (mediaType === 'movie') {
                    const [movieDetails, movieCredits] = await Promise.all([
                        getMovieDetails(mediaId),
                        getMovieCredits(mediaId)
                    ]);
                    setDetails(movieDetails);
                    setCredits(movieCredits);
                } else {
                    const [tvDetails, tvCredits] = await Promise.all([
                        getTVShowDetails(mediaId),
                        getTVShowCredits(mediaId)
                    ]);
                    setDetails(tvDetails);
                    setCredits(tvCredits);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };  

        if (mediaId) {
            fetchDetails();
        }
    }, [mediaId, mediaType]);

    return { details, credits, loading, error };
};