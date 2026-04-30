import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1", 
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
  
  // Only attach the token if it exists AND we aren't hitting an auth route
  if (token && !config.url?.includes("/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;