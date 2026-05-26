import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobhive_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jobhive_token');
      localStorage.removeItem('jobhive_user');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data || err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  googleAuth: (token) => api.post('/auth/google', { token }),
};

// Jobs
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getOne: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  search: (query) => api.get('/jobs/search', { params: { q: query } }),
  getFeatured: () => api.get('/jobs/featured'),
  getByCategory: (cat) => api.get(`/jobs/category/${cat}`),
};

// Applications
export const applicationsAPI = {
  apply: (jobId, data) => api.post(`/applications/${jobId}`, data),
  getMyApplications: () => api.get('/applications/me'),
  getForJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  withdraw: (id) => api.delete(`/applications/${id}`),
};

// Users
export const usersAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  uploadResume: (formData) => api.post('/users/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  saveJob: (jobId) => api.post(`/users/saved/${jobId}`),
  unsaveJob: (jobId) => api.delete(`/users/saved/${jobId}`),
  getSavedJobs: () => api.get('/users/saved'),
};

// Employers
export const employerAPI = {
  getStats: () => api.get('/employer/stats'),
  getCandidates: (jobId) => api.get(`/employer/candidates/${jobId}`),
  updateJobStatus: (jobId, status) => api.patch(`/jobs/${jobId}/status`, { status }),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  suspendUser: (id) => api.patch(`/admin/users/${id}/suspend`),
  getReports: () => api.get('/admin/reports'),
  resolveReport: (id) => api.patch(`/admin/reports/${id}/resolve`),
};

export default api;
