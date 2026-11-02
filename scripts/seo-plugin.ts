/**
 * Build-time SEO for a page that is otherwise rendered in the browser.
 *  - <!--seo:head-->   → title, description, Open Graph, canonical and JSON-LD structured data
 *  - <!--seo:static--> → a plain-HTML copy of the content inside #root, for crawlers and visitors
 *                        without JavaScript (React replaces it as soon as the app starts)
 *  - robots.txt always, sitemap.xml once `profile.siteUrl` is set
 * Everything is generated from src/data, so this HTML can never drift from the real site.
 */
import type { Plugin } from "vite";
import type { L } from "../src/i18n/lang";
import { liveSocials, profile } from "../src/data/profile";
import { projects } from "../src/data/projects";
import { seoText } from "../src/data/seo";
import { services } from "../src/data/stack";
import { ui } from "../src/data/ui";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fa = (x: L) => esc(x.fa);
const site = () => profile.siteUrl.trim().replace(/\/+$/, "");
const abs = (path: string) => (site() ? `${site()}/${path}` : path);
const id = (frag: string) => (site() ? `${site()}/#${frag}` : `#${frag}`);
const nameOf = (n: L) => (n.fa === n.en ? n.en : `${n.fa} (${n.en})`);

function jsonLd() {
  const url = site() ? `${site()}/` : undefined;
  const tools = [...new Set(services.flatMap((s) => s.tools.map((t) => t.name)))];
  const person = {
    "@type": "Person",
    "@id": id("person"),
    name: profile.name.fa,
    alternateName: profile.alternateNames,
    jobTitle: [profile.role.fa, profile.role.en],
    description: ui.hero.sub.fa,
    email: `mailto:${profile.email}`,
    url,
    image: site() ? abs("og.jpg") : undefined,
    sameAs: liveSocials().map((s) => s.url),
    address: { "@type": "PostalAddress", addressCountry: "IR" },
    knowsLanguage: ["fa", "en"],
    knowsAbout: tools,
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: (seoText.serviceNames[s.key] ?? s.title).fa,
        alternateName: (seoText.serviceNames[s.key] ?? s.title).en,
        description: s.text.fa,
        provider: { "@id": id("person") },
      },
    })),
  };
  const website = {
    "@type": "WebSite",
    "@id": id("website"),
    url,
    name: profile.brand,
    alternateName: [profile.name.fa, profile.name.en],
    inLanguage: ["fa-IR", "en"],
    publisher: { "@id": id("person") },
  };
  const page = {
    "@type": "ProfilePage",
    "@id": id("profile"),
    url,
    name: seoText.title.fa,
    description: seoText.description.fa,
    inLanguage: "fa-IR",
    isPartOf: { "@id": id("website") },
    mainEntity: { "@id": id("person") },
  };
  const work = {
    "@type": "ItemList",
    "@id": id("work"),
    name: ui.work.eyebrow.fa,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: nameOf(p.name),
        description: p.tagline.fa,
        keywords: p.stack.join(", "),
        creator: { "@id": id("person") },
        url: p.links?.[0]?.url,
      },
    })),
  };
  return { "@context": "https://schema.org", "@graph": [website, page, person, work] };
}

function headTags() {
  const s = site();
  const title = esc(seoText.title.fa);
  const description = esc(seoText.description.fa);
  const image = abs("og.jpg");
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="keywords" content="${esc(seoText.keywords.join("، "))}" />`,
    `<meta name="author" content="${esc(`${profile.name.fa} (${profile.name.en})`)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    s && `<link rel="canonical" href="${s}/" />`,
    ...liveSocials().map((x) => `<link rel="me" href="${esc(x.url)}" />`),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(profile.brand)}" />`,
    `<meta property="og:locale" content="fa_IR" />`,
    `<meta property="og:locale:alternate" content="en_US" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    s && `<meta property="og:url" content="${s}/" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${fa(seoText.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    // "<" is escaped so the JSON can never close the script tag early
    `<script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, "\\u003c")}</script>`,
  ];
  return tags.filter(Boolean).join("\n    ");
}

function staticPage() {
  const telegram = liveSocials().find((s) => s.id === "telegram");
  const contactLinks = [
    telegram && `<li>تلگرام: <a href="${esc(telegram.url)}" rel="noopener" dir="ltr">${esc(telegram.handle ?? telegram.label)}</a></li>`,
    `<li>ایمیل: <a href="mailto:${esc(profile.email)}" dir="ltr">${esc(profile.email)}</a></li>`,
  ]
    .filter(Boolean)
    .join("");
  const work = projects
    .map(
      (p) => `
        <article>
          <h3>${esc(nameOf(p.name))}</h3>
          <p><strong>${fa(p.kicker)}</strong> — ${fa(p.tagline)}</p>
          <p>${fa(p.summary)}</p>
          <ul>${p.features.map((f) => `<li><strong>${fa(f.title)}:</strong> ${fa(f.text)}</li>`).join("")}</ul>
          <p>${fa(ui.work.stackLabel)}: <span lang="en" dir="ltr">${esc(p.stack.join(", "))}</span></p>
          ${(p.links ?? []).map((x) => `<p><a href="${esc(x.url)}" rel="noopener">${fa(x.label)}</a></p>`).join("")}
        </article>`,
    )
    .join("");
  const serviceList = services.map((s) => `<h3>${fa(s.title)}</h3><p>${fa(s.text)}</p>`).join("");
  return `
      <div class="seo-static">
        <header>
          <p class="seo-brand" lang="en">${esc(profile.brand)}</p>
          <h1>${fa(ui.hero.h1)}</h1>
          <p>${fa(ui.hero.sub)}</p>
          <ul>${contactLinks}</ul>
        </header>
        <main>
          <section>
            <h2>${fa(ui.work.eyebrow)}</h2>
            <p>${fa(ui.work.intro)}</p>${work}
          </section>
          <section>
            <h2>${esc(`${ui.services.title[0].fa} ${ui.services.title[1].fa}`)}</h2>
            <p>${fa(ui.services.intro)}</p>
            ${serviceList}
          </section>
          <section>
            <h2>${fa(ui.about.eyebrow)}</h2>
            <p>${fa(ui.about.statement)}</p>
          </section>
          <section>
            <h2>${fa(ui.contact.title1)}</h2>
            <p>${fa(ui.contact.title2)}</p>
            <ul>${contactLinks}</ul>
          </section>
        </main>
        <section lang="en" dir="ltr">
          <h2>${esc(ui.hero.h1.en)}</h2>
          <p>${esc(ui.hero.sub.en)}</p>
          <ul>${projects.map((p) => `<li><strong>${esc(p.name.en)}</strong> — ${esc(p.tagline.en)}</li>`).join("")}</ul>
          <p><a href="?lang=en">Read this site in English</a></p>
        </section>
      </div>
    `;
}

function robots() {
  const lines = ["User-agent: *", "Allow: /"];
  if (site()) lines.push("", `Sitemap: ${site()}/sitemap.xml`);
  return lines.join("\n") + "\n";
}

function sitemap() {
  if (!site()) return null;
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site()}/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`;
}

export function seo(): Plugin {
  return {
    name: "sdn-seo",
    transformIndexHtml(html) {
      return html.replace("<!--seo:head-->", headTags()).replace("<!--seo:static-->", staticPage());
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots() });
      const map = sitemap();
      if (map) this.emitFile({ type: "asset", fileName: "sitemap.xml", source: map });
    },
  };
}
