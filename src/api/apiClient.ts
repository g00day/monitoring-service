import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url !== "/auth/login") {
      localStorage.removeItem("access_token");
      if (window.location.pathname !== "/") window.location.replace("/");
    }
    return Promise.reject(error);
  },
);

// Интерцептор для автоматического добавления Bearer токена в заголовки
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
