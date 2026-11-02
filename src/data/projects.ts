import type { L } from "../i18n/lang";

const l = (fa: string, en: string): L => ({ fa, en });
export const media = (p: string) => `${import.meta.env.BASE_URL}media/${p}`;

export type ProjectId = "hellogap" | "jadoo" | "ashpazino" | "ai-offline";

export type FeatureIcon =
  | "zap" | "video" | "messages" | "shield" | "coins" | "gauge"
  | "hand" | "sparkles" | "music" | "volume" | "camera" | "layers"
  | "clock" | "type" | "cpu" | "sliders" | "film"
  | "chef" | "list" | "eye" | "wifiOff" | "flask"
  | "terminal" | "globe" | "mouse" | "lock" | "book" | "boxes";

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
    text: l("هزاران ذرهٔ نورانی شکل دستت را می‌سازند؛ مشت گوی انرژی می‌سازد و باز کردنش انفجار.", "Thousands of glowing particles take the shape of your hand; a fist charges an orb, opening it explodes."),
    start: 0,
    img: "nebula",
    color: "#7dd3fc",
  },
  {
    key: "ECHO",
    name: l("پژواک", "Echo"),
    text: l("طرح دستت ردهای رنگی پشت سرش جا می‌گذارد؛ نیشگون شکل دست را روی صفحه مُهر می‌کند.", "Your hand's outline leaves coloured trails; a pinch stamps its shape onto the screen."),
    start: 5.5,
    img: "echo",
    color: "#facc15",
  },
  {
    key: "LIGHT PAINT",
    name: l("نقاشی نور", "Light paint"),
    text: l("با نیشگون در هوا نقاشی نئونی بکش؛ مشتِ نگه‌داشته نقاشی را خرد می‌کند.", "Pinch to draw neon in mid-air; hold a fist and the painting shatters."),
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
    text: l("کهکشانی مارپیچی در دستت؛ مشت سیاه‌چاله می‌سازد و باز کردنش انفجار بزرگ.", "A spiral galaxy in your palm; a fist makes a black hole, opening it triggers a Big Bang."),
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
    kicker: l("اپ بی‌درنگ موبایل · Flutter + Node.js", "Real-time mobile app · Flutter + Node.js"),
    tagline: l("چت و تماس تصویری ناشناس با آدم‌های جدید — با جفت‌شدن بی‌درنگ.", "Anonymous chat & video calls with new people — matched in real time."),
    summary: l(
      "یک محصول کامل، از سرور جفت‌سازی تا صفحهٔ فروشگاه. هلوگپ کاربران آنلاین را برای چت متنی یا تماس تصویری WebRTC به هم وصل می‌کند، گفتگو را با بستن برنامه زنده نگه می‌دارد و با فیلتر شماره تلفن، گزارش تخلف و پنل مدیریت از آدم‌ها محافظت می‌کند — بدون ثبت‌نام و بدون گرفتن هیچ اطلاعات شخصی.",
      "A complete product, from the matchmaking server to the store listing. HelloGap pairs online users for a text chat or a WebRTC video call, keeps conversations alive when the app closes, and protects people with phone-number filtering, reports and an admin panel — no sign-up, no personal data.",
    ),
    year: "2026",
    role: l("همه‌چیز: اپ، سرور، انتشار", "Everything: app, server, launch"),
    platform: l("اندروید · مایکت", "Android · Myket"),
    stack: ["Flutter", "Dart", "Socket.IO", "WebRTC", "Node.js", "Fastify", "Redis", "coturn", "PM2", "Docker"],
    accent: { a: "#a855f7", b: "#fb923c" },
    metrics: [
      { value: "1.0", label: l("نسخهٔ فروشگاهی برای مایکت", "store release for Myket") },
      { value: "0", label: l("اطلاعات شخصی؛ بدون ثبت‌نام", "personal data collected — no sign-up") },
      { value: "P2P", label: l("تماس تصویری WebRTC با رلهٔ TURN", "WebRTC video with a TURN fallback") },
    ],
    features: [
      {
        icon: "zap",
        title: l("جفت‌شدن فوری", "Instant matching"),
        text: l("صف جفت‌سازی روی Redis کاربران آنلاین را همان لحظه به هم وصل می‌کند؛ با فیلتر جنسیت اختیاری.", "A Redis-backed matchmaking queue pairs online users the moment they tap, with an optional gender filter."),
      },
      {
        icon: "video",
        title: l("تماس تصویری با ری‌اکشن", "Video calls with reactions"),
        text: l("تماس نظیربه‌نظیر WebRTC با ری‌اکشن‌های متحرک؛ وقتی شبکه اتصال مستقیم را می‌بندد، سرور TURN تماس را رله می‌کند.", "Peer-to-peer WebRTC video with animated emoji reactions; a TURN server relays the call when networks block direct links."),
      },
      {
        icon: "messages",
        title: l("گفتگوی ماندگار", "Conversations that last"),
        text: l("برنامه را ببند و برگرد: پیام‌ها منتظر تحویل می‌مانند، با تیک «ارسال شد» و «دیده شد» مثل یک پیام‌رسان واقعی.", "Close the app and come back: messages wait for delivery, with sent and seen ticks like a real messenger."),
      },
      {
        icon: "shield",
        title: l("امنیت از پایه", "Safety by design"),
        text: l("ارسال شماره تلفن خودکار مسدود می‌شود، اسکرین‌شات غیرفعال است و گزارش‌ها در صف بررسیِ اولویت‌دار می‌نشینند.", "Phone numbers are filtered automatically, screenshots are blocked, and reports land in a ranked moderation queue."),
      },
      {
        icon: "coins",
        title: l("کیف پول سکه", "Coin wallet"),
        text: l("کیف پول سمت سرور با سکهٔ رایگان روزانه و قوانین ضدتقلب، فیلتر ویژه را پشتیبانی می‌کند.", "A server-side wallet with daily gifts and anti-farming rules powers the premium filter."),
      },
      {
        icon: "gauge",
        title: l("پنل مدیریت و تست بار", "Admin panel & load tests"),
        text: l("هشدار سلامت، آمار استفاده و صف گزارش‌ها در پنل مدیریت؛ اسکریپت‌های اختصاصی تست بار و TURN سرور را پیش از کاربران محک می‌زنند.", "Health alerts, usage stats and a report queue in the admin panel; custom load-test and TURN-probe scripts stress the server before users do."),
      },
    ],
    details: [
      l(
        "اپ Flutter (با Provider و go_router و رابط فارسی راست‌چین) از طریق وب‌سوکت Socket.IO با سرور Node.js حرف می‌زند و گواهی TLS سرور داخل خود اپ پین شده است.",
        "The Flutter app (Provider, go_router, a Persian right-to-left UI) talks to a Node.js server over Socket.IO WebSockets, with the server's TLS certificate pinned inside the app.",
      ),
      l(
        "‏Fastify درخواست‌های HTTP و پنل مدیریت را سرو می‌کند؛ Redis حضور آنلاین، صف‌های جفت‌سازی، کیف پول‌ها و مسدودی‌ها را نگه می‌دارد و آداپتر Redis برای Socket.IO اجازه می‌دهد چند ورکر PM2 اتاق‌ها را با هم به اشتراک بگذارند.",
        "Fastify serves HTTP and the admin panel; Redis holds presence, matchmaking queues, wallets and bans, and the Socket.IO Redis adapter lets several PM2 workers share rooms.",
      ),
      l(
        "تماس تصویری از همان سوکت مذاکره می‌شود و نظیربه‌نظیر روی WebRTC جریان دارد؛ در شبکه‌های سخت‌گیر، رلهٔ TURN با coturn جایگزین می‌شود.",
        "Calls are negotiated over the same socket and stream peer-to-peer with WebRTC, falling back to a coturn TURN relay on restrictive networks.",
      ),
    ],
    gallery: [
      { src: media("hellogap/call-720.webp"), small: media("hellogap/call-360.webp"), w: 720, h: 1080, alt: l("پوستر هلوگپ: تماس تصویری با ری‌اکشن", "HelloGap poster: video call with reactions"), caption: l("تماس تصویری تصادفی با ری‌اکشن", "Random video calls with reactions") },
      { src: media("hellogap/chat-720.webp"), small: media("hellogap/chat-360.webp"), w: 720, h: 1080, alt: l("پوستر هلوگپ: چت با تیک دیده شد", "HelloGap poster: chat with seen ticks"), caption: l("گفتگوی ماندگار با تیک «دیده شد»", "Lasting chats with seen ticks") },
      { src: media("hellogap/home-720.webp"), small: media("hellogap/home-360.webp"), w: 720, h: 1080, alt: l("پوستر هلوگپ: صفحهٔ خانه", "HelloGap poster: home screen"), caption: l("صفحهٔ خانه: چت تصادفی یا تماس تصویری", "Home: random chat or video call") },
    ],
    links: [{ label: l("هلوگپ در مایکت", "HelloGap on Myket"), url: "https://myket.ir/app/ir.hellogap.app" }],
  },

  // ───────────────────────────────────────────── 02 JADOO
  {
    id: "jadoo",
    index: "02",
    name: l("جادو", "JADOO"),
    kicker: l("بینایی ماشین · گرافیک مولد · صدا", "Computer vision · generative graphics · sound"),
    tagline: l("نور و موسیقی‌ای که با دست خالی می‌نوازی.", "Light and music you play with your bare hands."),
    summary: l(
      "جادو با وب‌کم لپ‌تاپ تا دو دست را (هر کدام ۲۱ نقطه) زنده دنبال می‌کند و هر حرکت را به نور و صدا تبدیل می‌کند: سحابی ذراتی که شکل دستت را می‌گیرد، پژواک‌های نئونی، نقاشی با نور، رعد و برق بین انگشت‌ها و کهکشانی که می‌چرخانی‌اش. همهٔ صداها همان لحظه با کد ساخته می‌شوند؛ حتی یک فایل صوتی در پروژه نیست.",
      "JADOO follows up to two hands through a laptop webcam (21 landmarks each) and turns every gesture into light and sound: a particle nebula that takes the shape of your hand, neon echoes, light painting, lightning between your fingers and a galaxy you can spin. Every sound is synthesized live — there isn't a single audio file in the project.",
    ),
    year: "2026",
    role: l("ایده، گرافیک، صدا و کد", "Concept, graphics, sound & code"),
    platform: l("ویندوز · پایتون", "Windows · Python"),
    stack: ["Python", "MediaPipe", "OpenCV", "NumPy", "Numba", "Pillow", "sounddevice", "FFmpeg"],
    accent: { a: "#22d3ee", b: "#e879f9" },
    metrics: [
      { value: "21×2", label: l("نقطهٔ دست، زنده", "hand landmarks, tracked live") },
      { value: "26k", label: l("ذره + ۶۰ هزار جرقه (کیفیت ultra)", "particles + 60k sparks (ultra)") },
      { value: "0", label: l("فایل صوتی؛ همه سنتز زنده", "audio files — all live synthesis") },
    ],
    features: [
      {
        icon: "hand",
        title: l("موتور حرکات", "Gesture engine"),
        text: l("۲۱ نقطه برای هر دست با MediaPipe، صاف‌شده با فیلتر One-Euro؛ مشت، نیشگون، کف باز و علامت V به رویداد تبدیل می‌شوند.", "21 landmarks per hand from MediaPipe, smoothed by a One-Euro filter; fist, pinch, open palm and a held V-sign become events."),
      },
      {
        icon: "sparkles",
        title: l("موتور نور", "Light renderer"),
        text: l("نور جمع‌شونده، درخشش bloom و کرنل‌های کامپایل‌شده با Numba، ده‌ها هزار ذره را روی لپ‌تاپ روان نگه می‌دارند.", "Additive light, bloom and Numba-compiled kernels keep tens of thousands of particles smooth on a laptop."),
      },
      {
        icon: "music",
        title: l("دستت یک ساز است", "Your hand is an instrument"),
        text: l("بالا و پایین بردن دست نت را روی گام پنتاتونیک عوض می‌کند، سرعت بلندی صدا را، مشت یا باز بودن روشنی صدا را و چپ و راست جای صدا بین دو بلندگو را.", "Height picks notes on a pentatonic scale, speed sets the volume, an open or closed hand the brightness, and left–right the stereo position."),
      },
      {
        icon: "volume",
        title: l("صدا از صفر", "Sound from scratch"),
        text: l("یک سینت‌سایزر زنده با جرقهٔ برق، پژواک و ریورب — حتی یک فایل صوتی همراه برنامه نیست.", "A live synthesizer with crackling electricity, echoes and reverb — not one audio file ships with the app."),
      },
      {
        icon: "camera",
        title: l("عکس و فیلم با صدا", "Photos & videos with sound"),
        text: l("با یک کلید عکس بگیر و با کلید دیگر فیلم MP4 با صدا ضبط کن؛ آماده برای تلگرام و اینستاگرام.", "One key saves a photo, another records an MP4 with sound — ready for Telegram or Instagram."),
      },
      {
        icon: "layers",
        title: l("پنج حالت", "Five modes"),
        text: l("سحابی، پژواک، نقاشی نور، طوفان و کهکشان — علامت V را یک ثانیه نگه دار تا حالت عوض شود.", "Nebula, Echo, Light Paint, Storm and Galaxy — hold a V-sign for a second to switch."),
      },
    ],
    details: [
      l(
        "یک thread جدا تصویر وب‌کم را به Hand Landmarker مدیاپایپ می‌دهد؛ لایهٔ حرکات نقطه‌های خام را به رویدادهای پایدار تبدیل می‌کند و هر حالت یک کلاس کوچک با update و render و صدای خودش است — اضافه کردن حالت ششم یعنی یک فایل.",
        "A camera thread feeds MediaPipe's hand landmarker; a gesture layer turns raw landmarks into stable events; each mode is a small class with its own update, render and sound hooks — a sixth mode is one new file.",
      ),
      l(
        "همهٔ تصاویر و ویدیوهای این صفحه از خود جادو گرفته شده‌اند: حالت دموی داخلی‌اش را (دست‌های شبیه‌سازی‌شده، بدون وب‌کم) فریم‌به‌فریم با کیفیت ۱۹۲۰×۱۰۸۰ و ۳۰ فریم در ثانیه رندر کردم.",
        "Every image and video on this page came out of JADOO itself: I rendered its built-in demo mode — simulated hands, no webcam — frame by frame at 1920×1080, 30 fps.",
      ),
    ],
    gallery: [
      wide("jadoo", "nebula", l("حالت سحابی: دو دست از ذرات رنگی", "Nebula mode: two hands made of coloured particles"), l("سحابی — دست‌ها از ذرات", "Nebula — hands made of particles")),
      wide("jadoo", "echo", l("حالت پژواک: ردهای نئونی دست‌ها", "Echo mode: neon trails of hands"), l("پژواک — مجسمه‌ای از زمان", "Echo — a sculpture of time")),
      wide("jadoo", "storm", l("حالت طوفان: گوی پلاسما و رعد و برق", "Storm mode: plasma orb and lightning"), l("طوفان — گوی پلاسما", "Storm — a plasma orb")),
      wide("jadoo", "galaxy", l("حالت کهکشان: کهکشان مارپیچی", "Galaxy mode: a spiral galaxy"), l("کهکشان — مارپیچ در کف دست", "Galaxy — a spiral in your palm")),
      wide("jadoo", "nebula-title", l("ذرات اسم JADOO را می‌سازند", "Particles spell JADOO"), l("وقتی دستی نیست، ذرات اسم را می‌سازند", "No hands? The particles spell the name")),
      wide("jadoo", "echo-2", l("پژواک با دو دست", "Echo with two hands"), l("پژواک — دو دست", "Echo — two hands")),
      wide("jadoo", "storm-2", l("قوس الکتریکی بین دو دست", "An electric arc between two hands"), l("طوفان — قوس بین دو دست", "Storm — an arc between two hands")),
      wide("jadoo", "galaxy-bang", l("انفجار بزرگ در حالت کهکشان", "Big Bang in Galaxy mode"), l("کهکشان — سیاه‌چاله و انفجار بزرگ", "Galaxy — black hole to Big Bang")),
      wide("jadoo", "paint", l("نقاشی نور با نیشگون", "Light painting with a pinch"), l("نقاشی نور", "Light paint")),
      wide("jadoo", "nebula-orb", l("مشت، گوی انرژی می‌سازد", "A fist charges an energy orb"), l("سحابی — گوی انرژی", "Nebula — an energy orb")),
    ],
  },

  // ───────────────────────────────────────────── 03 Ashpazino
  {
    id: "ashpazino",
    index: "03",
    name: l("آشپزینو", "Ashpazino"),
    kicker: l("اپ آفلاین اندروید · Flutter", "Offline Android app · Flutter"),
    tagline: l("بگو در آشپزخانه چه داری؛ می‌گوید چه بپزی.", "Tell it what's in your kitchen; it tells you what to cook."),
    summary: l(
      "یک اپ آشپزی فارسی که اول برای مادرها و کاربران مسن‌تر طراحی شده: مواد خانه را لمس کن تا آشپزینو نشان دهد همین حالا چه می‌توانی بپزی — و چه غذاهایی فقط یکی دو قلم کم دارند. ۳۰۰ دستور خانگی، قدم‌به‌قدم با ظرف، حرارت، زمان و نشانهٔ آماده شدن.",
      "A Persian cooking app designed first for mothers and older users: tap the ingredients you have and Ashpazino shows what you can cook right now — and what's only one or two items away. 300 home recipes, step by step, with the pan, the heat, the minutes and how to tell it's done.",
    ),
    year: "2026",
    role: l("طراحی، توسعه و آماده‌سازی انتشار", "Design, development & store launch"),
    platform: l("اندروید · مایکت", "Android · Myket"),
    stack: ["Flutter", "Dart", "ChangeNotifier", "shared_preferences", "wakelock_plus", "Golden tests"],
    accent: { a: "#f97316", b: "#facc15" },
    metrics: [
      { value: "300", label: l("دستور پخت ایرانی در ۱۰ دسته", "Iranian recipes in 10 categories") },
      { value: "0", label: l("دسترسی اینترنت؛ کاملاً آفلاین", "internet permissions — fully offline") },
      { value: "56px", label: l("کمترین اندازهٔ دکمه، برای همهٔ سنین", "minimum tap target, for every age") },
    ],
    features: [
      {
        icon: "chef",
        title: l("با همین موادی که داری", "Cook with what you have"),
        text: l("تطبیق مواد، غذاهایی را که همین حالا می‌شود پخت و آن‌هایی را که یکی دو قلم کم دارند جدا نشان می‌دهد.", "Ingredient matching shows what you can cook right now, and separately what's one or two items short."),
      },
      {
        icon: "eye",
        title: l("حالت آشپزی", "Cooking mode"),
        text: l("هر مرحله در یک صفحه با خط درشت، و صفحهٔ گوشی وسط آشپزی خاموش نمی‌شود.", "One step per screen in big type, and the screen stays awake beside the stove."),
      },
      {
        icon: "list",
        title: l("لیست خرید", "Shopping list"),
        text: l("مواد کم هر غذا با یک لمس به لیست خرید می‌رود؛ هر چه را خریدی تیک بزن تا به مواد خانه اضافه شود.", "Missing ingredients go to the list in one tap; tick what you bought and it moves into your pantry."),
      },
      {
        icon: "hand",
        title: l("برای همهٔ سنین", "Accessible by default"),
        text: l("متن درشت، دکمه‌های بزرگ، کنتراست بالا، بدون ثبت‌نام و بدون نیاز به تایپ در کارهای اصلی.", "Large text, big buttons, high contrast, no login and no typing for the core flows."),
      },
      {
        icon: "wifiOff",
        title: l("همه‌جا کار می‌کند", "Works anywhere"),
        text: l("بدون اینترنت و بدون سرویس‌های گوگل؛ روی گوشی‌های قدیمی و جدید اندروید.", "No internet and no Google services — runs on old and new Android phones alike."),
      },
      {
        icon: "flask",
        title: l("داده‌های تست‌شده", "Tested data"),
        text: l("تست‌های خودکار شناسه‌ها و ارجاع‌های همهٔ دستورها را بررسی می‌کنند؛ تصاویر فروشگاه هم با golden test ساخته می‌شوند.", "Automated tests check every recipe id and reference; the store screenshots are rendered by golden tests."),
      },
    ],
    details: [
      l(
        "دستورها به شکل JSON داخل خود اپ هستند — هر دسته یک فایل — و الگوریتم تطبیق، غذاهای قابل پخت را از غذاهایی که یکی دو قلم کم دارند جدا می‌کند؛ مواد پایه مثل نمک و روغن همیشه موجود فرض می‌شوند.",
        "Recipes ship inside the app as JSON — one file per category — and the matcher separates what you can cook now from what's one or two items away; staples like salt and oil are assumed to be at home.",
      ),
      l(
        "هر مرحله یک استاندارد نگارش دارد: نام ظرف، شدت حرارت، مقدار آب به لیوان، زمان به دقیقه و نشانهٔ آماده شدن — هیچ‌وقت فقط «بپزید». بدون Firebase و Google Play Services، چون خیلی از گوشی‌ها در ایران آن را ندارند.",
        "Every step follows a writing standard — the utensil, the heat, water in cups, minutes and a doneness sign; never just “cook it”. No Firebase or Google Play Services, because many phones in Iran don't have them.",
      ),
    ],
    gallery: [
      { src: media("ashpazino/screen-pantry.webp"), w: 540, h: 960, alt: l("صفحهٔ مواد خانه", "Pantry screen"), caption: l("در خانه چه دارید؟", "What's in your kitchen?") },
      { src: media("ashpazino/screen-suggestions.webp"), w: 540, h: 960, alt: l("صفحهٔ پیشنهاد غذا", "Suggestions screen"), caption: l("همین حالا می‌توانید بپزید", "You can cook these now") },
      { src: media("ashpazino/screen-recipe.webp"), w: 540, h: 960, alt: l("صفحهٔ دستور قورمه‌سبزی", "Recipe screen: ghormeh sabzi"), caption: l("دستور، با مواد کم و لیست خرید", "A recipe, with missing items") },
      { src: media("ashpazino/screen-steps.webp"), w: 540, h: 960, alt: l("طرز تهیه قدم‌به‌قدم", "Step-by-step method"), caption: l("طرز تهیهٔ دقیق", "A precise method") },
      { src: media("ashpazino/screen-cooking_mode.webp"), w: 540, h: 960, alt: l("حالت آشپزی با خط درشت", "Cooking mode in large type"), caption: l("حالت آشپزی", "Cooking mode") },
      { src: media("ashpazino/screen-shopping.webp"), w: 540, h: 960, alt: l("لیست خرید", "Shopping list"), caption: l("لیست خرید", "Shopping list") },
      { src: media("ashpazino/screen-recipes.webp"), w: 540, h: 960, alt: l("فهرست ۳۰۰ دستور", "All 300 recipes"), caption: l("۳۰۰ دستور", "300 recipes") },
      { src: media("ashpazino/banner-pantry-720.webp"), small: media("ashpazino/banner-pantry-360.webp"), w: 720, h: 1280, alt: l("بنر فروشگاه: با مواد خانه غذا بپزید", "Store banner: cook with what you have"), caption: l("بنر فروشگاه", "Store banner") },
      { src: media("ashpazino/banner-steps-720.webp"), small: media("ashpazino/banner-steps-360.webp"), w: 720, h: 1280, alt: l("بنر فروشگاه: ۳۰۰ دستور ایرانی", "Store banner: 300 Iranian recipes"), caption: l("بنر فروشگاه", "Store banner") },
      { src: media("ashpazino/banner-cooking_mode-720.webp"), small: media("ashpazino/banner-cooking_mode-360.webp"), w: 720, h: 1280, alt: l("بنر فروشگاه: خط درشت کنار اجاق", "Store banner: big type by the stove"), caption: l("بنر فروشگاه", "Store banner") },
      { src: media("ashpazino/banner-shopping-720.webp"), small: media("ashpazino/banner-shopping-360.webp"), w: 720, h: 1280, alt: l("بنر فروشگاه: لیست خرید", "Store banner: shopping list"), caption: l("بنر فروشگاه", "Store banner") },
    ],
    links: [{ label: l("آشپزینو در مایکت", "Ashpazino on Myket"), url: "https://myket.ir/app/ir.ashpazino.app" }],
  },

  // ───────────────────────────────────────────── 04 AI Offline
  {
    id: "ai-offline",
    index: "04",
    name: l("هوش مصنوعی آفلاین", "AI Offline"),
    kicker: l("هوش مصنوعی محلی · ایجنت · ویندوز", "Local AI · agents · Windows"),
    tagline: l("دستیار برنامه‌نویسی خصوصی‌ای که به اینترنت نیاز ندارد.", "A private coding assistant that never needs the internet."),
    summary: l(
      "یک ایستگاه کاری هوش مصنوعی آفلاین و آماده‌به‌کار. ‏Ollama مدل‌های Qwen 3.6 (۳۵ میلیارد پارامتری از نوع MoE) و Gemma 4 را روی خود سیستم اجرا می‌کند؛ OpenCode یک رابط مرورگری شبیه claude.ai و یک ایجنت ترمینالی می‌دهد و حتی Claude Code هم با مدل محلی کار می‌کند. روی هر پوشه راست‌کلیک کن تا ایجنت همان‌جا باز شود. هیچ داده‌ای از سیستم بیرون نمی‌رود.",
      "A turnkey offline AI workstation. Ollama runs Qwen 3.6 (a 35B mixture-of-experts model) and Gemma 4 on the machine itself; OpenCode provides a claude.ai-style browser interface and a terminal agent, and even Claude Code runs on the local model. Right-click any folder and an AI agent opens right there. No data ever leaves the computer.",
    ),
    year: "2026",
    role: l("طراحی سیستم، اسکریپت و مستند", "System design, scripting & docs"),
    platform: l("ویندوز ۱۱ · محلی", "Windows 11 · local"),
    stack: ["Ollama", "Qwen 3.6", "Gemma 4", "OpenCode", "Claude Code", "Batch", "PowerShell"],
    accent: { a: "#34d399", b: "#a3e635" },
    metrics: [
      { value: "27 GB", label: l("مدل روی دیسک", "of models on disk") },
      { value: "35B", label: l("پارامتر · ۳B فعال (MoE)", "parameters · 3B active (MoE)") },
      { value: "0", label: l("درخواست به اینترنت", "requests to the internet") },
    ],
    features: [
      {
        icon: "boxes",
        title: l("دو مدل، یک سوییچ", "Two models, one switch"),
        text: l("‏Qwen 3.6 35B-A3B برای برنامه‌نویسی و چت فارسی؛ Gemma 4 E4B وقتی سرعت مهم است.", "Qwen 3.6 35B-A3B for coding and Persian chat; Gemma 4 E4B when speed matters."),
      },
      {
        icon: "globe",
        title: l("فضای کار در مرورگر", "Browser workspace"),
        text: l("فهرست گفتگوها، تغییر نام، حذف و انتخاب پوشهٔ پروژه در یک رابط وب محلی روی 127.0.0.1.", "Sessions, rename, delete and project folders in a local web UI on 127.0.0.1."),
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
        title: l("قفل‌شده روی آفلاین", "Locked offline"),
        text: l("به‌روزرسانی خودکار، تلمتری، دریافت مدل، اشتراک‌گذاری و دانلود LSP خاموش‌اند.", "Auto-update, telemetry, model fetching, sharing and LSP downloads are all switched off."),
      },
      {
        icon: "book",
        title: l("راهنمای فارسی", "Persian manual"),
        text: l("یک راهنمای قدم‌به‌قدم فارسی، تا هر کسی در خانواده بتواند از آن استفاده کند.", "A step-by-step Persian guide, so anyone in the family can use it."),
      },
    ],
    details: [
      l(
        "یک اسکریپت محیطی مشترک همهٔ لانچرها را به Ollama، OpenCode و پیکربندی آفلاین داخل همان پوشه وصل می‌کند و سرور مدل را فقط اگر روشن نباشد بالا می‌آورد.",
        "One shared environment script points every launcher at the bundled Ollama, OpenCode and offline config, and starts the model server only if it isn't already running.",
      ),
      l(
        "پیکربندی OpenCode فقط به Ollama محلی (127.0.0.1:11434) اجازه می‌دهد، کانتکست ۶۴ هزار توکنی تنظیم می‌کند و نصب‌کننده‌ها هم کنار پروژه هستند تا کل سیستم روی کامپیوتری بدون هیچ اتصالی دوباره ساخته شود.",
        "The OpenCode config allows only the local Ollama endpoint (127.0.0.1:11434) with a 64K-token context, and the installers sit next to it, so the whole setup can be rebuilt on a machine with no connection at all.",
      ),
    ],
    gallery: [],
  },
];

export const projectById = (id: string | null) => projects.find((p) => p.id === id) ?? null;
