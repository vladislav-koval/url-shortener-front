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
import { api, setUnauthorizedHandler } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

export type AuthStatus = "authenticated" | "anonymous";

interface AuthContextValue {
  status: AuthStatus;
  logout: () => Promise<void>;
  loginUrl: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialStatus,
}: {
  children: ReactNode;
  initialStatus: AuthStatus;
}) {
  const [status, setStatus] = useState<AuthStatus>(initialStatus);

  useEffect(() => {
    setUnauthorizedHandler(() => setStatus("anonymous"));
    return () => setUnauthorizedHandler(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setStatus("anonymous");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      logout,
      loginUrl: `${API_BASE_URL}/api/v1/auth/google/login`,
    }),
    [status, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
