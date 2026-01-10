'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  List, 
  Star, 
  Heart, 
  Eye, 
  Edit2,
  Shield,
  LogOut,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'lists'>('overview');

  if (!user) {
    return null;
  }

  // Calculate account age (mock data for now)
  const accountCreated = new Date(); // This should come from user data
  const accountAge = Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));

  // Mock statistics (these should come from backend)
  const stats = {
    moviesWatched: 0,
    reviewsWritten: 0,
    watchlistItems: 0,
    favoriteMovies: 0,
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'lists', label: 'My Lists', icon: List },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member for {accountAge} days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Verified Account</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 pb-4 px-1 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-500'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Statistics */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-900 rounded-lg p-4 text-center">
                        <Eye className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.moviesWatched}</div>
                        <div className="text-sm text-gray-400">Movies Watched</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 text-center">
                        <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.reviewsWritten}</div>
                        <div className="text-sm text-gray-400">Reviews Written</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 text-center">
                        <List className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.watchlistItems}</div>
                        <div className="text-sm text-gray-400">Watchlist Items</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 text-center">
                        <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.favoriteMovies}</div>
                        <div className="text-sm text-gray-400">Favorites</div>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300">Full Name</span>
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300">Email Address</span>
                        </div>
                        <span className="text-white font-medium">{user.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300">Account Type</span>
                        </div>
                        <span className="text-white font-medium">Standard</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300">Member Since</span>
                        </div>
                        <span className="text-white font-medium">
                          {accountCreated.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Profile Settings */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Profile Settings</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter your display name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          disabled
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                      <button className="w-full md:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Privacy Settings</h2>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-gray-300 font-medium">Public Profile</span>
                          <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                        </div>
                        <input type="checkbox" className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-900" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-gray-300 font-medium">Show Watchlist</span>
                          <p className="text-sm text-gray-500">Allow others to see your watchlist</p>
                        </div>
                        <input type="checkbox" className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-900" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-gray-300 font-medium">Show Reviews</span>
                          <p className="text-sm text-gray-500">Make your reviews public</p>
                        </div>
                        <input type="checkbox" className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-900" defaultChecked />
                      </label>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Notification Preferences</h2>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-gray-300 font-medium">Email Notifications</span>
                          <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                        <input type="checkbox" className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-900" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-gray-300 font-medium">New Releases</span>
                          <p className="text-sm text-gray-500">Get notified about new movies and shows</p>
                        </div>
                        <input type="checkbox" className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-900" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-gray-300 font-medium">Recommendations</span>
                          <p className="text-sm text-gray-500">Receive personalized recommendations</p>
                        </div>
                        <input type="checkbox" className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-900" defaultChecked />
                      </label>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Account Actions</h2>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors text-left">
                        <div>
                          <span className="text-gray-300 font-medium block">Change Password</span>
                          <span className="text-sm text-gray-500">Update your account password</span>
                        </div>
                        <Settings className="h-5 w-5 text-gray-400" />
                      </button>
                      <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors text-left">
                        <div>
                          <span className="text-red-400 font-medium block">Delete Account</span>
                          <span className="text-sm text-gray-500">Permanently delete your account and data</span>
                        </div>
                        <LogOut className="h-5 w-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lists' && (
                <div className="space-y-6">
                  {/* Quick Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/watchlist"
                      className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <List className="h-8 w-8 text-blue-500" />
                        <span className="text-gray-400 group-hover:text-white transition-colors">
                          {stats.watchlistItems} items
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">My Watchlist</h3>
                      <p className="text-gray-400 text-sm">Movies and shows you want to watch</p>
                    </Link>

                    <Link
                      href="/reviews"
                      className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Star className="h-8 w-8 text-yellow-500" />
                        <span className="text-gray-400 group-hover:text-white transition-colors">
                          {stats.reviewsWritten} reviews
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">My Reviews</h3>
                      <p className="text-gray-400 text-sm">Your movie and TV show reviews</p>
                    </Link>
                  </div>

                  {/* Favorites */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white">Favorite Movies</h2>
                      <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No favorite movies yet</p>
                      <p className="text-gray-500 text-sm mt-2">Start adding movies to your favorites!</p>
                    </div>
                  </div>

                  {/* Recently Watched */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white">Recently Watched</h2>
                      <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    <div className="text-center py-12">
                      <Eye className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No recently watched items</p>
                      <p className="text-gray-500 text-sm mt-2">Your viewing history will appear here</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    href="/watchlist"
                    className="flex items-center space-x-3 px-4 py-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <List className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-300">View Watchlist</span>
                  </Link>
                  <Link
                    href="/reviews"
                    className="flex items-center space-x-3 px-4 py-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-300">My Reviews</span>
                  </Link>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Account Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Password</span>
                    <span className="text-green-400 text-sm flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Set</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Two-Factor Auth</span>
                    <span className="text-gray-500 text-sm">Not enabled</span>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm">
                    Manage Security
                  </button>
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-300 text-sm">Google</span>
                    </div>
                    <span className="text-green-400 text-sm flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Connected</span>
                    </span>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm">
                    Manage Connections
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
