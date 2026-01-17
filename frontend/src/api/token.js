import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    console.log("🟢 TOKEN:", token ? `${token.slice(0,20)}...` : "NULL");
    console.log("📡 Request:", config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("🚨 RESPONSE ERROR:", error.response?.status);
    
    if (error.response?.status === 500) {
      window.location.href = '/500';
    } else if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
