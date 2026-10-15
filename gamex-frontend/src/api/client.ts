import axios from 'axios';

export const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1`,
  withCredentials: true,          // httpOnly cookie for JWT
  headers: { 'Content-Type': 'application/json' },
});

// Auto-redirect to login on 401
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);
