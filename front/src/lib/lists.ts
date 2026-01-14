const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface MovieItem {
  movieId: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
  addedAt: string;
}

export interface List {
  _id: string;
  name: string;
  user: string;
  movies: MovieItem[];
  isDefault: boolean;
  listType?: 'watchlist' | 'liked' | 'rated' | 'custom';
  createdAt: string;
  updatedAt: string;
}

export interface CreateListData {
  name: string;
}

export interface AddMovieData {
  movieId: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
}

export interface ListsResponse {
  status: string;
  results?: number;
  data: {
    lists: List[];
  };
}

export interface ListResponse {
  status: string;
  data: {
    list: List;
  };
}

class ListsService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = 'Something went wrong';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Handle 204 No Content responses (no body)
      if (response.status === 204) {
        return undefined as any;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please make sure the backend is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getAllLists(): Promise<ListsResponse> {
    return this.makeRequest<ListsResponse>('/lists', {
      method: 'GET',
    });
  }

  async getList(listId: string): Promise<ListResponse> {
    return this.makeRequest<ListResponse>(`/lists/${listId}`, {
      method: 'GET',
    });
  }

  async getListByType(type: 'watchlist' | 'liked' | 'rated'): Promise<ListResponse> {
    return this.makeRequest<ListResponse>(`/lists/type/${type}`, {
      method: 'GET',
    });
  }

  async createList(data: CreateListData): Promise<ListResponse> {
    return this.makeRequest<ListResponse>('/lists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateList(listId: string, name: string): Promise<ListResponse> {
    return this.makeRequest<ListResponse>(`/lists/${listId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  }

  async deleteList(listId: string): Promise<void> {
    return this.makeRequest<void>(`/lists/${listId}`, {
      method: 'DELETE',
    });
  }

  async addMovieToList(listId: string, movieData: AddMovieData): Promise<ListResponse> {
    return this.makeRequest<ListResponse>(`/lists/${listId}/movies`, {
      method: 'POST',
      body: JSON.stringify(movieData),
    });
  }

  async removeMovieFromList(listId: string, movieId: number): Promise<ListResponse> {
    return this.makeRequest<ListResponse>(`/lists/${listId}/movies/${movieId}`, {
      method: 'DELETE',
    });
  }
}

export const listsService = new ListsService();
export default listsService;
