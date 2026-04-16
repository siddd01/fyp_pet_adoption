import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use(
  (config) => {
    // Don't override if caller already set Authorization
    if (config.headers.Authorization) return config;
    const url = config.url || "";
    let token = null;
    if (url.includes("/admin")) {
      token = localStorage.getItem("adminToken");
    } else if (url.includes("/staff")) {
      token = localStorage.getItem("staffToken");
    } else {
      token = localStorage.getItem("token");
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
