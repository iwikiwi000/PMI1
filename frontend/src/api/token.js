import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // URL tvojho backendu
});

// Interceptor pridá token do každého requestu
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("➡️ Axios interceptor token:", token);
    console.log("➡️ Request URL:", config.url);
    console.log("➡️ Headers before:", config.headers);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
