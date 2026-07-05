import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

/**
 * Axios instance for the NurixSoft backend. Screens read bundled portfolio
 * content directly; this client is used for submissions (project requests,
 * bug reports) and future authenticated calls. Failures are handled by the
 * offline queue in the submission services.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
