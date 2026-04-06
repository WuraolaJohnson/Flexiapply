import axios from 'axios';

const mockApi = axios.create({
  baseURL: '/api',
});

// Optional: keep a small delay interceptor so loaders still show beautifully in the UI
mockApi.interceptors.request.use(async (config) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return config;
});

export default mockApi;
