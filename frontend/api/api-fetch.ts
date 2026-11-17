import type { AxiosResponse } from "axios";

import { setSession } from "@/reduxStore/authSlice";
import type { AppStore } from "@/reduxStore/store";
import * as authApi from "./auth-api";
import apiClient from "./api-client";

/** Installs Redux-backed bearer-token and one-retry silent-refresh handling. */
export function installAuthInterceptors(store: AppStore) {
  const requestInterceptor = apiClient.interceptors.request.use((config) => {
    const accessToken = store.getState().auth.session?.access_token;
    if (accessToken && !config.headers.has("Authorization")) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  });

  const responseInterceptor = apiClient.interceptors.response.use(async (response) => {
    const config = response.config;
    if (response.status !== 401 || config._authRetry) return response;

    config._authRetry = true;
    const refreshedSession = await authApi.refreshSession();
    if (!refreshedSession?.access_token) {
      if (store.getState().auth.session) store.dispatch(setSession(null));
      return response;
    }

    store.dispatch(setSession(refreshedSession));
    config.headers.set("Authorization", `Bearer ${refreshedSession.access_token}`);
    return apiClient.request(config);
  });

  return () => {
    apiClient.interceptors.request.eject(requestInterceptor);
    apiClient.interceptors.response.eject(responseInterceptor);
  };
}

/** Axios-backed fetch-style helper for endpoints that should silently refresh on 401. */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const response = await apiClient.request<ArrayBuffer>({
    url: path.startsWith("/") ? path : `/${path}`,
    method: options.method ?? "GET",
    headers: toAxiosHeaders(options.headers),
    data: options.body,
    signal: options.signal ?? undefined,
    responseType: "arraybuffer",
  });

  return toFetchResponse(response);
}

function toAxiosHeaders(headers?: HeadersInit): Record<string, string> {
  const result: Record<string, string> = {};
  new Headers(headers).forEach((value, name) => {
    result[name] = value;
  });
  return result;
}

function toFetchResponse(response: AxiosResponse<ArrayBuffer>) {
  const headers = new Headers();
  const responseHeaders = response.headers as Record<string, unknown>;
  for (const [name, value] of Object.entries(responseHeaders)) {
    if (Array.isArray(value)) headers.set(name, value.join(", "));
    else if (value !== undefined) headers.set(name, String(value));
  }

  const emptyBodyStatus = [204, 205, 304].includes(response.status);
  return new Response(emptyBodyStatus ? null : response.data, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
