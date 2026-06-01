import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Axios instance with defaults
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminLoggedIn');
    }
    return Promise.reject(error);
  }
);

// ─── User APIs ───────────────────────────────────────────
export const userService = {
  create: (data) => api.post('/users/create', data),
  check: (email, number) => api.post('/users/check', { email, number }),
  getAll: () => api.get('/users/all'),
  getByNumber: (number) => api.get(`/users/getbynumber/${number}`),
  getById: (id) => api.get(`/users/getbyid/${id}`),
  update: (number, data) => api.put(`/users/update/${number}`, data),
  delete: (number) => api.delete(`/users/delete/${number}`),
  getOnline: () => api.get('/users/online'),
};

// ─── Admin APIs ──────────────────────────────────────────
export const adminService = {
  register: (data) => api.post('/Adminaprovel/register', data),
  login: (data) => api.post('/Adminaprovel/login', data),
  getAll: () => api.get('/Adminaprovel/all'),
  getPending: () => api.get('/Adminaprovel/pending'),
  getByCustomerId: (id) => api.get(`/Adminaprovel/get/${id}`),
  approve: (id) => api.put(`/Adminaprovel/approve/${id}`, {}),
  reject: (id) => api.put(`/Adminaprovel/reject/${id}`, {}),
  update: (customerId, data) => api.put(`/Adminaprovel/update/${customerId}`, data),
  delete: (customerId) => api.delete(`/Adminaprovel/delete/${customerId}`),
};

// ─── Google Auth APIs ────────────────────────────────────
export const googleService = {
  sync: (data) => api.post('/googleinfo', data),
  getAll: () => api.get('/googleinfo'),
  getByGoogleId: (id) => api.get(`/googleinfo/${id}`),
  delete: (id) => api.delete(`/googleinfo/${id}`),
};

// ─── Comments APIs ───────────────────────────────────────
export const commentService = {
  submit: (data) => api.post('/comments/submit', data),
  getAll: () => api.get('/comments/all'),
  getPending: () => api.get('/comments/pending'),
  getApproved: () => api.get('/comments/approved'),
  approve: (id) => api.put(`/comments/approve/${id}`),
  reject: (id) => api.put(`/comments/reject/${id}`),
  delete: (id) => api.delete(`/comments/delete/${id}`),
};

// ─── Contact APIs ────────────────────────────────────────
export const contactService = {
  submit: (data) => api.post('/contact/submit', data),
  getAll: () => api.get('/contact/all'),
  getById: (id) => api.get(`/contact/${id}`),
  delete: (id) => api.delete(`/contact/${id}`),
};

// ─── CrickLinks APIs ─────────────────────────────────────
export const crickLinksService = {
  create: (data) => api.post('/cricklinks', data),
  getAll: () => api.get('/cricklinks'),
  getById: (id) => api.get(`/cricklinks/${id}`),
  getByCustomerId: (id) => api.get(`/cricklinks/customer/${id}`),
  update: (id, data) => api.put(`/cricklinks/${id}`, data),
  delete: (id) => api.delete(`/cricklinks/${id}`),
  search: (q) => api.get(`/cricklinks/search?q=${q}`),
};

// ─── Templates APIs ──────────────────────────────────────
export const templateService = {
  create: (data) => api.post('/templates', data),
  getAll: (params) => api.get('/templates', { params }),
  getById: (id) => api.get(`/templates/${id}`),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`),
  approve: (id) => api.put(`/templates/${id}/approve`),
  reject: (id) => api.put(`/templates/${id}/reject`),
  search: (params) => api.get('/templates/search', { params }),
  filter: (params) => api.get('/templates/filter', { params }),
};

// ─── Presence APIs ───────────────────────────────────────
export const presenceService = {
  ping: (data) => api.post('/presence/ping', data),
  getOnline: () => api.get('/presence/online'),
  getCount: () => api.get('/presence/count'),
  submitFeedback: (data) => api.post('/presence/feedback', data),
};

export { API_BASE_URL };
export default api;
