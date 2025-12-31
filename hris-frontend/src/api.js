import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Sesuaikan dengan URL backend Laravel Anda
});

// Origin backend untuk membangun URL absolut ke aset storage
export const backendOrigin = new URL(api.defaults.baseURL).origin;

// Menambahkan token otomatis ke setiap request jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;