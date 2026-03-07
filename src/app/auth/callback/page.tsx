'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('Authentication error:', error);
        alert('Authentication failed. Please try again.');
        router.push('/auth/login');
        return;
      }

      if (token) {
        try {
          // Store token in localStorage for axios interceptor
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }

          // Fetch user profile with the new token
          const { default: api } = await import('@/lib/api');
          const response = await api.get('/users/profile');

          if (response.data) {
            setAuth(response.data, token);
            router.push('/marketplace');
          } else {
            throw new Error('Token validation failed');
          }
        } catch (error) {
          console.error('Error processing authentication:', error);
          if (typeof window !== 'undefined') localStorage.removeItem('token');
          router.push('/auth/login?error=auth_failed');
        }
      } else {
        console.error('No token received');
        alert('Authentication failed. No token received.');
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [searchParams, setAuth, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Processing Authentication...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}