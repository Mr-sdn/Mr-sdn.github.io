import type { L } from "../i18n/lang";

/**
 * Search-engine text: the page title, description and keywords.
 * Used by the app (title per language) and by the build (scripts/seo-plugin.ts writes the <head>,
 * the structured data and a plain-HTML copy of the page for crawlers).
 */
export const seoText = {
  title: {
    fa: "امیرحسین سدنی (SDN) | انجام پروژه برنامه‌نویسی، اپ موبایل و ربات",
    en: "Amirhossein Sadani (SDN) — Software Developer: Apps, Web, Bots & AI",
  } satisfies L,
  description: {
    fa: "انجام پروژه برنامه‌نویسی توسط امیرحسین سدنی (SDN): ساخت اپ موبایل با Flutter، طراحی سایت و بک‌اند، ربات تلگرام و بله، و پروژه‌های پایتون و هوش مصنوعی. نمونه‌کارها و راه‌های تماس.",
    en: "Amirhossein Sadani (SDN), a software developer in Iran: Flutter mobile apps, websites and backends, Telegram and Bale bots, and Python and AI projects. Portfolio and contact.",
  } satisfies L,
  keywords: [
    "امیرحسین سدنی",
    "امیرحسین",
    "SDN",
    "اس دی ان",
    "انجام پروژه",
    "انجام پروژه برنامه نویسی",
    "انجام پروژه پایتون",
    "انجام پروژه فلاتر",
    "ساخت اپ موبایل",
    "طراحی سایت",
    "ساخت ربات تلگرام",
    "ربات بله",
    "برنامه نویس فریلنسر",
    "Amirhossein Sadani",
    "Flutter developer",
    "Telegram bot developer",
  ],
  /** How each service is named in structured data — the phrases people actually search for. */
  serviceNames: {
    mobile: { fa: "انجام پروژهٔ اپ موبایل با Flutter", en: "Flutter mobile app development" },
    web: { fa: "طراحی سایت و انجام پروژهٔ بک‌اند", en: "Website and backend development" },
    bots: { fa: "ساخت ربات تلگرام و بله", en: "Telegram and Bale bot development" },
    ai: { fa: "انجام پروژهٔ پایتون و هوش مصنوعی", en: "Python and AI projects" },
  } as Record<string, L>,
  ogImageAlt: { fa: "SDN — امیرحسین سدنی، توسعه‌دهندهٔ نرم‌افزار", en: "SDN — Amirhossein Sadani, software developer" } satisfies L,
};
