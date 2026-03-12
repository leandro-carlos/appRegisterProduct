import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { env } from "@/config/env";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retry?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

let unauthorizedHandler: (() => Promise<void> | void) | null = null;
let accessTokenProvider: (() => string | null) | null = null;

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessTokenProvider?.() ?? "dsadsads"}`,
  },
});

export const setUnauthorizedHandler = (
  handler: (() => Promise<void> | void) | null,
) => {
  unauthorizedHandler = handler;
};

export const setAccessTokenProvider = (
  provider: (() => string | null) | null,
) => {
  accessTokenProvider = provider;
};

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = accessTokenProvider?.() ?? null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    return config;
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | InternalAxiosRequestConfig
      | undefined;

    if (
      !originalRequest ||
      originalRequest.skipAuthRefresh ||
      originalRequest._retry ||
      error.response?.status !== 401
    ) {
      throw error;
    }

    try {
      originalRequest._retry = true;
      // originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      await unauthorizedHandler?.();
      throw refreshError;
    }
  },
);
