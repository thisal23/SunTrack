import axios from "axios";
import { config } from "./config";

const API_BASE_URL = config.apiEndpoint || "http://localhost:8000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log('Token from localStorage:', token);
    console.log('Request URL:', config.url);
    console.log('Request method:', config.method);
    console.log('Content-Type:', config.headers['Content-Type']);

    console.log("Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization);
    } else {
      console.log('No token found in localStorage');
    }

    // Don't override Content-Type for FormData requests
    if (config.data instanceof FormData) {
      console.log('FormData detected, preserving multipart/form-data');
      delete config.headers['Content-Type']; // Let browser set it automatically
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// const apiService = {
//   get: (url, params,config = {}) => api.get(url, { params }, config),
//   post: (url, data = {}) => api.post(url, data,{ headers: { "Content-Type": "application/json" } }),
//   put: (url, data = {}) =>
//     api.put(url, data, { headers: { "Content-Type": "multipart/form-data" } }),
//   delete: (url) => api.delete(url),
// };
const apiService = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => {
    // Check if data is FormData (for file uploads)
    const isFormData = data instanceof FormData;
    const headers = {};

    // Don't set Content-Type for FormData - let the browser set it with boundary
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    return api.post(url, data, { headers });
  },
  put: (url, data = {}) => {
    // Check if data is FormData (for file uploads)
    const isFormData = data instanceof FormData;
    const headers = {};

    // Don't set Content-Type for FormData - let the browser set it with boundary
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    return api.put(url, data, { headers });
  },
  delete: (url) => api.delete(url),
  get: (url, params = {}, config = {}) =>
    api.get(url, { ...config, params }),  // merge config correctly
  post: (url, data = {}, config = {}) =>
    api.post(url, data, config),
  put: (url, data = {}) =>
    api.put(url, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (url, config = {}) =>
    api.delete(url, config),
};



export default apiService;
