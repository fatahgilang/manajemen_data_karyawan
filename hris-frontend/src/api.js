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

// ===== Approvals API =====
export const listApprovalRules = (params) => api.get('/approvals/rules', { params });
export const upsertApprovalRule = (payload) => api.post('/approvals/rules', payload);
export const listApprovalRequests = (params) => api.get('/approvals/requests', { params });
export const createApprovalRequest = (payload) => api.post('/approvals/requests', payload);
export const approveRequest = (id, payload = {}) => api.post(`/approvals/requests/${id}/approve`, payload);
export const rejectRequest = (id, payload = {}) => api.post(`/approvals/requests/${id}/reject`, payload);

// ===== Master Data (Departments, Employees) =====
export const listDepartments = (params) => api.get('/departments', { params });
export const listEmployees = (params) => api.get('/employees', { params });

export default api;