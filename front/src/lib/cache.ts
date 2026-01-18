// Simple in-memory cache for API responses
// In production, consider using Redis or a more robust caching solution

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Default TTL: 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const apiCache = new SimpleCache();

// Cleanup expired entries every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 10 * 60 * 1000);
}

// Cache key generators
export const getCacheKey = {
  movies: (category: string, page: number, genres?: number[]) => 
    `movies:${category}:${page}:${genres?.join(',') || 'all'}`,
  tvShows: (category: string, page: number, genres?: number[]) => 
    `tv:${category}:${page}:${genres?.join(',') || 'all'}`,
  search: (query: string, page: number) => 
    `search:${query.toLowerCase()}:${page}`,
  genres: () => 'genres:all',
  featuredMovie: () => 'featured:movie',
  movieDetails: (id: number) => `movie:${id}`,
  tvDetails: (id: number) => `tv:${id}`,
  personDetails: (id: number) => `person:${id}`,
  personCredits: (id: number) => `person:${id}:credits`,
};
