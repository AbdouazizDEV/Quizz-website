import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AppConfig } from '../../../config';
import { refreshAuthSessionIfNeeded } from '@services/auth/refreshAuthSession';
import { useAuthStore } from '@stores/authStore';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshInFlight: ReturnType<typeof refreshAuthSessionIfNeeded> | null = null;

class ApiClient {
  private static instance: AxiosInstance;

  static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      ApiClient.instance = axios.create({
        baseURL: AppConfig.API_BASE_URL,
        timeout: AppConfig.TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      ApiClient.instance.interceptors.request.use((config) => {
        const token = useAuthStore.getState().token?.trim();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      ApiClient.instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const original = error.config as RetryConfig | undefined;
          const status = error.response?.status as number | undefined;

          if (status === 401 && original && !original._retry) {
            original._retry = true;
            refreshInFlight ??= refreshAuthSessionIfNeeded({ force: true });
            const refreshed = await refreshInFlight.finally(() => {
              refreshInFlight = null;
            });

            if (refreshed.ok) {
              original.headers = original.headers ?? {};
              original.headers.Authorization = `Bearer ${refreshed.accessToken}`;
              return ApiClient.instance(original);
            }

            useAuthStore.getState().clearSession();
          }

          if (AppConfig.ENABLE_LOGS) {
            console.error('[API Error]', status, original?.url);
          }
          return Promise.reject(error);
        },
      );
    }

    return ApiClient.instance;
  }
}

export const apiClient = ApiClient.getInstance();
