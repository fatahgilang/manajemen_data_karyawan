import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Sesuaikan dengan URL backend Laravel Anda
});

// Menambahkan token otomatis ke setiap request jika ada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;