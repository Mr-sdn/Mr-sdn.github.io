// node og.mjs OUT.jpg — renders the hero at 1200×630 for link previews
import puppeteer from "puppeteer-core";

const out = process.argv[2];
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:4173/?lang=en", { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
// a clean card: no nav, no buttons, no hints — just the name, the line and the badge
await page.addStyleTag({
  content: `header, #top .mt-9, #top .mt-8, #top .mt-5.max-w-2xl, #top > div.absolute.bottom-0, .grain { display: none !important; }`,
});
// keep a real pointer parked far from the name so the idle autopilot never sweeps through it
for (let i = 0; i < 26; i++) {
  await page.mouse.move(8 + (i % 2), 620);
  await new Promise((r) => setTimeout(r, 200));
}
await page.screenshot({ path: out, type: "jpeg", quality: 90 });
await browser.close();
console.log("og saved", out);
