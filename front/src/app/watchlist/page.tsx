'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WatchlistPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-8">My Watchlist</h1>
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">Your watchlist will appear here.</p>
            <p className="text-gray-500 text-sm mt-2">Start adding movies and TV shows to your watchlist!</p>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
