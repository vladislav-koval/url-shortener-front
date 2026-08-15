import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function resolveLocale(rawLocale: string) {
  return hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;
}

// alt — единственное поле в конвенции opengraph-image, которое нельзя просто
// экспортировать константой: next читает `export const alt` один раз при
// сборке модуля, до того как известна локаль запроса. generateImageMetadata —
// официальный способ Next.js сделать его зависимым от params (locale).
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "metadata" });

  return [{ id: "og", alt: t("ogImageAlt"), size, contentType }];
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "home" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #8b7cf9, #2dd9cd)",
            }}
          >
            <svg
              width="46"
              height="46"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0a0a0f"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 17H7A5 5 0 0 1 7 7h2" />
              <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
              <line x1="8" x2="16" y1="12" y2="12" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#f2f2f7" }}>
            shrtly
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 44,
            fontWeight: 600,
            color: "#f2f2f7",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {t("titleLine1")}&nbsp;{t("titleAccent")}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 26,
            color: "#8f8fa3",
            textAlign: "center",
            maxWidth: 860,
            lineHeight: 1.5,
          }}
        >
          {t("subtitle")}
        </div>
      </div>
    ),
    { ...size }
  );
}
