# سایت شخصی امیرحسین سدنی — SDN

سایت نمونه‌کار دوزبانه (فارسی راست‌چین / انگلیسی) با React، TypeScript، Tailwind CSS، Motion و یک موتور ذرات WebGL اختصاصی.

## اجرا

```bash
npm install        # فقط بار اول
npm run dev        # حالت توسعه → http://localhost:5173
npm run build      # ساخت نسخهٔ نهایی در پوشهٔ dist
npm run preview    # دیدن همان نسخهٔ نهایی → http://localhost:4173
```

زبان پیش‌فرض فارسی است؛ با `?lang=en` در آدرس یا دکمهٔ «EN» بالای صفحه انگلیسی می‌شود (انتخاب کاربر ذخیره می‌شود).

## ویرایش محتوا

| چه چیزی | کجا |
|---|---|
| اسم، ایمیل، تلگرام، گیت‌هاب، لینکدین، اینستاگرام، «آمادهٔ همکاری» | `src/data/profile.ts` — لینکی که خالی باشد نمایش داده نمی‌شود |
| پنج پروژه (متن‌ها، اعداد، گالری، لینک مایکت) | `src/data/projects.ts` |
| متن‌های رابط (منو، هیرو، دربارهٔ من، تماس) | `src/data/ui.ts` |
| مهارت‌ها و نوار ابزارها | `src/data/stack.ts` |
| رنگ‌ها و فونت‌ها | `src/index.css` (بخش `@theme`) |
| تصاویر و ویدیوها | `public/media/` |

## انتشار روی اینترنت

خروجی `npm run build` (پوشهٔ `dist`) یک سایت استاتیک کامل است و روی هر هاستی کار می‌کند:
Liara (Static)، ArvanCloud، Netlify، Vercel، GitHub Pages یا یک هاست معمولی — فقط محتوای `dist` را آپلود کنید.
مسیرها نسبی‌اند، پس در یک زیرپوشه هم درست کار می‌کند.

بعد از انتشار، در `index.html` مقدار `og:image` را به آدرس کامل تغییر دهید (مثلاً `https://your-domain.ir/og.jpg`) تا پیش‌نمایش لینک در تلگرام و شبکه‌ها درست نشان داده شود.

## مدیاها از کجا آمده‌اند

همهٔ تصاویر و ویدیوها خروجی واقعی خود پروژه‌ها هستند:

- **جادو**: حالت دموی داخلی برنامه (دست‌های شبیه‌سازی‌شده) فریم‌به‌فریم و بدون پنجره رندر شده — `scripts/media/jadoo_capture.py`
- **یک جمله**: فریم‌ها و نسخهٔ ۷۲۰p از فایل `ai_film.mp4` با ffmpeg
- **هلوگپ و آشپزینو**: تصاویر فروشگاهی و اسکرین‌شات‌های پوشهٔ `store/` هر پروژه
- تبدیل همه به WebP/MP4 سبک: `scripts/media/build_media.py` · تصویر پیش‌نمایش لینک: `scripts/media/og.mjs`

## ساختار کد

```
src/
  components/hero/particleEngine.ts   موتور ذرات WebGL2 (اسم با ذرات نورانی، واکنش به نشانگر، تبدیل بین زبان‌ها)
  components/work/                    کارت‌های پروژه، رسانهٔ هر پروژه، دیاگرام‌ها
  components/overlays/                صفحهٔ جزئیات پروژه (#/work/<id>)، گالری، پخش فیلم
  components/                         ناوبری، نوار ابزارها، درباره، مهارت‌ها، تماس، فوتر
  data/                               همهٔ محتوا (دوزبانه)
  i18n/lang.tsx                       زبان، جهت صفحه و اعداد فارسی
```

---

**English:** Bilingual (fa/en) portfolio. `npm install && npm run dev` to run, `npm run build` to produce a static site in `dist/`. All personal data lives in `src/data/`.
