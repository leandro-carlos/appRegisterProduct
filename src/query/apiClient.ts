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
let refreshPromise: Promise<string> | null = null;
let accessTokenProvider: (() => string | null) | null = null;
let refreshHandler: (() => Promise<string>) | null = null;

const requestAccessTokenRefresh = async () => {
  if (!refreshHandler) {
    throw new Error("Refresh handler nao configurado.");
  }

  if (!refreshPromise) {
    refreshPromise = refreshHandler().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = accessTokenProvider?.() ?? null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

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
      const accessToken = await requestAccessTokenRefresh();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      await unauthorizedHandler?.();
      throw refreshError;
    }
  }
);

export const setUnauthorizedHandler = (
  handler: (() => Promise<void> | void) | null
) => {
  unauthorizedHandler = handler;
};

export const setAuthSessionHandlers = (handlers: {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string>;
}) => {
  accessTokenProvider = handlers.getAccessToken;
  refreshHandler = handlers.refreshAccessToken;
};
