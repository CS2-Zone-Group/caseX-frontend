'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/auth/login'
}: AuthGuardProps) {
  const router = useRouter();
  const { user, token, hasHydrated } = useAuthStore();

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    if (!hasHydrated) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Background token validity check — don't block render
    if (isAuthenticated) {
      const { checkTokenValidity } = useAuthStore.getState();
      checkTokenValidity().then((isValid) => {
        if (!isValid && requireAuth) {
          router.push(redirectTo);
        }
      });
    }
  }, [hasHydrated, isAuthenticated, requireAuth, redirectTo]);

  // Wait only for Zustand hydration (instant from localStorage), not API calls
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
