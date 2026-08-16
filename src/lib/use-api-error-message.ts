import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api";

export function useApiErrorMessage() {
  const t = useTranslations("api");

  return useCallback(
    (err: unknown): string => {
      if (!(err instanceof ApiError)) {
        return t("genericError");
      }

      switch (err.code) {
        case "network_error":
          return t("networkError");

        case "unauthenticated":
          return t("unauthenticated");

        case "unauthorized":
          return t("forbidden");

        case "not_found":
          return t("notFound");

        case "conflict":
          return t("conflict");

        case "invalid_argument":
          return t("invalidArgument");

        case "internal_error":
        case "unknown_error":
        default:
          return t("genericError");
      }
    },
    [t],
  );
}
