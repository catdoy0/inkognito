import axios from "axios";

import { API_URL } from "./config";

declare module "axios" {
  interface AxiosRequestConfig {
    _authRetry?: boolean;
  }

  interface InternalAxiosRequestConfig {
    _authRetry?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  adapter: "fetch",
  validateStatus: () => true,
});

export default apiClient;
