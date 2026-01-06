import axios from 'axios';

// Ambil base URL dari environment Vite, fallback ke lokal
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
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

// ===== Documents API =====
export const listDocuments = (params) => api.get('/documents', { params });
export const createDocument = (formData) => api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const addDocumentVersion = (documentId, formData) => api.post(`/documents/${documentId}/versions`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const downloadDocumentVersionUrl = (documentId, versionId) => `${backendOrigin}/api/documents/${documentId}/versions/${versionId}/download`;


// ===== Master Data (Departments, Employees) =====
export const listDepartments = (params) => api.get('/departments', { params });
export const listEmployees = (params) => api.get('/employees', { params });

// ===== Shifts & Roster =====
export const listShifts = () => api.get('/shifts');
export const createShift = (payload) => api.post('/shifts', payload);
export const updateShift = (id, payload) => api.put(`/shifts/${id}`, payload);
export const deleteShift = (id) => api.delete(`/shifts/${id}`);

export const listSchedules = (params) => api.get('/roster/schedules', { params });
export const setSchedule = (payload) => api.post('/roster/schedule', payload);
export const generateRoster = (payload) => api.post('/roster/generate', payload);
export const requestShiftSwap = (payload) => api.post('/roster/swap', payload);
export const listShiftSwaps = (params) => api.get('/roster/swaps', { params });
export const approveShiftSwap = (id) => api.post(`/roster/swap/${id}/approve`);
export const rejectShiftSwap = (id) => api.post(`/roster/swap/${id}/reject`);

// ===== HR Documents (Contracts & Warnings) =====
export const generateContractLetter = (payload) => api.post('/hr-documents/contracts', payload, { responseType: 'blob' });
export const generateWarningLetter = (payload) => api.post('/hr-documents/warnings', payload, { responseType: 'blob' });

export default api;
