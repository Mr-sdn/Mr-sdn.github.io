// node og.mjs PUPPETEER_DIR OUT.jpg — renders the hero at 1200×630 for link previews (Telegram, X, …).
// Needs `npm run build && npm run preview` running on :4173, and a folder with puppeteer-core installed.
import { createRequire } from "node:module";
import path from "node:path";

const [deps, out] = process.argv.slice(2);
const puppeteer = createRequire(path.join(deps, "package.json"))("puppeteer-core");
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:4173/?lang=fa", { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
// a clean card: the particle word, one fixed line instead of the rotating one, and the name
await page.addStyleTag({
  content: `header, #top .mt-9, #top .mt-8, #top p.mt-6, #top p.mt-5, #top > div.absolute.bottom-0, .grain { display: none !important; }
    .og-lead { margin: 22px 0 0; font: 600 40px/1.4 "Vazirmatn Variable", sans-serif; color: #f6f6f8; text-align: center; }
    .og-lead span { background: linear-gradient(100deg, #ffd38c, #ffb547 60%, #ff8a3d); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .og-name { margin: 14px 0 0; font: 400 22px/1.6 "Vazirmatn Variable", sans-serif; color: #8b8ba1; text-align: center; }`,
});
await page.evaluate(() => {
  const slot = document.querySelector("#top [aria-hidden].w-full.max-w-6xl");
  slot.insertAdjacentHTML(
    "afterend",
    `<p class="og-lead"><span>اپ موبایل، سایت و ربات</span> می‌سازم؛ از ایده تا تحویل.</p>
     <p class="og-name">امیرحسین سدنی · انجام پروژهٔ برنامه‌نویسی</p>`,
  );
});
// keep a real pointer parked in a corner so the idle autopilot never sweeps through the word
for (let i = 0; i < 26; i++) {
  await page.mouse.move(8 + (i % 2), 620);
  await new Promise((r) => setTimeout(r, 200));
}
await page.screenshot({ path: out, type: "jpeg", quality: 90 });
await browser.close();
console.log("og saved", out);
