import axios from 'axios';
import { initialData } from './initialData';

// Helper to get data from localStorage or initialData
const getStorageData = () => {
  const stored = localStorage.getItem('safapply_db');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('safapply_db', JSON.stringify(initialData));
  return initialData;
};

const saveStorageData = (data) => {
  localStorage.setItem('safapply_db', JSON.stringify(data));
};

// Check if we should use the real API or the mock
// We use the mock if we're in production or if the user explicitly wants to (or if API fails)
const isProduction = import.meta.env.PROD;

const mockApi = axios.create({
  baseURL: '/api',
});

// Interceptor to handle requests locally if needed
mockApi.interceptors.request.use(async (config) => {
  // Always add a small delay for better UX (showing loaders)
  await new Promise(resolve => setTimeout(resolve, 500));

  // In production or if no backend is detected, we handle requests locally
  if (isProduction || !window.location.hostname.includes('localhost')) {
    const data = getStorageData();
    const url = config.url.replace(/^\//, ''); // remove leading slash
    const [resource, id] = url.split('/');
    
    // Simple GET logic
    if (config.method === 'get') {
      let result = data[resource];
      
      // Handle ID-based selection
      if (id) {
        result = result.find(item => item.id === id);
      } 
      // Handle query params (like ?email=...)
      else if (config.params) {
        result = result.filter(item => {
          return Object.entries(config.params).every(([key, value]) => item[key] === value);
        });
      }

      return Promise.resolve({ data: result, status: 200, config });
    }

    // Simple POST logic
    if (config.method === 'post') {
      const newItem = { ...config.data, id: config.data.id || Math.random().toString(36).substr(2, 9) };
      data[resource].push(newItem);
      saveStorageData(data);
      return Promise.resolve({ data: newItem, status: 201, config });
    }
    
    // Simple PUT/PATCH logic
    if (config.method === 'put' || config.method === 'patch') {
      const index = data[resource].findIndex(item => item.id === id);
      if (index !== -1) {
        data[resource][index] = { ...data[resource][index], ...config.data };
        saveStorageData(data);
        return Promise.resolve({ data: data[resource][index], status: 200, config });
      }
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Fallback for failed requests (e.g. 404/ECONNREFUSED in dev)
mockApi.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404 || error.message.includes('Network Error')) {
      console.warn("API unavailable, switching to local mock data.");
      // Logic would be similar to the request interceptor but for error recovery
      // For simplicity, we recommend using the request interceptor approach above.
    }
    return Promise.reject(error);
  }
);

export default mockApi;
