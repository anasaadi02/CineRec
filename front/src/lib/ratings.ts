const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface Rating {
  _id: string;
  user: string;
  movieId: number;
  mediaType: 'movie' | 'tv';
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface RateMediaData {
  movieId: number;
  mediaType: 'movie' | 'tv';
  rating: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
}

export interface RatingResponse {
  status: string;
  data: {
    rating: Rating | null;
  };
}

export interface RatingsResponse {
  status: string;
  results: number;
  data: {
    ratings: Rating[];
  };
}

class RatingsService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}/ratings${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async rateMedia(data: RateMediaData): Promise<RatingResponse> {
    return this.makeRequest<RatingResponse>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserRating(movieId: number, mediaType: 'movie' | 'tv'): Promise<RatingResponse> {
    return this.makeRequest<RatingResponse>(`/${movieId}?mediaType=${mediaType}`);
  }

  async removeRating(movieId: number, mediaType: 'movie' | 'tv'): Promise<{ status: string; data: null }> {
    return this.makeRequest<{ status: string; data: null }>(`/${movieId}?mediaType=${mediaType}`, {
      method: 'DELETE',
    });
  }

  async getUserRatings(): Promise<RatingsResponse> {
    return this.makeRequest<RatingsResponse>('');
  }
}

export const ratingsService = new RatingsService();
