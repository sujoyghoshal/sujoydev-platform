import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let accessToken: string | null = sessionStorage.getItem('sujoydev.accessToken');

export function setAccessToken(token: string | null): void {
  accessToken = token;
  if (token) {
    sessionStorage.setItem('sujoydev.accessToken', token);
  } else {
    sessionStorage.removeItem('sujoydev.accessToken');
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { data } = await axios.post(
    `${BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
  const token = data.data.accessToken as string;
  setAccessToken(token);
  return token;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean };
    if (error.response?.status === 401 && original && !original._retried && accessToken) {
      original._retried = true;
      try {
        refreshing = refreshing ?? refreshAccessToken();
        const token = await refreshing;
        refreshing = null;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (refreshError) {
        refreshing = null;
        setAccessToken(null);
        window.location.assign('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
