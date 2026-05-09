import { CustomError } from "@/types/custom-error.type";
import axios from "axios";
import type { AxiosError } from "axios";
import { normalizeApiBase } from "./base-url";
import { clearAuthToken, getAuthToken } from "./auth-token";

const baseURL = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);

if (import.meta.env.PROD && !baseURL) {
  console.error(
    "[FlowPilot] VITE_API_BASE_URL is missing. In Vercel: Project → Settings → Environment Variables → add VITE_API_BASE_URL (e.g. https://your-api.onrender.com/api) → redeploy."
  );
}

const options = {
  baseURL,
  /** JWT is sent via Authorization; cookies + credentials complicate CORS across origins. */
  withCredentials: false,
  /** Render free tier cold start can be slow */
  timeout: 60000,
};

const API = axios.create(options);

API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const axiosError = error as AxiosError<{
      message?: string;
      errorCode?: string;
    }>;
    const data = axiosError.response?.data;
    const status = axiosError.response?.status;
    const code = axiosError.code;

    const reqUrl = axiosError.config?.url ?? "";
    const isLoginOrRegister =
      reqUrl.includes("/auth/login") || reqUrl.includes("/auth/register");

    // No token → 401 on /user/current is normal; never hard-redirect to "/" (breaks sign-in / sign-up).
    if (status === 401 && !isLoginOrRegister && getAuthToken()) {
      clearAuthToken();
      window.location.href = "/";
    }

    let message =
      data?.message ||
      axiosError.message ||
      "Unable to connect to server. Please try again.";

    if (code === "ECONNABORTED") {
      message =
        "Request timed out. If the API is on Render’s free tier, wait a moment and try again while the service wakes up.";
    } else if (
      !axiosError.response &&
      (axiosError.message === "Network Error" || code === "ERR_NETWORK")
    ) {
      message = !baseURL
        ? "App misconfiguration: VITE_API_BASE_URL was not set when this site was built. Add it in your host (e.g. Vercel) environment variables and redeploy."
        : "Cannot reach the API. Check your network, that the backend is running, and try again (Render cold start can take ~30s).";
    }

    const customError: CustomError = {
      ...axiosError,
      message,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
