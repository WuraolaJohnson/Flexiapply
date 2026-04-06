import axios from 'axios';
import { initialData } from './initialData';

// Self-healing data store: Merge static data with any existing dynamic user data
const getMergedData = () => {
  let stored = {};
  try {
    const raw = localStorage.getItem('safapply_db');
    if (raw) stored = JSON.parse(raw);
  } catch (e) {
    // Fail silently
  }

  const institutions = (initialData?.institutions?.length > 0) ? initialData.institutions : (stored?.institutions || []);
  const programs = (initialData?.programs?.length > 0) ? initialData.programs : (stored?.programs || []);

  const merged = {
    ...initialData,
    ...stored,
    institutions,
    programs
  };

  try {
    localStorage.setItem('safapply_db', JSON.stringify(merged));
  } catch (e) {}
  
  return merged;
};

const saveStorageData = (data) => {
  try {
    localStorage.setItem('safapply_db', JSON.stringify(data));
  } catch (e) {}
};

// Helper for Mock Responses
const handleMockRequest = (config) => {
  // EXTREME SAFETY: If config or URL is missing, abort mock
  if (!config || typeof config.url !== 'string') return null;
  
  const data = getMergedData();
  const method = (config.method || 'get').toLowerCase();
  
  // Extract query params from URL if they exist
  const searchParams = new URLSearchParams(config.url.split('?')[1] || '');
  const urlParams = Object.fromEntries(searchParams.entries());
  const combinedParams = { ...urlParams, ...config.params };
  
  // Robust URL cleaning
  const urlPath = config.url.split('?')[0]; // Remove query params for resource matching
  const cleanUrl = urlPath.replace(/^\/api\//, '').replace(/^\//, ''); 
  const [resource, id] = cleanUrl.split('/');
  
  if (!data[resource]) {
    return { data: [], status: 200, config };
  }

  // Remove .toUpperCase() to prevent any potential undefined access crash
  console.info(`[MockAPI] Serving ${method} /${resource} from static-first store`);

  if (method === 'get') {
    let result = data[resource];
    if (id) {
      result = result?.find(item => String(item.id) === String(id));
    } else if (Object.keys(combinedParams).length > 0) {
      result = result?.filter(item => {
        return Object.entries(combinedParams).every(([key, value]) => String(item[key]) === String(value));
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
    const index = data[resource]?.findIndex(item => String(item.id) === String(id));
    if (index !== -1 && data[resource]) {
      data[resource][index] = { ...data[resource][index], ...config.data };
      saveStorageData(data);
      return { data: data[resource][index], status: 200, config };
    }
  }
  
  return null;
};

// Check if we should force mock
const isProduction = import.meta.env.PROD;
const forceMock = isProduction || !window.location.hostname.includes('localhost');

// Robust Custom Adapter Implementation
const customAdapter = async (config) => {
  if (forceMock) {
    try {
      const mockRes = handleMockRequest(config);
      if (mockRes) {
        // Return a completed response promise, bypassing the actual network stack
        return Promise.resolve(mockRes);
      }
    } catch (e) {
      console.warn("[MockAPI] Adapter mock failed:", e);
    }
  }
  
  // Create a fresh instance for the real request to get the default adapter
  // This avoids recursive calls to our custom adapter
  const xhrConfig = { ...config, adapter: undefined };
  return axios(xhrConfig);
};

const mockApi = axios.create({
  baseURL: '/api',
  adapter: customAdapter
});

export default mockApi;
