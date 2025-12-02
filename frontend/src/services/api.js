import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Helper to normalize backend responses:
// either { resume: {...} } or just {...}
const normalizeResume = (payload) => {
  if (!payload) return null;
  if (payload.resume) return payload.resume;
  if (payload.data && payload.data.resume) return payload.data.resume;
  return payload;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file); // must match Multer field name

  const res = await api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return normalizeResume(res.data);
};

export const getAllResumes = async () => {
  const res = await api.get('/resumes');
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.resumes)) return data.resumes;
  return [];
};

export const getResumeById = async (id) => {
  const res = await api.get(`/resumes/${id}`);
  return normalizeResume(res.data);
};
