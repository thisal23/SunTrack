import axios from "axios";
import { config } from "./config";

const API_BASE_URL = config.apiEndpoint ||"http://localhost:8000/api/";

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
    console.log("Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
