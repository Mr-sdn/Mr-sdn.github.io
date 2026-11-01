import type { L } from "../i18n/lang";

/**
 * Everything personal lives here — edit this file to update the site.
 * A social link with an empty url is hidden automatically.
 */
export const profile = {
  name: { fa: "امیرحسین سدنی", en: "Amirhossein Sadani" } satisfies L,
  /** The word the particles form in the hero. "|" marks where it may wrap on narrow screens. */
  heroWord: { fa: "امیرحسین", en: "AMIR|HOSSEIN" } satisfies L,
  brand: "SDN",
  role: { fa: "توسعه‌دهنده نرم‌افزار", en: "Software developer" } satisfies L,
  location: { fa: "ایران", en: "Iran" } satisfies L,
  timezone: "Asia/Tehran",
  utcOffset: "UTC+3:30",
  email: "sdndevelop@gmail.com",
  available: true,
  socials: [
    { id: "telegram", label: "Telegram", url: "" }, // e.g. https://t.me/your_username
    { id: "github", label: "GitHub", url: "" }, // e.g. https://github.com/your_username
    { id: "linkedin", label: "LinkedIn", url: "" }, // e.g. https://www.linkedin.com/in/your_username
    { id: "instagram", label: "Instagram", url: "" }, // e.g. https://instagram.com/your_username
  ] as { id: SocialId; label: string; url: string }[],
};

export type SocialId = "telegram" | "github" | "linkedin" | "instagram" | "email";
