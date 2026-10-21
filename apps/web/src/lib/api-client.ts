import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _requestStartedAt?: number;
}

export const apiClient = axios.create({
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;
const REFRESH_TIMESTAMP_KEY = "auth_last_refreshed_at";

function getLastRefreshedAt(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(REFRESH_TIMESTAMP_KEY) || 0);
}

function setLastRefreshedAt(timestamp: number): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TIMESTAMP_KEY, String(timestamp));
  }
}

export function clearLastRefreshedAt(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(REFRESH_TIMESTAMP_KEY);
  }
}

async function refreshTokensWithCrossTabLock(
  requestStartedAt: number,
): Promise<void> {
  const performRefresh = async () => {
    if (requestStartedAt < getLastRefreshedAt()) {
      return;
    }

    await axios.post("/api/v1/auth/refresh", null, { withCredentials: true });
    setLastRefreshedAt(Date.now());
  };

  if (typeof navigator !== "undefined" && navigator.locks) {
    await navigator.locks.request("beezbudget-auth-refresh", performRefresh);
  } else {
    await performRefresh();
  }
}

apiClient.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  config._requestStartedAt = Date.now();
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | CustomAxiosRequestConfig
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes("/api/v1/auth/login") ||
      originalRequest.url?.includes("/api/v1/auth/refresh") ||
      originalRequest.url?.includes("/api/v1/auth/logout");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      const startedAt = originalRequest._requestStartedAt ?? Date.now();

      if (startedAt < getLastRefreshedAt()) {
        return apiClient(originalRequest);
      }

      try {
        if (!refreshPromise) {
          refreshPromise = refreshTokensWithCrossTabLock(startedAt).finally(
            () => {
              refreshPromise = null;
            },
          );
        }

        await refreshPromise;

        return apiClient(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
