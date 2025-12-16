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
        const { token } = get();
        if (!token) {
          set({ isTokenValid: false });
          return false;
        }

        try {
          // Import api dynamically to avoid circular dependency
          const { default: api } = await import('@/lib/api');
          const response = await api.get('/users/profile');
          
          if (response.data) {
            // Update user data if token is valid
            set({ 
              user: response.data, 
              isTokenValid: true 
            });
            return true;
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            // Token is invalid, logout
            get().logout();
            set({ isTokenValid: false });
            return false;
          }
        }
        
        return true;
      },
      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
      fetchUserBalance: async () => {
        const { token, user } = get();
        if (!token || !user) return;

        try {
          // Import api dynamically to avoid circular dependency
          const { default: api } = await import('@/lib/api');
          const response = await api.get('/users/balance');
          
          if (response.data && typeof response.data.balance === 'number') {
            // Update user balance
            const currentUser = get().user; // Get fresh user state
            if (currentUser) {
              set({ 
                user: { ...currentUser, balance: response.data.balance }
              });
            }
          }
        } catch (error: any) {
          console.error('Failed to fetch user balance:', error);
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
