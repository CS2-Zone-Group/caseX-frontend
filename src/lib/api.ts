import axios from 'axios';

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

// Response interceptor for handling token expiry
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Import auth store dynamically to avoid circular dependency
        import('@/store/authStore').then(({ useAuthStore }) => {
          const { logout } = useAuthStore.getState();
          logout();
        });

        // Show notification
        if (window.location.pathname !== '/auth/login') {
          alert('Your session has expired. Please login again.');
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
