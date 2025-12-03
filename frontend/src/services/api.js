import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Helper to normalize backend responses
const normalizeResume = (payload) => {
  if (!payload) return null;
  if (payload.resume) return payload.resume;
  if (payload.data && payload.data.resume) return payload.data.resume;
  return payload;
};

// ✅ UPLOAD
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file); // must match upload.single("resume")

  const res = await api.post('/api/resumes/upload', formData);
  return normalizeResume(res.data);
};

// ✅ HISTORY LIST — FIXED
export const getAllResumes = async () => {
  const res = await api.get('/api/resumes');
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.resumes)) return data.resumes;
  return [];
};

// ✅ HISTORY DETAILS — FIXED
export const getResumeById = async (id) => {
  const res = await api.get(`/api/resumes/${id}`);
  return normalizeResume(res.data);
};

export default api;
