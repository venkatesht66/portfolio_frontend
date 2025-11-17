import axios from 'axios';

const API_BASE = 'https://portfolio-backend-51vn.onrender.com';

const instance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(req => {
  console.log('[API] Request:', req.method.toUpperCase(), req.baseURL + req.url);
  return req;
}, err => { console.error('[API] Request error', err); return Promise.reject(err); });

instance.interceptors.response.use(res => {
  return res;
}, err => {
  console.error('[API] Response error:', err?.response?.status, err?.response?.data || err.message);
  return Promise.reject(err);
});

export const setAuthToken = token => {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete instance.defaults.headers.common['Authorization'];
}

const token = localStorage.getItem("token");
if (token) setAuthToken(token);
export default instance;

export const login = (email, password) => instance.post('/auth/login', { email, password });

export const fetchProjects = () => instance.get('/api/projects');
export const fetchProject = id => instance.get(`/api/projects/${id}`);
export const createProject = data => instance.post('/api/projects', data);
export const updateProject = (id, data) => instance.put(`/api/projects/${id}`, data);
export const deleteProject = id => instance.delete(`/projects/${id}`);

export const getAdminProfile = () => instance.get('/api/admin/profile');
export const updateAdminProfile = (data) => instance.put('/api/admin/profile', data);

export const fetchContact = (id) => instance.get(`/api/contact/${id}`);
export const sendContact = (data) => instance.post('/api/contact', data);
export const fetchContacts = () => instance.get('/api/contact');
export const deleteContact = (id) => instance.delete(`/api/contact/${id}`);
export const updateContact = (id, data) => instance.put(`/api/contact/${id}`, data)

export const fetchExperiences = () => instance.get('/api/experiences');
export const fetchExperience = id => instance.get(`/api/experiences/${id}`);
export const createExperience = data => instance.post('/api/experiences', data);
export const updateExperience = (id, data) => instance.put(`/api/experiences/${id}`, data);
export const deleteExperience = id => instance.delete(`/api/experiences/${id}`);

export const fetchCertifications = () => instance.get('/api/certifications');
export const createCertification = data => instance.post('/api/certifications', data);
export const updateCertification = (id, data) => instance.put(`/api/certifications/${id}`, data);
export const deleteCertification = id => instance.delete(`/api/certifications/${id}`);