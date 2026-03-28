import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email?: string;
  avatar: string | null;
  steamAvatar?: string | null;
  steamId?: string | null;
  balance?: number;
  role?: string;
  phoneNumber?: string | null;
  tradeUrl?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isTokenValid: boolean;
  hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkTokenValidity: () => Promise<boolean>;
  updateUser: (user: Partial<User>) => void;
  fetchUserBalance: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

// Deduplication: prevent multiple concurrent calls
let _checkPromise: Promise<boolean> | null = null;
let _balancePromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isTokenValid: true,
      hasHydrated: false,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({ user, token, isTokenValid: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        set({ user: null, token: null, isTokenValid: false });
      },
      checkTokenValidity: async () => {
        // Deduplicate: if already in-flight, return the same promise
        if (_checkPromise) return _checkPromise;

        const { token } = get();
        if (!token) {
          set({ isTokenValid: false });
          return false;
        }

        _checkPromise = (async () => {
          try {
            const { default: api } = await import('@/lib/api');
            const response = await api.get('/users/profile');

            if (response.data) {
              const currentUser = get().user;
              const updatedUser = {
                ...response.data,
                steamAvatar: response.data.steamAvatar || currentUser?.steamAvatar || null,
                steamId: response.data.steamId || currentUser?.steamId || null,
              };

              set({ user: updatedUser, isTokenValid: true });
              return true;
            }
          } catch (error: any) {
            if (error.response?.status === 401) {
              get().logout();
              set({ isTokenValid: false });
              return false;
            }
          }
          return true;
        })();

        try {
          return await _checkPromise;
        } finally {
          _checkPromise = null;
        }
      },
      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
      fetchUserBalance: async () => {
        if (_balancePromise) return _balancePromise;

        const { token, user } = get();
        if (!token || !user) return;

        _balancePromise = (async () => {
          try {
            const { default: api } = await import('@/lib/api');
            const response = await api.get('/users/balance');

            if (response.data && typeof response.data.balance === 'number') {
              const currentUser = get().user;
              if (currentUser) {
                set({ user: { ...currentUser, balance: response.data.balance } });
              }
            }
          } catch (error: any) {
            console.error('Failed to fetch user balance:', error);
          }
        })();

        try {
          await _balancePromise;
        } finally {
          _balancePromise = null;
        }
      },
      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
