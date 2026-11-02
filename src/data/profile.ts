import type { L } from "../i18n/lang";

/**
 * Everything personal lives here — edit this file to update the site.
 * A social link with an empty url is hidden automatically.
 */
export const profile = {
  name: { fa: "امیرحسین سدنی", en: "Amirhossein Sadani" } satisfies L,
  /** The word the particles form in the hero. "|" marks where it may wrap on narrow screens. */
  heroWord: { fa: "SDN", en: "SDN" } satisfies L,
  brand: "SDN",
  /** Other spellings people search for (used in the page's structured data). */
  alternateNames: ["SDN", "اس دی ان", "امیرحسین سدنی", "Amirhossein Sadani"],
  role: { fa: "توسعه‌دهندهٔ نرم‌افزار", en: "Software developer" } satisfies L,
  location: { fa: "ایران", en: "Iran" } satisfies L,
  timezone: "Asia/Tehran",
  utcOffset: "UTC+3:30",
  email: "sdndevelop@gmail.com",
  /**
   * The site's public address once it is online, e.g. "https://sdn.ir" (no trailing slash).
   * The build uses it for the canonical link, og:image, sitemap.xml and robots.txt.
   * Leave it empty until the site has a domain.
   */
  siteUrl: "https://mr-sdn.github.io",
  available: true,
  socials: [
    { id: "telegram", label: "Telegram", handle: "@amirhosseinsdn", url: "https://t.me/amirhosseinsdn" },
    { id: "github", label: "GitHub", handle: "Mr-sdn", url: "https://github.com/Mr-sdn" },
    { id: "linkedin", label: "LinkedIn", url: "" }, // e.g. https://www.linkedin.com/in/your_username
    { id: "instagram", label: "Instagram", url: "" }, // e.g. https://instagram.com/your_username
  ] as { id: SocialId; label: string; handle?: string; url: string }[],
};

export type SocialId = "telegram" | "github" | "linkedin" | "instagram" | "email";

/** Public profile links (for structured data and the contact section). */
export const liveSocials = () => profile.socials.filter((s) => s.url);
