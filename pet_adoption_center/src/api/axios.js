import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
    } else if (url.includes("/charity/posts") && !url.includes("/like") && !url.includes("/comments") && (config.method === 'put' || config.method === 'delete')) {
      // For charity posts CRUD operations (PUT, DELETE), use admin token
      token = localStorage.getItem("adminToken");
    } else if (url.includes("/charity/posts") && !url.includes("/like") && !url.includes("/comments") && config.method === 'post' && !url.match(/\/posts\/\d+\/like/) && !url.match(/\/posts\/\d+\/comments/)) {
      // For creating posts (POST /charity/posts), use admin token
      token = localStorage.getItem("adminToken");
    } else {
      // For everything else (including likes, comments, get posts), use user token
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
