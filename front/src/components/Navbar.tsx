'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, User } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-red-500">
              CineRec
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="hover:text-red-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/movies" className="hover:text-red-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Movies
              </Link>
              <Link href="/series" className="hover:text-red-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                TV Series
              </Link>
              <Link href="/watchlist" className="hover:text-red-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                My Watchlist
              </Link>
              <Link href="/reviews" className="hover:text-red-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Reviews
              </Link>
            </div>
          </div>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies, series..."
                className="bg-gray-800 text-white placeholder-gray-400 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
              Sign In
            </button>
            <User className="h-6 w-6 cursor-pointer hover:text-red-400 transition-colors" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-red-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 rounded-lg mt-2">
              <Link href="/" className="block hover:text-red-400 transition-colors px-3 py-2 rounded-md text-base font-medium">
                Home
              </Link>
              <Link href="/movies" className="block hover:text-red-400 transition-colors px-3 py-2 rounded-md text-base font-medium">
                Movies
              </Link>
              <Link href="/series" className="block hover:text-red-400 transition-colors px-3 py-2 rounded-md text-base font-medium">
                TV Series
              </Link>
              <Link href="/watchlist" className="block hover:text-red-400 transition-colors px-3 py-2 rounded-md text-base font-medium">
                My Watchlist
              </Link>
              <Link href="/reviews" className="block hover:text-red-400 transition-colors px-3 py-2 rounded-md text-base font-medium">
                Reviews
              </Link>
              <div className="border-t border-gray-700 pt-4">
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search movies, series..."
                    className="bg-gray-700 text-white placeholder-gray-400 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium transition-colors w-full">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}