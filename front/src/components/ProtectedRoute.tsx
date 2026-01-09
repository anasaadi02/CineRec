'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Lock, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, show login/register prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center">
                  <Lock className="h-10 w-10 text-red-500" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-white mb-3">
                Authentication Required
              </h1>
              
              {/* Description */}
              <p className="text-gray-400 mb-8 text-lg">
                Please sign in or create an account to access this feature.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/auth/signin"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/auth/signup"
                  className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Additional Info */}
              <p className="text-gray-500 text-sm mt-6">
                Don't have an account? Signing up is free and takes less than a minute.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}
