'use client';

import { useEffect, useState } from 'react';
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
  const { user, token, checkTokenValidity } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token || !user) {
        setIsAuthenticated(false);
        setIsChecking(false);
        
        if (requireAuth) {
          router.push(redirectTo);
        }
        return;
      }

      // Check if token is still valid
      const isValid = await checkTokenValidity();
      setIsAuthenticated(isValid);
      setIsChecking(false);

      if (requireAuth && !isValid) {
        router.push(redirectTo);
      }
    };

    checkAuth();
  }, [token, user, requireAuth, redirectTo, router, checkTokenValidity]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}