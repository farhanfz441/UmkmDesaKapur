import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Hapus sesi lokal hanya jika 401 terjadi di BUKAN endpoint login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('umkm_admin_token');
      localStorage.removeItem('umkm_admin_username');
    }
    return Promise.reject(error);
  }
);

export default api;
