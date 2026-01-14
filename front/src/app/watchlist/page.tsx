'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  List as ListIcon,
  Film,
  Star,
  Heart,
  Bookmark
} from 'lucide-react';
import { listsService, List, MovieItem } from '@/lib/lists';
import Image from 'next/image';
import Link from 'next/link';
import { tmdbImageUrl } from '@/lib/tmdb';

export default function MyListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await listsService.getAllLists();
      setLists(response.data.lists);
      // Select the first list by default
      if (response.data.lists.length > 0 && !selectedList) {
        setSelectedList(response.data.lists[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lists');
      console.error('Error loading lists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      setIsCreatingList(true);
      setError('');
      const response = await listsService.createList({ name: newListName.trim() });
      setLists([...lists, response.data.list]);
      setSelectedList(response.data.list);
      setNewListName('');
      setIsCreatingList(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create list');
      setIsCreatingList(false);
    }
  };

  const handleUpdateList = async (listId: string) => {
    if (!editingListName.trim()) {
      setEditingListId(null);
      return;
    }

    try {
      setError('');
      const response = await listsService.updateList(listId, editingListName.trim());
      setLists(lists.map(list => list._id === listId ? response.data.list : list));
      if (selectedList?._id === listId) {
        setSelectedList(response.data.list);
      }
      setEditingListId(null);
      setEditingListName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update list');
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
      return;
    }

    try {
      setError('');
      await listsService.deleteList(listId);
      const updatedLists = lists.filter(list => list._id !== listId);
      setLists(updatedLists);
      if (selectedList?._id === listId) {
        setSelectedList(updatedLists.length > 0 ? updatedLists[0] : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete list');
    }
  };

  const handleRemoveMovie = async (listId: string, movieId: number) => {
    try {
      setError('');
      const response = await listsService.removeMovieFromList(listId, movieId);
      setLists(lists.map(list => list._id === listId ? response.data.list : list));
      if (selectedList?._id === listId) {
        setSelectedList(response.data.list);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove movie');
    }
  };

  const getListIcon = (listType?: string) => {
    switch (listType) {
      case 'watchlist':
        return <Bookmark className="h-5 w-5" />;
      case 'liked':
        return <Heart className="h-5 w-5" />;
      case 'rated':
        return <Star className="h-5 w-5" />;
      default:
        return <ListIcon className="h-5 w-5" />;
    }
  };

  const MovieCard = ({ movie, listId }: { movie: MovieItem; listId: string }) => {
    return (
      <Link href={`/movie/${movie.movieId}`}>
        <div className="group relative bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
          <div className="relative aspect-[2/3] overflow-hidden">
            {movie.posterPath ? (
              <Image
                src={tmdbImageUrl(movie.posterPath)}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <Film className="h-12 w-12 text-gray-500" />
              </div>
            )}
          </div>
          
          <div className="p-3">
            <h3 className="text-white font-semibold text-sm mb-1 truncate">{movie.title}</h3>
            {movie.releaseDate && (
              <p className="text-gray-400 text-xs">
                {new Date(movie.releaseDate).getFullYear()}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">My Lists</h1>
            <button
              onClick={() => setIsCreatingList(true)}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New List</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {/* Create List Modal */}
          {isCreatingList && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Create New List</h2>
                  <button
                    onClick={() => {
                      setIsCreatingList(false);
                      setNewListName('');
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateList}>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="List name"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                    autoFocus
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={!newListName.trim()}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingList(false);
                        setNewListName('');
                      }}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-red-500" />
              <span className="ml-2 text-gray-400">Loading lists...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Lists Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-white mb-4">Your Lists</h2>
                  <div className="space-y-2">
                    {lists.map((list) => (
                      <div
                        key={list._id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedList?._id === list._id
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                        onClick={() => setSelectedList(list)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {getListIcon(list.listType)}
                            {editingListId === list._id ? (
                              <input
                                type="text"
                                value={editingListName}
                                onChange={(e) => setEditingListName(e.target.value)}
                                onBlur={() => handleUpdateList(list._id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateList(list._id);
                                  } else if (e.key === 'Escape') {
                                    setEditingListId(null);
                                    setEditingListName('');
                                  }
                                }}
                                className="flex-1 bg-gray-800 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span className="font-medium truncate">{list.name}</span>
                            )}
                            <span className="text-xs opacity-75">
                              ({list.movies.length})
                            </span>
                          </div>
                          {!list.isDefault && (
                            <div className="flex items-center space-x-1 ml-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setEditingListId(list._id);
                                  setEditingListName(list.name);
                                }}
                                className="p-1 hover:bg-gray-500 rounded transition-colors"
                                title="Edit list name"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteList(list._id)}
                                className="p-1 hover:bg-red-700 rounded transition-colors"
                                title="Delete list"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected List Content */}
              <div className="lg:col-span-3">
                {selectedList ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        {getListIcon(selectedList.listType)}
                        <h2 className="text-2xl font-bold text-white">{selectedList.name}</h2>
                        <span className="text-gray-400">
                          {selectedList.movies.length} {selectedList.movies.length === 1 ? 'movie' : 'movies'}
                        </span>
                      </div>
                    </div>

                    {selectedList.movies.length === 0 ? (
                      <div className="bg-gray-800 rounded-lg p-12 text-center">
                        <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-2">This list is empty</p>
                        <p className="text-gray-500 text-sm">
                          Add movies to this list from movie pages or search results
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {selectedList.movies.map((movie) => (
                          <MovieCard key={movie.movieId} movie={movie} listId={selectedList._id} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-12 text-center">
                    <ListIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-2">No list selected</p>
                    <p className="text-gray-500 text-sm">
                      Select a list from the sidebar or create a new one
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
