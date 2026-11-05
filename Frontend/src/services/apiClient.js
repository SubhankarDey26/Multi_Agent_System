import axios from 'axios';

/**
 * Shared API Client
 * Configured with environment variables and prepared for backend microservices integration.
 */
const baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor for auth token injection
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cortex_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with unified error formatting
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected API error occurred',
      status: error.response?.status || 500,
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      isOffline: !navigator.onLine,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
