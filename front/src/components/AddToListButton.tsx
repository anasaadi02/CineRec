'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Loader2, Check, List as ListIcon } from 'lucide-react';
import { listsService, List } from '@/lib/lists';
import { useAuth } from '@/hooks/useAuth';

interface AddToListButtonProps {
  movieId: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
  onAdd?: () => void;
}

export default function AddToListButton({ 
  movieId, 
  title, 
  posterPath, 
  releaseDate,
  onAdd 
}: AddToListButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingToListId, setAddingToListId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadLists();
    }
  }, [isOpen, isAuthenticated]);

  const loadLists = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await listsService.getAllLists();
      setLists(response.data.lists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lists');
      console.error('Error loading lists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToList = async (listId: string) => {
    try {
      setAddingToListId(listId);
      setError('');
      await listsService.addMovieToList(listId, {
        movieId,
        title,
        posterPath,
        releaseDate
      });
      
      // Update the list to show the movie is added
      const updatedLists = lists.map(list => {
        if (list._id === listId) {
          return {
            ...list,
            movies: [...list.movies, {
              movieId,
              title,
              posterPath,
              releaseDate,
              addedAt: new Date().toISOString()
            }]
          };
        }
        return list;
      });
      setLists(updatedLists);
      
      if (onAdd) {
        onAdd();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add movie to list');
    } finally {
      setAddingToListId(null);
    }
  };

  const isMovieInList = (list: List): boolean => {
    return list.movies.some(movie => movie.movieId === movieId);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
      >
        <Plus className="h-5 w-5" />
        Add to List
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Add to List</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                <span className="ml-2 text-gray-400">Loading lists...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {lists.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No lists found. Create a list first.
                  </p>
                ) : (
                  lists.map((list) => {
                    const isInList = isMovieInList(list);
                    const isAdding = addingToListId === list._id;

                    return (
                      <button
                        key={list._id}
                        onClick={() => !isInList && handleAddToList(list._id)}
                        disabled={isInList || isAdding}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isInList
                            ? 'bg-green-900/20 border border-green-500/50 cursor-not-allowed'
                            : isAdding
                            ? 'bg-gray-700 cursor-wait'
                            : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <ListIcon className="h-5 w-5 text-gray-400" />
                          <div className="text-left">
                            <div className="text-white font-medium">{list.name}</div>
                            <div className="text-gray-400 text-sm">
                              {list.movies.length} {list.movies.length === 1 ? 'movie' : 'movies'}
                            </div>
                          </div>
                        </div>
                        {isInList ? (
                          <Check className="h-5 w-5 text-green-400" />
                        ) : isAdding ? (
                          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                        ) : (
                          <Plus className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
