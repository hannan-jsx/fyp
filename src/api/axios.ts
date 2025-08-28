import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import tokenManager from "@/lib/tokenManager";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api",
  // timeout: 10000,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.DEV) {
      console.log("🚀 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log("✅ API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;

      console.error("❌ API Error Response:", {
        status,
        url: error.config?.url,
        data,
      });

      switch (status) {
        case 401:
          tokenManager.clearAuth();
          window.location.href = "/login";
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
        default:
          console.error(`HTTP ${status} error`);
      }
    } else if (error.request) {
      console.error("❌ Network Error:", error.request);
    } else {
      console.error("❌ Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

export const apiClient = {
  get: (url: string, config?: AxiosRequestConfig) => api.get(url, config),
  post: (url: string, data?: any, config?: AxiosRequestConfig) =>
    api.post(url, data, config),
  put: (url: string, data?: any, config?: AxiosRequestConfig) =>
    api.put(url, data, config),
  patch: (url: string, data?: any, config?: AxiosRequestConfig) =>
    api.patch(url, data, config),
  delete: (url: string, config?: AxiosRequestConfig) => api.delete(url, config),
};
