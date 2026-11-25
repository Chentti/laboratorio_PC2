import axios from "axios";

export const api = axios.create({ baseURL: "https://campuscultura-api.aaron-navarro.workers.dev/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error.config?.url ?? "";
    if (error.response?.status === 401 && !url.includes("/auth/")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function errorCode(e: unknown): string {
  return axios.isAxiosError(e) ? e.response?.data?.code ?? "" : "";
}

export function errorMsg(e: unknown): string {
  return axios.isAxiosError(e) ? e.response?.data?.message ?? "Error" : "Error";
}

export type PageResp<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};
