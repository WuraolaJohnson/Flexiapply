import axios from 'axios';
import { initialData } from './initialData';

// Helper to get data from localStorage or initialData
const getStorageData = () => {
  try {
    const stored = localStorage.getItem('safapply_db');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("[MockAPI] Failed to parse localStorage", e);
  }
  localStorage.setItem('safapply_db', JSON.stringify(initialData));
  return initialData;
};

const saveStorageData = (data) => {
  localStorage.setItem('safapply_db', JSON.stringify(data));
};

const mockApi = axios.create({
  baseURL: '/api',
});

// Helper for Mock Responses
const handleMockRequest = (config) => {
  if (!config || !config.url) return null;
  
  const data = getStorageData();
  const method = (config.method || 'get').toLowerCase();
  
  // Strip the /api prefix if it exists, and any leading slashes
  const cleanUrl = config.url.replace(/^\/api\//, '').replace(/^\//, ''); 
  const [resource, id] = cleanUrl.split('/');
  
  // Basic guard for missing resource keys
  if (!data[resource] && !id) {
    console.warn(`[MockAPI] Resource "${resource}" not found in initialData. URL: ${config.url}`);
    return { data: [], status: 200, config }; // Return empty list instead of null to prevent component crashes
  }

  console.info(`[MockAPI] Serving ${method.toUpperCase()} /${resource}${id ? '/' + id : ''} from local storage`);

  if (method === 'get') {
    let result = data[resource];
    if (id) {
      result = result?.find(item => item.id === id);
    } else if (config.params) {
      result = result?.filter(item => {
        return Object.entries(config.params).every(([key, value]) => item[key] === value);
      });
    }
    return { data: result || (id ? null : []), status: 200, config };
  }

  if (method === 'post') {
    const newItem = { ...config.data, id: config.data?.id || Math.random().toString(36).substr(2, 9) };
    if (!data[resource]) data[resource] = [];
    data[resource].push(newItem);
    saveStorageData(data);
    return { data: newItem, status: 201, config };
  }

  if (method === 'put' || method === 'patch') {
    const index = data[resource]?.findIndex(item => item.id === id);
    if (index !== -1 && data[resource]) {
      data[resource][index] = { ...data[resource][index], ...config.data };
      saveStorageData(data);
      return { data: data[resource][index], status: 200, config };
    }
  }
  
  return null;
};

// Check if we should force mock even before attempting (for production)
const isProduction = import.meta.env.PROD;
const forceMock = isProduction || !window.location.hostname.includes('localhost');

mockApi.interceptors.request.use(async (config) => {
  // Always wait a bit to simulate network
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (forceMock) {
    const mockRes = handleMockRequest(config);
    if (mockRes) return Promise.resolve(mockRes);
  }
  
  return config;
}, (error) => Promise.reject(error));

// Fallback for failed requests (e.g. 404 or Network Error)
mockApi.interceptors.response.use(
  response => response,
  async (error) => {
    // If the request fails (404, connection error, etc.), fallback to mock
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404 || error.code === 'ECONNREFUSED' || !error.response) {
      console.warn(`[MockAPI] Network call to ${error.config?.url} failed. Falling back to local data...`);
      const mockRes = handleMockRequest(error.config);
      if (mockRes) return Promise.resolve(mockRes);
    }
    return Promise.reject(error);
  }
);

export default mockApi;
