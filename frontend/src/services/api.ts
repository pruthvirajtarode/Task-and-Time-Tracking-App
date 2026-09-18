import axios from 'axios';

const isDev = import.meta.env.DEV;
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:5000/api' : 'https://task-and-time-tracking-app-o717.vercel.app/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors like 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:logout'));
    }
    const errData = error.response?.data;
    const errorMessage = errData?.error?.message || errData?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
