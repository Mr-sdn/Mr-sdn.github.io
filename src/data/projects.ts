import type { L } from "../i18n/lang";

const l = (fa: string, en: string): L => ({ fa, en });
// `import.meta.env` is missing when the build reads this file in Node (see vite.config.ts)
export const media = (p: string) => `${import.meta.env?.BASE_URL ?? "./"}media/${p}`;

export type ProjectId = "hellogap" | "jadoo" | "learnhub" | "ashpazino" | "bale-chat" | "ai-offline" | "telegram-bots";

export type FeatureIcon =
  | "zap" | "video" | "messages" | "shield" | "coins" | "gauge"
  | "hand" | "sparkles" | "music" | "volume" | "camera" | "layers"
  | "chef" | "list" | "eye" | "wifiOff" | "flask"
  | "terminal" | "globe" | "mouse" | "lock" | "book" | "boxes"
  | "user" | "tag" | "bot" | "briefcase" | "folder" | "lifebuoy";

export type Img = { src: string; small?: string; w: number; h: number; alt: L; caption?: L };

export type Project = {
  id: ProjectId;
  index: string;
  name: L;
  kicker: L;
  tagline: L;
  summary: L;
  year: string;
  role: L;
  platform: L;
  stack: string[];
  accent: { a: string; b: string };
  metrics: { value: string; label: L }[];
  features: { icon: FeatureIcon; title: L; text: L }[];
  details: L[];
  gallery: Img[];
  links?: { label: L; url: string }[];
  credits?: L;
};

const wide = (dir: string, name: string, alt: L, caption?: L): Img => ({
  src: media(`${dir}/${name}-1600.webp`),
  small: media(`${dir}/${name}-800.webp`),
  w: 1600,
  h: 900,
  alt,
  caption,
});

export const jadooModes = [
  {
    key: "NEBULA",
    name: l("سحابی", "Nebula"),
    text: l("هزاران ذرهٔ نورانی شکل دستت را می‌گیرند؛ مشت گوی انرژی می‌سازد و باز کردن دست آن را منفجر می‌کند.", "Thousands of glowing particles take the shape of your hand; a fist charges an orb, and opening it sets it off."),
    start: 0,
    img: "nebula",
    color: "#7dd3fc",
  },
  {
    key: "ECHO",
    name: l("پژواک", "Echo"),
    text: l("طرح دست ردهای رنگی پشت سرش می‌گذارد؛ با نیشگون، شکل دست روی صفحه ثابت می‌ماند.", "Your hand's outline leaves coloured trails; a pinch freezes its shape on screen."),
    start: 5.5,
    img: "echo",
    color: "#facc15",
  },
  {
    key: "LIGHT PAINT",
    name: l("نقاشی نور", "Light paint"),
    text: l("با نیشگون در هوا با نور نئون نقاشی کن؛ اگر مشت را نگه داری، نقاشی پخش می‌شود.", "Pinch to draw neon in mid-air; hold a fist and the drawing breaks apart."),
    start: 10.5,
    img: "paint",
    color: "#f472b6",
  },
  {
    key: "STORM",
    name: l("طوفان", "Storm"),
    text: l("بین انگشت‌ها و بین دو دست رعد و برق می‌زند؛ مشت گوی پلاسما را شارژ می‌کند.", "Lightning jumps between your fingers and between both hands; a fist charges a plasma orb."),
    start: 14.5,
    img: "storm",
    color: "#93c5fd",
  },
  {
    key: "GALAXY",
    name: l("کهکشان", "Galaxy"),
    text: l("کهکشانی مارپیچی در کف دست؛ مشت سیاه‌چاله می‌سازد و باز کردنش انفجار بزرگ.", "A spiral galaxy in your palm; a fist makes a black hole, and opening it triggers a Big Bang."),
    start: 19.5,
    img: "galaxy",
    color: "#c084fc",
  },
] as const;
export const JADOO_REEL_LENGTH = 25;

export const projects: Project[] = [
  // ───────────────────────────────────────────── 01 HelloGap
  {
    id: "hellogap",
    index: "01",
    name: l("هلوگپ", "HelloGap"),
    kicker: l("اپ موبایل · Flutter + Node.js", "Mobile app · Flutter + Node.js"),
    tagline: l("چت و تماس تصویری ناشناس با آدم‌های جدید.", "Anonymous chat and video calls with new people."),
    summary: l(
      "اپ چت و تماس تصویری ناشناس که کاربرهای آنلاین را در چند ثانیه به هم وصل می‌کند. اپ، سرور، پنل مدیریت و تست‌ها را خودم ساختم. ثبت‌نام لازم ندارد و هیچ اطلاعات شخصی‌ای جمع نمی‌کند.",
      "An anonymous chat and video-call app that pairs online users within seconds. I built the app, the server, the admin panel and the tests. No sign-up, and no personal data collected.",
    ),
    year: "2026",
    role: l("طراحی و توسعهٔ اپ و سرور", "App and server, design to code"),
    platform: l("اندروید", "Android"),
    stack: ["Flutter", "Dart", "Socket.IO", "WebRTC", "Node.js", "Fastify", "Redis", "coturn", "PM2", "Docker"],
    accent: { a: "#a855f7", b: "#fb923c" },
    metrics: [
      { value: "P2P", label: l("تماس تصویری WebRTC با رلهٔ TURN", "WebRTC video with a TURN fallback") },
      { value: "0", label: l("اطلاعات شخصی؛ بدون ثبت‌نام", "personal data collected — no sign-up") },
      { value: "TLS", label: l("گواهی سرور پین‌شده در اپ", "server certificate pinned in the app") },
    ],
    features: [
      {
        icon: "zap",
        title: l("جفت‌شدن فوری", "Instant matching"),
        text: l("صف جفت‌سازی روی Redis کاربرهای آنلاین را همان لحظه به هم وصل می‌کند؛ فیلتر جنسیت هم دارد.", "A Redis matchmaking queue pairs online users instantly, with an optional gender filter."),
      },
      {
        icon: "video",
        title: l("تماس تصویری", "Video calls"),
        text: l("تماس نظیربه‌نظیر با WebRTC و ری‌اکشن‌های متحرک. اگر شبکه اتصال مستقیم را ببندد، تماس از سرور TURN رد می‌شود.", "Peer-to-peer WebRTC calls with animated reactions. When a network blocks direct links, the call goes through a TURN server."),
      },
      {
        icon: "messages",
        title: l("پیام‌ها گم نمی‌شوند", "Messages that wait"),
        text: l("اگر اپ بسته باشد، پیام منتظر می‌ماند و بعداً تحویل می‌شود؛ با تیک «ارسال شد» و «دیده شد».", "If the app is closed, messages wait and arrive later, with sent and seen ticks."),
      },
      {
        icon: "shield",
        title: l("امنیت کاربرها", "User safety"),
        text: l("ارسال شماره تلفن خودکار مسدود می‌شود، اسکرین‌شات غیرفعال است و گزارش‌ها به صف بررسی می‌روند.", "Phone numbers are blocked automatically, screenshots are disabled and reports go to a review queue."),
      },
      {
        icon: "coins",
        title: l("کیف پول سکه", "Coin wallet"),
        text: l("کیف پول سمت سرور با سکهٔ رایگان روزانه و قوانین ضدتقلب، برای فیلترهای ویژه.", "A server-side wallet with daily free coins and anti-abuse rules, used for premium filters."),
      },
      {
        icon: "gauge",
        title: l("پنل مدیریت و تست بار", "Admin panel & load tests"),
        text: l("پنل مدیریت با هشدار سلامت سرور، آمار و صف گزارش‌ها؛ و اسکریپت‌های تست بار و TURN قبل از هر نسخه.", "An admin panel with health alerts, stats and the report queue, plus load-test and TURN-probe scripts before every release."),
      },
    ],
    details: [
      l(
        "اپ Flutter (با Provider، go_router و رابط فارسی راست‌چین) از طریق Socket.IO با سرور Node.js در ارتباط است و گواهی TLS سرور داخل اپ پین شده.",
        "The Flutter app (Provider, go_router, a Persian right-to-left UI) talks to a Node.js server over Socket.IO, with the server's TLS certificate pinned inside the app.",
      ),
      l(
        "‏Fastify درخواست‌های HTTP و پنل مدیریت را جواب می‌دهد. Redis وضعیت آنلاین، صف‌ها، کیف پول و مسدودی‌ها را نگه می‌دارد و با آداپتر Redis چند پروسهٔ PM2 اتاق‌های Socket.IO را با هم تقسیم می‌کنند.",
        "Fastify serves HTTP and the admin panel. Redis holds presence, queues, wallets and bans, and the Socket.IO Redis adapter lets several PM2 workers share rooms.",
      ),
      l(
        "تماس از همان سوکت مذاکره می‌شود و نظیربه‌نظیر روی WebRTC جریان دارد؛ در شبکه‌های محدود، coturn تماس را رله می‌کند.",
        "Calls are negotiated over the same socket and stream peer-to-peer over WebRTC; on restrictive networks coturn relays them.",
      ),
    ],
    gallery: [
      { src: media("hellogap/call-720.webp"), small: media("hellogap/call-360.webp"), w: 720, h: 1080, alt: l("پوستر هلوگپ: تماس تصویری با ری‌اکشن", "HelloGap poster: video call with reactions"), caption: l("تماس تصویری تصادفی با ری‌اکشن", "Random video calls with reactions") },
      { src: media("hellogap/chat-720.webp"), small: media("hellogap/chat-360.webp"), w: 720, h: 1080, alt: l("پوستر هلوگپ: چت با تیک دیده شد", "HelloGap poster: chat with seen ticks"), caption: l("چت با تیک «دیده شد»", "Chat with seen ticks") },
      { src: media("hellogap/home-720.webp"), small: media("hellogap/home-360.webp"), w: 720, h: 1080, alt: l("پوستر هلوگپ: صفحهٔ خانه", "HelloGap poster: home screen"), caption: l("صفحهٔ خانه: چت تصادفی یا تماس تصویری", "Home: random chat or video call") },
    ],
  },

  // ───────────────────────────────────────────── 02 JADOO
  {
    id: "jadoo",
    index: "02",
    name: l("جادو", "JADOO"),
    kicker: l("بینایی ماشین · گرافیک تعاملی · صدا", "Computer vision · interactive graphics · sound"),
    tagline: l("حرکت دست جلوی وب‌کم به نور و صدا تبدیل می‌شود.", "Hand movements in front of a webcam become light and sound."),
    summary: l(
      "جادو با یک وب‌کم معمولی تا دو دست را دنبال می‌کند و هر حرکت را به جلوهٔ نوری و صدا تبدیل می‌کند. پنج حالت دارد؛ از ذراتی که شکل دست را می‌گیرند تا رعد و برق بین انگشت‌ها. همهٔ صداها همان لحظه با کد ساخته می‌شوند و هیچ فایل صوتی‌ای در پروژه نیست.",
      "JADOO tracks up to two hands through an ordinary webcam and turns every movement into light and sound. It has five modes, from particles that take the shape of your hand to lightning between your fingers. All sound is synthesized live; the project contains no audio files.",
    ),
    year: "2026",
    role: l("ایده، گرافیک، صدا و کد", "Concept, graphics, sound & code"),
    platform: l("ویندوز · پایتون", "Windows · Python"),
    stack: ["Python", "MediaPipe", "OpenCV", "NumPy", "Numba", "Pillow", "sounddevice", "FFmpeg"],
    accent: { a: "#22d3ee", b: "#e879f9" },
    metrics: [
      { value: "21×2", label: l("نقطهٔ ردیابی روی دو دست", "tracked points on two hands") },
      { value: "26k", label: l("ذره در بالاترین کیفیت", "particles at the highest quality") },
      { value: "0", label: l("فایل صوتی؛ همه با سنتز زنده", "audio files — all live synthesis") },
    ],
    features: [
      {
        icon: "hand",
        title: l("تشخیص حرکات", "Gesture detection"),
        text: l("۲۱ نقطه برای هر دست با MediaPipe، صاف‌شده با فیلتر One-Euro؛ مشت، نیشگون، کف باز و علامت V به فرمان تبدیل می‌شوند.", "21 landmarks per hand from MediaPipe, smoothed with a One-Euro filter; fist, pinch, open palm and a V-sign become commands."),
      },
      {
        icon: "sparkles",
        title: l("رندر سریع", "Fast rendering"),
        text: l("نور ترکیبی، درخشش (bloom) و کرنل‌های Numba ده‌ها هزار ذره را روی لپ‌تاپ روان نگه می‌دارند.", "Additive light, bloom and Numba kernels keep tens of thousands of particles smooth on a laptop."),
      },
      {
        icon: "music",
        title: l("دست به‌جای ساز", "Your hand as an instrument"),
        text: l("ارتفاع دست نت را انتخاب می‌کند، سرعت حرکت بلندی صدا را، و باز یا بسته بودن دست رنگ صدا را.", "Hand height picks the note, speed sets the volume, and an open or closed hand changes the tone."),
      },
      {
        icon: "volume",
        title: l("صدا با کد", "Sound in code"),
        text: l("یک سینت‌سایزر زنده با صدای جرقه، پژواک و ریورب؛ بدون هیچ فایل صوتی.", "A live synthesizer with crackles, echo and reverb — no audio files."),
      },
      {
        icon: "camera",
        title: l("عکس و فیلم", "Photos & videos"),
        text: l("با یک کلید عکس و با کلید دیگر فیلم MP4 همراه صدا ذخیره می‌شود.", "One key saves a photo, another records an MP4 with sound."),
      },
      {
        icon: "layers",
        title: l("پنج حالت", "Five modes"),
        text: l("سحابی، پژواک، نقاشی نور، طوفان و کهکشان؛ با یک ثانیه نگه‌داشتن علامت V حالت عوض می‌شود.", "Nebula, Echo, Light Paint, Storm and Galaxy — hold a V-sign for a second to switch."),
      },
    ],
    details: [
      l(
        "دوربین در یک thread جدا تصویر را به MediaPipe می‌دهد و لایهٔ حرکات، نقطه‌های خام را به رویدادهای پایدار تبدیل می‌کند. هر حالت یک کلاس کوچک با update و render و صدای خودش است؛ برای اضافه کردن حالت جدید فقط یک فایل لازم است.",
        "A camera thread feeds MediaPipe, and a gesture layer turns raw landmarks into stable events. Each mode is a small class with its own update, render and sound; adding a mode takes one new file.",
      ),
      l(
        "تصاویر و ویدیوی این صفحه از حالت دموی خود برنامه (دست‌های شبیه‌سازی‌شده، بدون وب‌کم) با کیفیت 1080p و ۳۰ فریم در ثانیه رندر شده‌اند.",
        "The images and video on this page were rendered from the app's built-in demo mode (simulated hands, no webcam) at 1080p, 30 fps.",
      ),
    ],
    gallery: [
      wide("jadoo", "nebula", l("حالت سحابی: دو دست از ذرات رنگی", "Nebula mode: two hands made of coloured particles"), l("سحابی؛ دست‌ها از ذرات", "Nebula — hands made of particles")),
      wide("jadoo", "echo", l("حالت پژواک: ردهای نئونی دست‌ها", "Echo mode: neon trails of hands"), l("پژواک؛ ردهای نئونی", "Echo — neon trails")),
      wide("jadoo", "storm", l("حالت طوفان: گوی پلاسما و رعد و برق", "Storm mode: plasma orb and lightning"), l("طوفان؛ گوی پلاسما", "Storm — a plasma orb")),
      wide("jadoo", "galaxy", l("حالت کهکشان: کهکشان مارپیچی", "Galaxy mode: a spiral galaxy"), l("کهکشان در کف دست", "Galaxy — a spiral in your palm")),
      wide("jadoo", "nebula-title", l("ذرات اسم JADOO را می‌سازند", "Particles spell JADOO"), l("وقتی دستی جلوی دوربین نیست، ذرات اسم برنامه را می‌سازند", "With no hands in view, the particles spell the name")),
      wide("jadoo", "echo-2", l("پژواک با دو دست", "Echo with two hands"), l("پژواک با دو دست", "Echo — two hands")),
      wide("jadoo", "storm-2", l("قوس الکتریکی بین دو دست", "An electric arc between two hands"), l("طوفان؛ قوس بین دو دست", "Storm — an arc between two hands")),
      wide("jadoo", "galaxy-bang", l("انفجار بزرگ در حالت کهکشان", "Big Bang in Galaxy mode"), l("کهکشان؛ از سیاه‌چاله تا انفجار بزرگ", "Galaxy — black hole to Big Bang")),
      wide("jadoo", "paint", l("نقاشی نور با نیشگون", "Light painting with a pinch"), l("نقاشی نور", "Light paint")),
      wide("jadoo", "nebula-orb", l("مشت، گوی انرژی می‌سازد", "A fist charges an energy orb"), l("سحابی؛ گوی انرژی", "Nebula — an energy orb")),
    ],
  },

  // ───────────────────────────────────────────── 03 LearnHub
  {
    id: "learnhub",
    index: "03",
    name: l("LearnHub", "LearnHub"),
    kicker: l("سایت فروش دورهٔ آنلاین · Flask", "Online course platform · Flask"),
    tagline: l("فروشگاه دورهٔ آموزشی با پرداخت رمزارز، کد تخفیف و پنل مدیریت کامل.", "A course store with crypto checkout, coupons and a full admin panel."),
    summary: l(
      "یک پلتفرم کامل فروش دورهٔ آنلاین. کاربر ثبت‌نام می‌کند، دوره را به سبد خرید اضافه می‌کند، با رمزارز پرداخت می‌کند و بلافاصله به درس‌ها دسترسی دارد. مدیر سایت دوره‌ها، فصل‌ها، درس‌ها، سفارش‌ها، کدهای تخفیف و تیکت‌های پشتیبانی را از یک پنل کنترل می‌کند.",
      "A complete online course store. Students sign up, add courses to a cart, pay in crypto and get the lessons right away. The admin runs courses, modules, lessons, orders, coupons and support tickets from one panel.",
    ),
    year: "2026",
    role: l("طراحی و توسعهٔ فول‌استک", "Full-stack design & development"),
    platform: l("وب", "Web"),
    stack: ["Python", "Flask", "SQLAlchemy", "Jinja2", "Bootstrap", "Flask-Limiter", "Heleket API", "Gunicorn"],
    accent: { a: "#f43f5e", b: "#fbbf24" },
    metrics: [
      { value: "21", label: l("مدل داده؛ از دوره تا تیکت", "data models, from courses to tickets") },
      { value: "90+", label: l("صفحه و مسیر API", "pages and API routes") },
      { value: "0", label: l("کار دستی بعد از پرداخت", "manual steps after payment") },
    ],
    features: [
      {
        icon: "coins",
        title: l("پرداخت با رمزارز", "Crypto checkout"),
        text: l("اتصال به درگاه Heleket: صدور فاکتور، بررسی امضای وب‌هوک، پیگیری وضعیت پرداخت و بازگشت وجه.", "Heleket gateway integration: invoices, signed webhooks, payment status tracking and refunds."),
      },
      {
        icon: "tag",
        title: l("سبد خرید و کد تخفیف", "Cart & coupons"),
        text: l("کد تخفیف درصدی یا مبلغی با حداقل خرید، سقف تخفیف، تاریخ اعتبار و محدودیت استفاده؛ حتی مخصوص یک دوره.", "Percentage or fixed coupons with a minimum order, a discount cap, validity dates and usage limits — even for a single course."),
      },
      {
        icon: "book",
        title: l("دوره، فصل و درس", "Courses, modules & lessons"),
        text: l("ساختار سه‌سطحی با فایل‌های قابل دانلود، سؤالات متداول و نظر دانشجوها برای هر دوره.", "A three-level structure with downloadable files, FAQs and student reviews for every course."),
      },
      {
        icon: "shield",
        title: l("حساب کاربری امن", "Secure accounts"),
        text: l("تأیید ایمیل با کد، بازیابی و تغییر رمز، تأیید تغییر ایمیل و محدودیت تعداد درخواست.", "Email verification codes, password reset and change, confirmed email changes and rate limiting."),
      },
      {
        icon: "lifebuoy",
        title: l("تیکت و اعلان", "Tickets & notifications"),
        text: l("کاربر تیکت پشتیبانی ثبت می‌کند، مدیر جواب می‌دهد و هر دو طرف اعلان می‌گیرند.", "Students open support tickets, admins reply, and both sides get notified."),
      },
      {
        icon: "gauge",
        title: l("پنل مدیریت", "Admin panel"),
        text: l("دوره‌ها، کاربران، سفارش‌ها، کوپن‌ها، نظرات، لاگ پرداخت‌ها و تنظیمات سایت در یک داشبورد.", "Courses, users, orders, coupons, reviews, payment logs and site settings in one dashboard."),
      },
    ],
    details: [
      l(
        "بک‌اند با Flask و SQLAlchemy نوشته شده و ۲۱ مدل داده دارد؛ از کاربر و دوره تا سفارش، کوپن، تیکت و لاگ وب‌هوک. صفحه‌ها با Jinja2 و Bootstrap ساخته شده‌اند و نسخهٔ نهایی روی Gunicorn اجرا می‌شود.",
        "The backend is Flask with SQLAlchemy and 21 data models, from users and courses to orders, coupons, tickets and webhook logs. Pages use Jinja2 and Bootstrap, and production runs on Gunicorn.",
      ),
      l(
        "مسیر پرداخت: سفارش ساخته می‌شود، فاکتور Heleket صادر می‌شود و وقتی وب‌هوکی با امضای معتبر برسد، سفارش پرداخت‌شده ثبت و دانشجو در دوره ثبت‌نام می‌شود. همهٔ وب‌هوک‌ها برای بررسی بعدی ذخیره می‌شوند.",
        "Payment flow: an order is created, a Heleket invoice is issued, and when a correctly signed webhook arrives the order is marked paid and the student is enrolled. Every webhook is stored for later review.",
      ),
    ],
    gallery: [],
  },

  // ───────────────────────────────────────────── 04 Ashpazino
  {
    id: "ashpazino",
    index: "04",
    name: l("آشپزینو", "Ashpazino"),
    kicker: l("اپ اندروید آفلاین · Flutter", "Offline Android app · Flutter"),
    tagline: l("بگو در آشپزخانه چه داری؛ می‌گوید چه بپزی.", "Tell it what's in your kitchen; it tells you what to cook."),
    summary: l(
      "اپ آشپزی فارسی که برای همهٔ سنین، به‌خصوص مادرها و کاربرهای مسن‌تر، طراحی شده. مواد موجود در خانه را انتخاب می‌کنی و آشپزینو نشان می‌دهد همین حالا چه غذاهایی می‌شود پخت و کدام‌ها فقط یکی دو قلم کم دارند. ۳۰۰ دستور پخت ایرانی، قدم‌به‌قدم و دقیق.",
      "A Persian cooking app designed for every age, especially mothers and older users. Pick the ingredients you have, and Ashpazino shows what you can cook right now and what's only one or two items away. 300 Iranian recipes, step by step.",
    ),
    year: "2026",
    role: l("طراحی، توسعه و انتشار", "Design, development & release"),
    platform: l("اندروید · مایکت", "Android · Myket"),
    stack: ["Flutter", "Dart", "ChangeNotifier", "shared_preferences", "wakelock_plus", "Golden tests"],
    accent: { a: "#f97316", b: "#facc15" },
    metrics: [
      { value: "300", label: l("دستور پخت ایرانی در ۱۰ دسته", "Iranian recipes in 10 categories") },
      { value: "0", label: l("دسترسی به اینترنت؛ کاملاً آفلاین", "internet permissions — fully offline") },
      { value: "56px", label: l("کمترین اندازهٔ دکمه، برای همهٔ سنین", "minimum tap target, for every age") },
    ],
    features: [
      {
        icon: "chef",
        title: l("با همین موادی که داری", "Cook with what you have"),
        text: l("غذاهایی که همین حالا می‌شود پخت جدا نشان داده می‌شوند و غذاهایی که یکی دو قلم کم دارند جدا.", "What you can cook right now is listed separately from what's one or two items short."),
      },
      {
        icon: "eye",
        title: l("حالت آشپزی", "Cooking mode"),
        text: l("هر مرحله در یک صفحه با خط درشت، و صفحهٔ گوشی وسط آشپزی خاموش نمی‌شود.", "One step per screen in large type, and the screen stays on while you cook."),
      },
      {
        icon: "list",
        title: l("لیست خرید", "Shopping list"),
        text: l("مواد کم هر غذا با یک لمس به لیست خرید می‌رود؛ هرچه را خریدی تیک بزن تا به مواد خانه اضافه شود.", "Missing ingredients go to the list in one tap; tick what you bought and it moves into your pantry."),
      },
      {
        icon: "hand",
        title: l("برای همهٔ سنین", "Easy for every age"),
        text: l("متن درشت، دکمه‌های بزرگ، کنتراست بالا؛ بدون ثبت‌نام و بدون تایپ در کارهای اصلی.", "Large text, big buttons, high contrast — no sign-up and no typing for the main tasks."),
      },
      {
        icon: "wifiOff",
        title: l("همه‌جا کار می‌کند", "Works anywhere"),
        text: l("بدون اینترنت و بدون سرویس‌های گوگل؛ روی گوشی‌های قدیمی و جدید اندروید.", "No internet and no Google services — runs on old and new Android phones."),
      },
      {
        icon: "flask",
        title: l("داده‌های تست‌شده", "Tested data"),
        text: l("تست‌های خودکار شناسه‌ها و ارجاع‌های همهٔ دستورها را بررسی می‌کنند؛ تصاویر فروشگاه هم با golden test ساخته می‌شوند.", "Automated tests check every recipe id and reference, and the store screenshots are rendered by golden tests."),
      },
    ],
    details: [
      l(
        "دستورها به شکل JSON داخل خود اپ هستند (هر دسته یک فایل) و الگوریتم تطبیق، غذاهای قابل پخت را از غذاهایی که یکی دو قلم کم دارند جدا می‌کند. مواد پایه مثل نمک و روغن همیشه موجود فرض می‌شوند.",
        "Recipes ship inside the app as JSON, one file per category, and the matcher separates what you can cook now from what's one or two items away. Staples like salt and oil are assumed to be at home.",
      ),
      l(
        "هر مرحله یک قالب ثابت دارد: نام ظرف، شدت حرارت، مقدار آب به لیوان، زمان به دقیقه و نشانهٔ آماده شدن. اپ از Firebase و Google Play Services استفاده نمی‌کند، چون خیلی از گوشی‌ها در ایران آن را ندارند.",
        "Every step follows the same format: the pan, the heat, water in cups, minutes and a sign that it's done. The app avoids Firebase and Google Play Services, which many phones in Iran don't have.",
      ),
    ],
    gallery: [
      { src: media("ashpazino/screen-pantry.webp"), w: 540, h: 960, alt: l("صفحهٔ مواد خانه", "Pantry screen"), caption: l("در خانه چه دارید؟", "What's in your kitchen?") },
      { src: media("ashpazino/screen-suggestions.webp"), w: 540, h: 960, alt: l("صفحهٔ پیشنهاد غذا", "Suggestions screen"), caption: l("همین حالا می‌توانید بپزید", "You can cook these now") },
      { src: media("ashpazino/screen-recipe.webp"), w: 540, h: 960, alt: l("صفحهٔ دستور قورمه‌سبزی", "Recipe screen: ghormeh sabzi"), caption: l("دستور پخت، با مواد کم و لیست خرید", "A recipe, with missing items") },
      { src: media("ashpazino/screen-steps.webp"), w: 540, h: 960, alt: l("طرز تهیه قدم‌به‌قدم", "Step-by-step method"), caption: l("طرز تهیهٔ قدم‌به‌قدم", "Step by step") },
      { src: media("ashpazino/screen-cooking_mode.webp"), w: 540, h: 960, alt: l("حالت آشپزی با خط درشت", "Cooking mode in large type"), caption: l("حالت آشپزی", "Cooking mode") },
      { src: media("ashpazino/screen-shopping.webp"), w: 540, h: 960, alt: l("لیست خرید", "Shopping list"), caption: l("لیست خرید", "Shopping list") },
      { src: media("ashpazino/screen-recipes.webp"), w: 540, h: 960, alt: l("فهرست ۳۰۰ دستور پخت", "All 300 recipes"), caption: l("۳۰۰ دستور پخت", "300 recipes") },
      { src: media("ashpazino/banner-pantry-720.webp"), small: media("ashpazino/banner-pantry-360.webp"), w: 720, h: 1280, alt: l("بنر فروشگاه: با مواد خانه غذا بپزید", "Store banner: cook with what you have"), caption: l("بنر فروشگاه", "Store banner") },
      { src: media("ashpazino/banner-steps-720.webp"), small: media("ashpazino/banner-steps-360.webp"), w: 720, h: 1280, alt: l("بنر فروشگاه: ۳۰۰ دستور ایرانی", "Store banner: 300 Iranian recipes"), caption: l("بنر فروشگاه", "Store banner") },
      { src: media("ashpazino/banner-cooking_mode-720.webp"), small: media("ashpazino/banner-cooking_mode-360.webp"), w: 720, h: 1280, alt: l("بنر فروشگاه: خط درشت کنار اجاق", "Store banner: big type by the stove"), caption: l("بنر فروشگاه", "Store banner") },
      { src: media("ashpazino/banner-shopping-720.webp"), small: media("ashpazino/banner-shopping-360.webp"), w: 720, h: 1280, alt: l("بنر فروشگاه: لیست خرید", "Store banner: shopping list"), caption: l("بنر فروشگاه", "Store banner") },
    ],
    links: [{ label: l("آشپزینو در مایکت", "Ashpazino on Myket"), url: "https://myket.ir/app/ir.ashpazino.app" }],
  },

  // ───────────────────────────────────────────── 05 Bale anonymous chat
  {
    id: "bale-chat",
    index: "05",
    name: l("چت ناشناس بله", "Bale Anonymous Chat"),
    kicker: l("ربات پیام‌رسان بله · پایتون", "Bale messenger bot · Python"),
    tagline: l("ربات چت ناشناس با جستجوی هم‌شهری، کیف پول سکه و پنل مدیریت.", "An anonymous chat bot with same-city matching, a coin wallet and an admin panel."),
    summary: l(
      "یک ربات چت ناشناس برای پیام‌رسان بله که بدون نصب برنامهٔ جدا کار می‌کند. کاربر پروفایل می‌سازد (جنسیت، سن، استان و شهر) و تصادفی یا با فیلتر جنسیت، هم‌استانی و هم‌شهری به یک ناشناس وصل می‌شود. پیام، عکس، ویس، ویدیو و فایل رد و بدل می‌شود، بدون اینکه هویت کسی معلوم شود.",
      "An anonymous chat bot for the Bale messenger that works without installing anything. Users set up a profile (gender, age, province and city) and connect with a stranger at random or filtered by gender, province or city. Messages, photos, voice notes, videos and files go through without revealing anyone's identity.",
    ),
    year: "2026",
    role: l("طراحی و توسعهٔ کامل", "Design & development"),
    platform: l("پیام‌رسان بله", "Bale messenger"),
    stack: ["Python", "Bale Bot API", "SQLite (WAL)", "Threading", "Bale Payments"],
    accent: { a: "#14b8a6", b: "#38bdf8" },
    metrics: [
      { value: "31", label: l("استان و بیش از ۴۰۰ شهر برای جستجوی هم‌شهری", "provinces and 400+ cities for local matching") },
      { value: "7", label: l("نوع جستجو: تصادفی، جنسیت، هم‌استانی، هم‌شهری", "search types: random, gender, province, city") },
      { value: "2,900", label: l("خط کد پایتون", "lines of Python") },
    ],
    features: [
      {
        icon: "zap",
        title: l("جفت‌شدن با فیلتر", "Filtered matching"),
        text: l("صف جستجو هر چند ثانیه بررسی می‌شود و کاربرها بر اساس جنسیت، استان، شهر و در صورت تمایل سن نزدیک به هم وصل می‌شوند؛ اگر کسی پیدا نشود، جستجو بعد از دو دقیقه تمام می‌شود.", "The search pool is checked every few seconds and users are paired by gender, province, city and, if they like, similar age; with no match, the search ends after two minutes."),
      },
      {
        icon: "messages",
        title: l("گفتگوی ناشناس", "Anonymous conversations"),
        text: l("پیام متنی، عکس، ویس، ویدیو و فایل بین دو نفر رد و بدل می‌شود؛ بعد از چت می‌شود دوباره به همان نفر درخواست داد.", "Text, photos, voice notes, videos and files are relayed between the two people, and after a chat you can ask the same person again."),
      },
      {
        icon: "coins",
        title: l("کیف پول سکه", "Coin wallet"),
        text: l("جستجوی تصادفی رایگان است و جستجوی فیلتردار سکه می‌خواهد. سکه با پرداخت داخل خود بله خریده می‌شود و هر دعوت ۲۰ سکه هدیه دارد.", "Random search is free and filtered search costs coins. Coins are bought with Bale's in-app payments, and every invited friend earns 20."),
      },
      {
        icon: "shield",
        title: l("گزارش و مسدودسازی", "Reports & bans"),
        text: l("گزارش با دلیل (آزار، اسپم، محتوای نامناسب، حساب جعلی) به کانال بررسی می‌رود و مدیر با یک دکمه کاربر را مسدود می‌کند. سقف ۲۰ پیام در دقیقه جلوی اسپم را می‌گیرد.", "Reports with a reason (harassment, spam, inappropriate content, fake account) go to a review channel, and an admin can ban with one tap. A 20-messages-a-minute cap stops spam."),
      },
      {
        icon: "user",
        title: l("پروفایل", "Profiles"),
        text: l("اسم، سن، جنسیت، استان، شهر و عکس پروفایل؛ هر طرف می‌تواند پروفایل دیگری را ببیند.", "Name, age, gender, province, city and a profile photo; each side can view the other's profile."),
      },
      {
        icon: "gauge",
        title: l("پنل مدیریت", "Admin panel"),
        text: l("آمار کاربرها، پیام همگانی، هدیهٔ سکه، مدیریت کانال‌های عضویت اجباری و خروجی CSV از کاربرها و مسدودها.", "User stats, broadcasts, coin gifts, required-channel management and CSV exports of users and bans."),
      },
    ],
    details: [
      l(
        "ربات مستقیم با Bot API بله کار می‌کند؛ با یک اتصال HTTP مشترک که خطاهای شبکه را دوباره امتحان می‌کند و ۱۶ thread برای پردازش هم‌زمان پیام‌ها. مسیر هر کاربر (ثبت‌نام، جستجو، در چت، گزارش و...) یک ماشین حالت است.",
        "The bot talks to Bale's Bot API directly, with a shared HTTP session that retries network errors and 16 worker threads for concurrent updates. Each user's flow (sign-up, searching, in chat, reporting…) is a state machine.",
      ),
      l(
        "داده‌ها در SQLite با حالت WAL ذخیره می‌شوند. پیام همگانی با چند کارگر موازی و فاصلهٔ کوتاه بین ارسال‌ها فرستاده می‌شود تا از محدودیت‌های بله رد نشود.",
        "Data lives in SQLite in WAL mode. Broadcasts go out through a few parallel workers with short gaps between sends, so they stay within Bale's rate limits.",
      ),
    ],
    gallery: [],
  },

  // ───────────────────────────────────────────── 06 AI Offline
  {
    id: "ai-offline",
    index: "06",
    name: l("هوش مصنوعی آفلاین", "AI Offline"),
    kicker: l("هوش مصنوعی محلی · ایجنت · ویندوز", "Local AI · agents · Windows"),
    tagline: l("دستیار برنامه‌نویسی شخصی که بدون اینترنت کار می‌کند.", "A private coding assistant that works without the internet."),
    summary: l(
      "یک سیستم هوش مصنوعی کاملاً آفلاین روی ویندوز. ‏Ollama مدل‌های Qwen 3.6 و Gemma 4 را روی خود کامپیوتر اجرا می‌کند و OpenCode یک رابط چت در مرورگر و یک ایجنت برنامه‌نویسی در ترمینال می‌دهد؛ Claude Code هم با همین مدل محلی کار می‌کند. با راست‌کلیک روی هر پوشه، ایجنت همان‌جا باز می‌شود و هیچ داده‌ای از سیستم بیرون نمی‌رود.",
      "A fully offline AI setup for Windows. Ollama runs Qwen 3.6 and Gemma 4 on the machine itself, and OpenCode provides a chat interface in the browser and a coding agent in the terminal; Claude Code works with the same local model. Right-click any folder to open an agent there, and no data ever leaves the computer.",
    ),
    year: "2026",
    role: l("طراحی سیستم، اسکریپت و مستندات", "System design, scripting & docs"),
    platform: l("ویندوز ۱۱ · محلی", "Windows 11 · local"),
    stack: ["Ollama", "Qwen 3.6", "Gemma 4", "OpenCode", "Claude Code", "Batch", "PowerShell"],
    accent: { a: "#34d399", b: "#a3e635" },
    metrics: [
      { value: "27 GB", label: l("مدل روی دیسک", "of models on disk") },
      { value: "35B", label: l("پارامتر؛ ۳ میلیارد فعال (MoE)", "parameters · 3B active (MoE)") },
      { value: "0", label: l("درخواست به اینترنت", "requests to the internet") },
    ],
    features: [
      {
        icon: "boxes",
        title: l("دو مدل، یک سوییچ", "Two models, one switch"),
        text: l("‏Qwen 3.6 35B-A3B برای برنامه‌نویسی و چت فارسی؛ Gemma 4 E4B وقتی سرعت مهم‌تر است.", "Qwen 3.6 35B-A3B for coding and Persian chat; Gemma 4 E4B when speed matters more."),
      },
      {
        icon: "globe",
        title: l("رابط در مرورگر", "Browser interface"),
        text: l("فهرست گفتگوها، تغییر نام، حذف و انتخاب پوشهٔ پروژه، در یک رابط وب محلی روی 127.0.0.1.", "Sessions, renaming, deleting and project folders in a local web UI on 127.0.0.1."),
      },
      {
        icon: "terminal",
        title: l("ایجنت در ترمینال", "Agents in the terminal"),
        text: l("‏OpenCode و Claude Code در هر پوشه‌ای با مدل محلی و فراخوانی ابزار کار می‌کنند.", "OpenCode and Claude Code work in any folder against the local model, with tool calling."),
      },
      {
        icon: "mouse",
        title: l("یکپارچه با ویندوز", "Explorer integration"),
        text: l("راست‌کلیک روی هر پوشه ← «باز کردن ایجنت هوش مصنوعی اینجا»؛ فقط برای کاربر فعلی و با یک کلیک قابل حذف.", "Right-click any folder → “Open AI agent here”; per-user only, removable in one click."),
      },
      {
        icon: "lock",
        title: l("قفل روی آفلاین", "Locked offline"),
        text: l("به‌روزرسانی خودکار، تلمتری، دریافت مدل، اشتراک‌گذاری و دانلود LSP خاموش‌اند.", "Auto-update, telemetry, model fetching, sharing and LSP downloads are all switched off."),
      },
      {
        icon: "book",
        title: l("راهنمای فارسی", "Persian guide"),
        text: l("یک راهنمای قدم‌به‌قدم فارسی، تا هر کسی در خانواده بتواند از آن استفاده کند.", "A step-by-step guide in Persian, so anyone in the family can use it."),
      },
    ],
    details: [
      l(
        "یک اسکریپت مشترک همهٔ لانچرها را به Ollama، OpenCode و تنظیمات آفلاینِ داخل همان پوشه وصل می‌کند و سرور مدل را فقط اگر روشن نباشد بالا می‌آورد.",
        "One shared script points every launcher at the bundled Ollama, OpenCode and offline config, and starts the model server only if it isn't already running.",
      ),
      l(
        "تنظیمات OpenCode فقط به Ollama محلی (127.0.0.1:11434) اجازه می‌دهد و کانتکست ۶۴ هزار توکنی دارد. فایل‌های نصب هم کنار پروژه هستند تا کل سیستم روی کامپیوتری بدون اینترنت دوباره راه بیفتد.",
        "The OpenCode config allows only the local Ollama endpoint (127.0.0.1:11434) with a 64K-token context, and the installers sit next to it, so the whole setup can be rebuilt on a machine with no connection at all.",
      ),
    ],
    gallery: [],
  },

  // ───────────────────────────────────────────── 07 Telegram bots
  {
    id: "telegram-bots",
    index: "07",
    name: l("ربات‌های تلگرام", "Telegram Bots"),
    kicker: l("مجموعهٔ ربات · پایتون و Pyrogram", "Bot collection · Python & Pyrogram"),
    tagline: l("از ربات‌سازی که برای هر کاربر یک ربات آپلودر می‌سازد تا واترمارک ویدیو و ویرایش موزیک.", "From a bot builder that creates an uploader bot for each user to video watermarking and music editing."),
    summary: l(
      "شش ربات تلگرام که با پایتون و Pyrogram ساخته‌ام. هر کدام پنل مدیریت داخل خود ربات دارد و کارهای سنگین مثل پردازش ویدیو و صدا را با FFmpeg در پس‌زمینه انجام می‌دهد تا ربات برای بقیهٔ کاربرها کند نشود.",
      "Six Telegram bots I built with Python and Pyrogram. Each has an admin panel inside the bot, and heavy work like video and audio processing runs in the background with FFmpeg, so the bot stays quick for everyone else.",
    ),
    year: "2024–2025",
    role: l("طراحی و توسعه", "Design & development"),
    platform: l("تلگرام", "Telegram"),
    stack: ["Python", "Pyrogram", "asyncio", "MySQL", "SQLite", "FFmpeg", "mutagen", "pydub"],
    accent: { a: "#2aabee", b: "#818cf8" },
    metrics: [
      { value: "6", label: l("ربات در این مجموعه", "bots in this collection") },
      { value: "5,000+", label: l("خط کد پایتون", "lines of Python") },
      { value: "FFmpeg", label: l("پردازش ویدیو و صدا در پس‌زمینه", "video & audio processing in the background") },
    ],
    features: [
      {
        icon: "bot",
        title: l("ربات‌ساز آپلودر", "Uploader bot builder"),
        text: l("کاربر توکن ربات خودش را می‌فرستد و ربات آپلودر اختصاصی‌اش همان لحظه روشن می‌شود؛ با ادمین‌ها، کانال عضویت اجباری، کانال تبلیغ و لینک یکتا برای هر فایل. فارسی و انگلیسی.", "Users send their own bot token and their uploader bot goes live on the spot, with its own admins, required channels, an ad channel and a unique link for every file. Persian and English."),
      },
      {
        icon: "video",
        title: l("واترمارک ویدیو", "Video watermark"),
        text: l("متن یا لوگو روی ویدیو با افکت ساده، سایه‌دار یا هاشور. واترمارک هر چند فریم جایش را عوض می‌کند تا نشود آن را برید.", "Adds text or a logo to videos with plain, shadow or hatch styles. The mark jumps to a new spot every few frames, so it can't be cropped out."),
      },
      {
        icon: "music",
        title: l("ویرایشگر موزیک", "Music editor"),
        text: l("اسم آهنگ، خواننده و کاور را عوض می‌کند و فایل را بین MP3، FLAC، WAV و OGG تبدیل می‌کند.", "Changes the title, artist and cover art, and converts files between MP3, FLAC, WAV and OGG."),
      },
      {
        icon: "briefcase",
        title: l("آگهی فریلنسری", "Freelance job board"),
        text: l("ثبت آگهی پروژه، مدیریت آگهی‌های خود، قوانین و پشتیبانی؛ هر آگهی قبل از انتشار در کانال به تأیید ادمین می‌رسد.", "Post project ads, manage your own, read the rules or ask for help; every ad is approved by an admin before it reaches the channel."),
      },
      {
        icon: "folder",
        title: l("فایل‌منیجر", "File manager"),
        text: l("فایل‌ها را در دسته‌های شخصی نگه می‌دارد تا هر وقت خواستی با یک لمس پس بگیری؛ فایل‌های موقت خودکار پاک می‌شوند.", "Keeps your files in personal folders so you can get them back in one tap; temporary files are cleaned up automatically."),
      },
      {
        icon: "chef",
        title: l("ربات آشپزی", "Recipe bot"),
        text: l("دستور غذاها بر اساس دسته و نوع (اصلی، رژیمی، اقتصادی)، جستجو با اسم و فهرست غذاهای محبوب.", "Recipes by category and type (main, diet, budget), search by name and a favourites list."),
      },
    ],
    details: [
      l(
        "ربات‌ساز روی یک ربات اصلی اجرا می‌شود: کاربر توکن ربات خودش را می‌دهد، ربات جدید در همان پروسه بالا می‌آید و برای هر کاربر یک جدول جدا در MySQL ساخته می‌شود. هر فایل آپلودشده یک لینک یکتا می‌گیرد.",
        "The builder runs on one main bot: a user hands over a bot token, the new bot starts inside the same process, and each user gets a separate MySQL table. Every uploaded file gets a unique link.",
      ),
      l(
        "کارهای سنگین مثل FFmpeg به‌صورت ناهمگام و در پروسهٔ جدا اجرا می‌شوند تا ربات هم‌زمان به بقیهٔ کاربرها جواب بدهد؛ فایل‌های موقت بعد از هر کار پاک می‌شوند.",
        "Heavy jobs like FFmpeg run asynchronously in separate processes, so the bot keeps answering other users; temporary files are deleted after each job.",
      ),
    ],
    gallery: [],
  },
];

export const projectById = (id: string | null) => projects.find((p) => p.id === id) ?? null;
