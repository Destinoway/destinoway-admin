import { showMessage } from "@/lib/antdMessage";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useLoaderStore } from "@/store/loader.store";
import axios from "axios";

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/* ===============================
   🔥 REFRESH CONTROL (IMPORTANT)
================================ */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

/* ===============================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use((config) => {
  if (!config.skipLoader && !config.url?.includes("/auth/refresh-token")) {
    useLoaderStore.getState().start();
  }
  return config;
});

/* ===============================
   RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(
  (response) => {
    if (
      !response.config.skipLoader &&
      !response.config.url?.includes("/auth/refresh-token")
    ) {
      useLoaderStore.getState().stop();
    }

    const data = response.data;

    if (
      data?.success &&
      response.config.method !== "get" &&
      !response.config.skipToast
    ) {
      showMessage.success(data.message || "Success");
    }

    return response;
  },

  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;

    if (
      !originalRequest.skipLoader &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      useLoaderStore.getState().stop();
    }

    if (originalRequest.url?.includes("/auth/refresh-token")) {
      useAuthStore.getState().clearUser();
      return Promise.reject(error);
    }

    /* ===============================
       🔥 HANDLE 401 (MAIN FIX)
    ============================== */
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        await refreshApi.post("/auth/refresh-token");

        isRefreshing = false;
        processQueue();

        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err);

        useAuthStore.getState().clearUser();
        return Promise.reject(err);
      }
    }

    /* ===============================
       🔥 NORMAL ERROR HANDLING
    ============================== */
    if (
      !originalRequest.url?.includes("/auth/me") &&
      !originalRequest.skipToast
    ) {
      const msg = error?.response?.data?.message || "Something went wrong";
      showMessage.error(msg);
    }

    return Promise.reject(error);
  },
);

export default api;
