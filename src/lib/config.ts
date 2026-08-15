export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost";

// Публичный адрес самого фронтенда — нужен для абсолютных URL в sitemap/robots/hreflang.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
