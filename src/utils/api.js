// src/utils/api.js

import axios from "axios";
import { getAccessToken, setAccessToken } from "./auth";
const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
const api = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL:`${BASE_URL}`,
  withCredentials: true, // 🔥 important (for refresh token cookie)
});

// 🔹 Request interceptor (attach token)
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔹 Response interceptor (handle expiry)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 🔄 call refresh API
        const res = await axios.post(
          `${api.defaults.baseURL}/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        // ✅ save new token in memory
        setAccessToken(newAccessToken);

        // 🔁 retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (error) {
        // ❌ refresh failed → logout
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;