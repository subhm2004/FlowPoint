import { CustomError } from "@/types/custom-error.type";
import axios from "axios";
import type { AxiosError } from "axios";
import { clearAuthToken, getAuthToken } from "./auth-token";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
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

    const reqUrl = axiosError.config?.url ?? "";
    const isLoginOrRegister =
      reqUrl.includes("/auth/login") || reqUrl.includes("/auth/register");

    if (status === 401 && !isLoginOrRegister) {
      clearAuthToken();
      window.location.href = "/";
    }

    const customError: CustomError = {
      ...axiosError,
      message:
        data?.message ||
        axiosError.message ||
        "Unable to connect to server. Please try again.",
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
