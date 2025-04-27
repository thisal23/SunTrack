import axios from "axios";
import { config } from "./config";

const API_BASE_URL = config.apiEndpoint || "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => api.post(url, data,{ headers: { "Content-Type": "application/json" } }),
  put: (url, data = {}) =>
    api.put(url, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (url) => api.delete(url),
};

export default apiService;
