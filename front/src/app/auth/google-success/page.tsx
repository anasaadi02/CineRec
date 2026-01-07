'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function GoogleSuccess() {
  const router = useRouter();
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Check authentication status after Google OAuth redirect
    const handleAuth = async () => {
      try {
        await checkAuth();
        // Redirect to home after successful authentication
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/signin?error=google_auth_failed');
      }
    };

    handleAuth();
  }, [checkAuth, router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Signing you in...</h2>
        <p className="text-gray-400">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}
