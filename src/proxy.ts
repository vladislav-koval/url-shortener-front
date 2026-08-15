import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Точечно исключаем только реальные статические роуты, а не любой путь
  // с точкой — иначе несуществующие пути вида /asdf.asd минуют next-intl
  // и Next.js трактует сам "asdf.asd" как значение [locale], роняя запрос
  // в корневой notFound() без Header (он рендерится только внутри [locale]/layout.tsx).
  matcher: [
    "/((?!api|_next|_vercel|favicon\\.ico|icon\\.svg|sitemap\\.xml|robots\\.txt).*)",
  ],
};
