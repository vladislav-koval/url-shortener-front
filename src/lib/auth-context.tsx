"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import type { ClicksPage } from "@/lib/types";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  status: AuthStatus;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  loginUrl: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Бэкенд не отдаёт эндпоинт "текущий пользователь", поэтому статус
  // авторизации определяется по побочному эффекту: /clicks требует сессию
  // и вернёт 401 unauthenticated, если куки нет.
  const refresh = useCallback(async () => {
    setStatus("loading");
    try {
      await api.get<ClicksPage>("/api/v1/clicks", { params: { limit: 1, offset: 0 } });
      setStatus("authenticated");
    } catch {
      setStatus("anonymous");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    api
      .get<ClicksPage>("/api/v1/clicks", { params: { limit: 1, offset: 0 } })
      .then(() => {
        if (!cancelled) setStatus("authenticated");
      })
      .catch(() => {
        if (!cancelled) setStatus("anonymous");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch {
      // даже если запрос не удался, сбрасываем локальное состояние
    }
    await refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      refresh,
      logout,
      loginUrl: `${API_BASE_URL}/api/v1/auth/google/login`,
    }),
    [status, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
