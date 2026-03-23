import axios from "axios";
import appConfig from "../config/config";

const http = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - Redirect to login");
      localStorage.removeItem("authToken");
    } else {
      console.error("API Error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  },
);

export default http;
