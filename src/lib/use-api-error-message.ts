import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api";

const CLIENT_ERROR_CODES = new Set(["network_error", "unknown_error"]);

export function useApiErrorMessage() {
  const t = useTranslations("api");

  return useCallback(
    (err: unknown): string => {
      if (err instanceof ApiError) {
        if (err.code === "network_error") return t("networkError");
        if (CLIENT_ERROR_CODES.has(err.code)) return t("genericError");
        return err.message;
      }
      return t("genericError");
    },
    [t]
  );
}
