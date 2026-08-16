import { API_BASE_URL } from "./config";
import type {
  ApiErrorBody,
  ApiErrorDetail,
  ClicksPage,
  CreateLinkResponse,
} from "./types";

export class ApiError extends Error {
  code: string;
  status: number;
  details?: ApiErrorDetail[];

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.code = body.code;
    this.status = status;
    this.details = body.details;
  }
}

export function isInvalidArgument(err: unknown): err is ApiError {
  return err instanceof ApiError && err.code === "invalid_argument";
}

type UnauthorizedListener = () => void;
let onUnauthorized: UnauthorizedListener | null = null;

// AuthProvider регистрирует сюда сброс статуса в anonymous. Так любой 401
// от бэка (протухшая/отсутствующая сессия), с какой бы ручки он ни пришёл,
// сразу отражается в глобальном auth-статусе, а не только там, где именно
// этот запрос был сделан.
export function setUnauthorizedHandler(listener: UnauthorizedListener | null) {
  onUnauthorized = listener;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | undefined>;
  body?: unknown;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers, body, ...rest } = options;

  const url = new URL(path, API_BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      ...rest,
      credentials: "include",
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Сообщение техническое, для отображения компоненты берут перевод по коду.
    throw new ApiError(0, { code: "network_error", message: "Network error" });
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => undefined)
    : undefined;

  if (!res.ok) {
    if (res.status === 401) onUnauthorized?.();
    throw new ApiError(
      res.status,
      data ?? { code: "unknown_error", message: "Unknown error" },
    );
  }

  return data as T;
}

export const api = {
  getClicks: (params: { limit: number; offset: number }) =>
    request<ClicksPage>("/api/v1/clicks", { method: "GET", params }),

  createLink: (url: string) =>
    request<CreateLinkResponse>("/api/v1/link", {
      method: "POST",
      body: { url },
    }),

  logout: () => request<void>("/api/v1/auth/logout", { method: "POST" }),
};
