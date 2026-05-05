import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
});

const clearSessionAndRedirect = (role) => {
  if (typeof window === "undefined") return;

  if (role === "admin") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    if (!window.location.pathname.startsWith("/admin/login")) {
      window.location.replace("/admin/login");
    }
    return;
  }

  if (role === "staff") {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staff");

    if (!window.location.pathname.startsWith("/staff/login")) {
      window.location.replace("/staff/login");
    }
    return;
  }

  if (role === "user") {
    localStorage.removeItem("token");
  }
};

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const authHeader =
      error.config?.headers?.Authorization || error.config?.headers?.authorization;

    if (status === 401 && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      const requestToken = authHeader.slice(7);
      const adminToken = localStorage.getItem("adminToken");
      const staffToken = localStorage.getItem("staffToken");
      const userToken = localStorage.getItem("token");

      if (adminToken && requestToken === adminToken) {
        clearSessionAndRedirect("admin");
      } else if (staffToken && requestToken === staffToken) {
        clearSessionAndRedirect("staff");
      } else if (userToken && requestToken === userToken) {
        clearSessionAndRedirect("user");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
