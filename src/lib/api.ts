import axios from 'axios';
import { isTelegramWebApp, getTelegramInitData } from '@/lib/telegram';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Track if a Telegram re-auth is in progress to avoid loops
let isTelegramReAuthInProgress = false;

// Response interceptor for handling token expiry
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Telegram Mini App: try silent re-auth before redirecting
      if (isTelegramWebApp() && !originalRequest._telegramRetry && !isTelegramReAuthInProgress) {
        const initData = getTelegramInitData();
        if (initData) {
          originalRequest._telegramRetry = true;
          isTelegramReAuthInProgress = true;

          try {
            const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
            const reAuthResponse = await axios.post(`${baseURL}/auth/telegram`, { initData });
            const { token: newToken, user: userData } = reAuthResponse.data;

            if (newToken && userData) {
              // Update auth store dynamically (setAuth also sets localStorage)
              const { useAuthStore } = await import('@/store/authStore');
              useAuthStore.getState().setAuth(userData, newToken);

              // Retry the original request with the new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              isTelegramReAuthInProgress = false;
              return api(originalRequest);
            }
          } catch (reAuthError) {
            console.warn('Telegram silent re-auth failed:', reAuthError);
          } finally {
            isTelegramReAuthInProgress = false;
          }
        }
      }

      // Default 401 handling: clear auth and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Import auth store dynamically to avoid circular dependency
      import('@/store/authStore').then(({ useAuthStore }) => {
        const { logout } = useAuthStore.getState();
        logout();
      });

      // Redirect to login
      if (window.location.pathname !== '/auth/login') {
        console.warn('Session expired. Redirecting to login.');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
