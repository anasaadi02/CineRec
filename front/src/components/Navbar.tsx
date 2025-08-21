'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchContext } from '@/contexts/SearchContext';
import SearchInput from './SearchInput';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearchContext();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when route changes
  useEffect(() => {
    setIsProfileDropdownOpen(false);
  }, [router]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <SearchInput
              className="w-64"
              onSearch={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
            />
            
            {isAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                >
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <Link 
                      href="/profile" 
                      className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
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
                <div className="mb-3">
                  <SearchInput
                    variant="mobile"
                    onSearch={(query) => {
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                      setIsMenuOpen(false);
                    }}
                  />
                </div>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link 
                      href="/profile" 
                      className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-lg"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-lg"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={signOut}
                      className="flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 transition-colors px-4 py-2 rounded-lg hover:bg-gray-700 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      href="/auth/signin" 
                      className="block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium transition-colors w-full text-center"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      className="block border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors w-full text-center"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}