import { notFound } from "next/navigation";

// Ловит любой путь внутри валидной локали, для которого нет страницы
// (например /ru/foo), и явно вызывает notFound() — тогда Next.js рендерит
// app/[locale]/not-found.tsx внутри уже отработавшего LocaleLayout (с Header).
// Без этого файла несовпавший путь вообще не матчится и Next откатывается
// к корневому app/not-found.tsx, минуя layout со всей навигацией.
export default function CatchAll() {
  notFound();
}
