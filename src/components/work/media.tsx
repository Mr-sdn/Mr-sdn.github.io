import { useEffect, useRef, useState, type ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Bot,
  BriefcaseBusiness,
  ChefHat,
  CheckCheck,
  FolderOpen,
  GraduationCap,
  Loader2,
  Lock,
  MessageCircle,
  Music2,
  Search,
  ShoppingCart,
  Stamp,
  WifiOff,
} from "lucide-react";
import { useLang, type L } from "../../i18n/lang";
import { JADOO_REEL_LENGTH, jadooModes, media } from "../../data/projects";
import { LazyVideo } from "../ui/primitives";
import { cn, useInView } from "../../lib/hooks";

const l = (fa: string, en: string): L => ({ fa, en });

/** A soft coloured light behind a mock-up. Plain gradients: a CSS blur here costs a repaint on every scroll frame. */
function Glow({ className, color }: { className?: string; color: string }) {
  return <div aria-hidden className={cn("pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full", className)} style={{ background: color }} />;
}

/** Steps through `count` states while the element is on screen (paused off-screen and for reduced motion). */
function useLoop<T extends Element>(count: number, interval: (step: number) => number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, "0px", false);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? count - 1 : 0);
  const delay = useRef(interval);
  delay.current = interval;
  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % count), delay.current(step));
    return () => window.clearTimeout(id);
  }, [inView, reduce, step, count]);
  return { ref, step: reduce ? count - 1 : step };
}

/* ───────────────────────── HelloGap: a fan of store posters ───────────────────────── */
export function HelloGapMedia({ large = false }: { large?: boolean }) {
  const { t } = useLang();
  const posters = [
    { src: "hellogap/chat", alt: { fa: "پوستر چت هلوگپ", en: "HelloGap chat poster" } },
    { src: "hellogap/call", alt: { fa: "پوستر تماس تصویری هلوگپ", en: "HelloGap video call poster" } },
    { src: "hellogap/home", alt: { fa: "پوستر صفحهٔ خانهٔ هلوگپ", en: "HelloGap home poster" } },
  ];
  return (
    <div className="group/fan relative flex h-full min-h-[340px] w-full items-center justify-center overflow-hidden [perspective:1400px]">
      <Glow className="h-[80%] w-[70%]" color="radial-gradient(closest-side, rgba(168,85,247,0.4), rgba(251,146,60,0.16) 60%, transparent)" />
      {posters.map((p, i) => {
        const side = i - 1;
        return (
          <div
            key={p.src}
            className={cn(
              "absolute aspect-[2/3] overflow-hidden rounded-[22px] shadow-[0_22px_44px_-22px_rgba(0,0,0,0.9)] ring-1 ring-white/15 transition-transform duration-700 ease-[var(--ease-out-expo)]",
              large ? "w-[min(30%,260px)]" : "w-[min(34%,230px)]",
              side === 0 ? "z-20" : "z-10",
            )}
            style={{
              transform: `translateX(${side * 62}%) rotate(${side * 9}deg) translateY(${Math.abs(side) * 18}px) scale(${side === 0 ? 1.06 : 0.94})`,
            }}
          >
            <img
              src={media(`${p.src}-720.webp`)}
              srcSet={`${media(`${p.src}-360.webp`)} 360w, ${media(`${p.src}-720.webp`)} 720w`}
              sizes="(min-width: 1024px) 260px, 34vw"
              alt={t(p.alt)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover/fan:scale-[1.03]"
            />
          </div>
        );
      })}
      <img
        src={media("hellogap/logo.webp")}
        alt=""
        aria-hidden
        className="absolute bottom-4 left-1/2 z-30 w-16 -translate-x-1/2"
      />
    </div>
  );
}

/* ───────────────────────── JADOO: the reel with clickable modes ───────────────────────── */
export function JadooMedia({ large = false }: { large?: boolean }) {
  const { t, isFa } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);
  let active = 0;
  jadooModes.forEach((m, i) => {
    if (time >= m.start) active = i;
  });
  const seek = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = jadooModes[i].start + 0.05;
    setTime(jadooModes[i].start + 0.05);
    v.play().catch(() => {});
  };
  return (
    <div className={cn("flex h-full w-full flex-col gap-3", large ? "" : "p-4 sm:p-5 lg:p-6")}>
      <div className={cn("relative overflow-hidden rounded-2xl bg-black ring-1 ring-white/10", large ? "aspect-video" : "min-h-0 flex-1")}>
        <LazyVideo
          videoRef={videoRef}
          src={media("jadoo/reel.mp4")}
          poster={media(large ? "jadoo/nebula-1600.webp" : "jadoo/nebula-800.webp")}
          onTime={setTime}
          className="h-full w-full object-cover"
          label="JADOO demo reel"
        />
        <span className="latin pointer-events-none absolute end-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fog-200">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_2px_rgba(244,63,94,0.7)]" />
          real render · 1080p · 30fps
        </span>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/10">
          <div className="h-full bg-gradient-to-r from-ice to-fuchsia-400" style={{ width: `${Math.min(100, (time / JADOO_REEL_LENGTH) * 100)}%` }} />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="JADOO modes">
        {jadooModes.map((m, i) => (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => seek(i)}
            className={cn(
              "relative rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
              active === i ? "text-ink-950" : "bg-white/[0.05] text-fog-300 ring-1 ring-white/10 hover:text-fog-50",
            )}
          >
            {active === i && (
              <motion.span
                layoutId={`jadoo-mode-${large ? "l" : "s"}`}
                className="absolute inset-0 -z-0 rounded-full"
                style={{ background: m.color }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className={cn("relative", isFa ? "" : "latin tracking-wide")}>
              <span className="latin font-mono opacity-60">0{i + 1}</span> {isFa ? t(m.name) : m.key}
            </span>
          </button>
        ))}
      </div>
      {large && (
        <motion.p key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="min-h-[3.4em] text-[15px] leading-body text-fog-300">
          {t(jadooModes[active].text)}
        </motion.p>
      )}
    </div>
  );
}

/* ───────────────────────── LearnHub: the store in a browser, with a crypto checkout ───────────────────────── */
// The real site's UI is in English; the copy below mirrors its templates.
const COURSES = [
  { title: "Python for Beginners", meta: "24 lessons", price: "$29", tag: "Featured", art: "linear-gradient(135deg,#fbbf24,#f43f5e)" },
  { title: "Flutter from Zero", meta: "31 lessons", price: "$39", tag: "Sale", art: "linear-gradient(135deg,#38bdf8,#6366f1)" },
  { title: "UI Design Basics", meta: "18 lessons", price: "$24", art: "linear-gradient(135deg,#34d399,#0ea5e9)" },
];

export function LearnHubMedia({ large = false }: { large?: boolean }) {
  // 0 ready → 1 waiting for the payment → 2 paid, webhook verified, enrolled
  const { ref, step } = useLoop<HTMLDivElement>(3, (s) => (s === 2 ? 2600 : 1700));
  return (
    <div ref={ref} dir="ltr" className={cn("latin relative flex h-full min-h-[340px] w-full items-center justify-center overflow-hidden text-left", large ? "p-3 sm:p-8" : "p-4 sm:p-6")}>
      <Glow className="h-[85%] w-[80%]" color="radial-gradient(closest-side, rgba(244,63,94,0.26), rgba(251,191,36,0.1) 60%, transparent)" />

      {/* the checkout hangs off the browser's corner, so it is positioned against this wrapper */}
      <div className={cn("relative w-full", large ? "max-w-[820px]" : "max-w-[580px]")}>
      <div className="relative w-full overflow-hidden rounded-2xl bg-[#0b0b10] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="mx-auto inline-flex min-w-0 items-center gap-1.5 rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[10.5px] text-fog-400">
            <Lock className="h-3 w-3 shrink-0 text-emerald-400" />
            <span className="truncate">learnhub / courses</span>
          </span>
        </div>
        {/* site */}
        <div className={cn("px-4 pb-5 pt-3", large && "sm:px-7 sm:pb-8 sm:pt-5")}>
          <div className="flex items-center gap-4 text-[11.5px] text-fog-400">
            <span className="inline-flex items-center gap-1.5 font-display text-[14px] font-bold text-fog-50">
              <GraduationCap className="h-4 w-4 text-rose-400" /> LearnHub
            </span>
            <span className="hidden sm:inline">Courses</span>
            <span className="hidden sm:inline">My learning</span>
            <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-fog-200">
              <ShoppingCart className="h-3.5 w-3.5" /> 2
            </span>
          </div>
          <div className={cn("mt-4", large && "sm:mt-7")}>
            <p className={cn("font-display font-bold leading-tight text-fog-50", large ? "text-[22px] sm:text-[34px]" : "text-[20px] sm:text-[24px]")}>Learn Without Limits</p>
            <p className="mt-1 text-[11.5px] text-fog-400 sm:text-[12.5px]">Start, switch, or advance your career with courses from industry experts.</p>
            <div className="mt-3 flex gap-2 text-[11px] font-semibold">
              <span className="rounded-full bg-rose-500 px-3 py-1 text-white">Browse Courses</span>
              <span className="rounded-full px-3 py-1 text-fog-200 ring-1 ring-white/15">Join Free</span>
            </div>
          </div>
          <div className={cn("mt-4 grid grid-cols-3 gap-2", large && "sm:mt-7 sm:gap-3")}>
            {COURSES.map((c) => (
              <div key={c.title} className="min-w-0 overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-white/[0.07]">
                <div className="relative aspect-[16/9]" style={{ background: c.art }}>
                  {c.tag && <span className="absolute start-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white">{c.tag}</span>}
                </div>
                <div className="p-2">
                  <p className="truncate text-[10.5px] font-semibold text-fog-100 sm:text-[11.5px]">{c.title}</p>
                  <p className="mt-0.5 flex items-center justify-between text-[10px] text-fog-500">
                    <span className="truncate">{c.meta}</span>
                    <span className="font-semibold text-fog-200">{c.price}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("absolute -bottom-3 -end-2 w-[min(58%,236px)] rounded-2xl bg-[#121219] p-3.5 shadow-[0_18px_36px_-16px_rgba(0,0,0,0.9)] ring-1 ring-white/12 sm:-bottom-5 sm:-end-5", large && "sm:w-[270px] sm:p-4")}>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog-500">Checkout · crypto</p>
        <dl className="mt-2.5 space-y-1 text-[11.5px]">
          <div className="flex justify-between text-fog-300"><dt>Subtotal</dt><dd>$68.00</dd></div>
          <div className="flex justify-between text-emerald-300"><dt>Coupon SPRING20</dt><dd>−$13.60</dd></div>
          <div className="flex justify-between border-t border-white/[0.08] pt-1.5 font-semibold text-fog-50"><dt>Total</dt><dd>$54.40</dd></div>
        </dl>
        <div
          className={cn(
            "mt-3 flex items-center justify-center gap-2 rounded-xl py-2 text-[12px] font-semibold transition-colors duration-500",
            step === 2 ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30" : "bg-rose-500 text-white",
          )}
        >
          {step === 0 && "Pay with crypto"}
          {step === 1 && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Waiting for payment…
            </>
          )}
          {step === 2 && (
            <>
              <CheckCheck className="h-4 w-4" /> Paid · enrolled
            </>
          )}
        </div>
        <p className={cn("mt-2 truncate font-mono text-[10px] transition-opacity duration-500", step === 2 ? "text-emerald-300/80 opacity-100" : "opacity-0")}>
          webhook · signature ok → enrollment
        </p>
      </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Bale anonymous chat: the bot's real messages and keyboards ───────────────────────── */
type ChatLine = { from: "bot" | "me" | "peer"; text: string };
type Keyboard = "menu" | "search" | "chat";
// strings and buttons copied from the bot (anonymous_bale_chat.py); only the profile is made up
const BALE_SCRIPT: { line: ChatLine; kb: Keyboard }[] = [
  { line: { from: "bot", text: "👋 به ربات چت ناشناس خوش آمدید!" }, kb: "menu" },
  { line: { from: "me", text: "🎲 چت تصادفی" }, kb: "search" },
  { line: { from: "bot", text: "🔍 در حال جستجوی تصادفی...\n⏱ حداکثر ۲ دقیقه صبر کنید." }, kb: "search" },
  { line: { from: "bot", text: "✅ اتصال برقرار شد!\n👨 علی | ۲۳ سال | استان: اصفهان" }, kb: "chat" },
  { line: { from: "peer", text: "سلام 👋 از کجایی؟" }, kb: "chat" },
  { line: { from: "me", text: "سلام! شیراز 🙂" }, kb: "chat" },
];
const KEYBOARDS: Record<Keyboard, string[][]> = {
  menu: [
    ["🎲 چت تصادفی", "👩 چت با دختر", "👨 چت با پسر"],
    ["🏙️ چت با دختر هم‌شهری", "🏘️ چت با پسر هم‌شهری"],
    ["💰 کیف پول (سکه)", "🔗 لینک دعوت"],
  ],
  search: [["❌ لغو جستجو"], ["🔍 فعال‌سازی فیلتر همسن"]],
  chat: [["⏹️ پایان چت", "👤 پروفایل طرف مقابل"]],
};

export function BaleChatMedia({ large = false }: { large?: boolean }) {
  const { isFa } = useLang();
  // one step per message, then a pause before the conversation starts over
  const { ref, step } = useLoop<HTMLDivElement>(BALE_SCRIPT.length, (s) => (s === BALE_SCRIPT.length - 1 ? 4200 : s === 1 ? 1100 : 1500));
  const shown = BALE_SCRIPT.slice(0, step + 1);
  const kb = KEYBOARDS[BALE_SCRIPT[step].kb];
  return (
    <div ref={ref} className={cn("relative flex h-full min-h-[340px] w-full items-center justify-center overflow-hidden", large ? "p-3 sm:p-8" : "p-4 sm:p-5")}>
      <Glow className="h-[85%] w-[75%]" color="radial-gradient(closest-side, rgba(20,184,166,0.3), rgba(56,189,248,0.1) 60%, transparent)" />
      <div dir="rtl" lang="fa" className={cn("font-fa relative flex h-full w-full flex-col overflow-hidden rounded-[26px] bg-[#0c1214] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/10", large ? "max-h-[580px] max-w-[400px]" : "max-h-[500px] max-w-[340px]")}>
        {/* header */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#0f1a1c] px-4 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#14b8a6,#0ea5e9)] text-white">
            <MessageCircle className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-bold text-fog-50">چت ناشناس</p>
            <p className="text-[11px] text-teal-300/80">ربات · بله</p>
          </div>
          {!isFa && <span className="latin ms-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-fog-400" dir="ltr">UI in Persian</span>}
        </div>
        {/* messages */}
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,rgba(20,184,166,0.07),transparent)] px-3 py-3">
          <span className="mb-auto self-center rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10.5px] text-fog-400">امروز</span>
          {shown.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "max-w-[82%] whitespace-pre-line rounded-2xl px-3 py-1.5 text-[12.5px] leading-[1.75]",
                m.line.from === "me" ? "self-start rounded-ss-md bg-teal-600/90 text-white" : "self-end rounded-se-md bg-white/[0.07] text-fog-100",
              )}
            >
              {m.line.from === "peer" && <span className="mb-0.5 block text-[10.5px] font-semibold text-sky-300">ناشناس</span>}
              {m.line.text}
            </motion.div>
          ))}
        </div>
        {/* reply keyboard */}
        <div className="grid gap-1 border-t border-white/[0.06] bg-[#0f1a1c] p-2">
          {kb.map((row, r) => (
            <div key={`${BALE_SCRIPT[step].kb}-${r}`} className="flex gap-1">
              {row.map((b) => (
                <span key={b} className="min-w-0 flex-1 truncate rounded-lg bg-white/[0.06] px-1.5 py-1.5 text-center text-[11px] text-fog-200">
                  {b}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Telegram bots: the chat list ───────────────────────── */
const BOT_CHATS: { name: L; preview: L; icon: ComponentType<{ className?: string }>; color: string; time: string; unread?: number }[] = [
  { name: l("ربات‌ساز آپلودر", "Uploader Builder"), preview: l("بات شما با موفقیت ساخته شد و آماده استفاده است ✅", "Your bot has been successfully created and is ready to use ✅"), icon: Bot, color: "#2aabee", time: "12:41", unread: 2 },
  { name: l("واترمارک ویدیو", "Video Watermark"), preview: l("🎬 ویدیو با واترمارک سایه‌دار آماده شد", "🎬 Your video is ready with a shadow watermark"), icon: Stamp, color: "#f472b6", time: "12:38" },
  { name: l("ویرایشگر موزیک", "Music Editor"), preview: l("🎵 اسم آهنگ و کاور ذخیره شد · MP3", "🎵 Title and cover saved · MP3"), icon: Music2, color: "#a78bfa", time: "12:30", unread: 1 },
  { name: l("آگهی فریلنسری", "Freelance Ads"), preview: l("✳️ آگهی شما تکمیل شد و برای تأیید ادمین رفت", "✳️ Your ad is complete and waiting for approval"), icon: BriefcaseBusiness, color: "#fbbf24", time: "11:52" },
  { name: l("فایل‌منیجر", "File Manager"), preview: l("📁 ۳ فایل در دستهٔ «پروژه‌ها» ذخیره شد", "📁 3 files saved to “Projects”"), icon: FolderOpen, color: "#34d399", time: "11:20" },
  { name: l("ربات آشپزی", "Recipe Bot"), preview: l("🍲 قورمه‌سبزی · غذای اصلی", "🍲 Ghormeh sabzi · main dish"), icon: ChefHat, color: "#fb923c", time: "10:05" },
];

export function BotsMedia({ large = false }: { large?: boolean }) {
  const { t, digits, isFa } = useLang();
  // a new message lands in one chat after another
  const { ref, step } = useLoop<HTMLDivElement>(BOT_CHATS.length, () => 2300);
  return (
    <div ref={ref} className={cn("relative flex h-full min-h-[340px] w-full items-center justify-center overflow-hidden", large ? "p-3 sm:p-8" : "p-4 sm:p-5")}>
      <Glow className="h-[85%] w-[75%]" color="radial-gradient(closest-side, rgba(42,171,238,0.28), rgba(129,140,248,0.12) 60%, transparent)" />
      <div className={cn("relative flex max-h-full w-full flex-col overflow-hidden rounded-2xl bg-[#0e1621] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/10", large ? "max-w-[560px]" : "max-w-[440px]")}>
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#17212b] px-3 py-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#2aabee] text-white">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <path d="M21.9 4.6 18.7 19.7c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13.4l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 3.3c.9-.3 1.6.2 1.4 1.3z" />
            </svg>
          </span>
          <span className="latin text-[13px] font-semibold text-fog-100">Telegram</span>
          <span className="ms-auto inline-flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-[11px] text-fog-500 sm:max-w-[200px]">
            <Search className="h-3 w-3 shrink-0" />
            <span className="truncate">{t(l("جستجو", "Search"))}</span>
          </span>
        </div>
        <ul className="min-h-0 overflow-hidden">
          {BOT_CHATS.map((c, i) => {
            const Icon = c.icon;
            const hot = i === step;
            return (
              <li key={c.time} className={cn("flex items-center gap-3 px-3 py-2.5 transition-colors duration-500", hot ? "bg-[#2b5278]/55" : "bg-transparent")}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-950" style={{ background: c.color }}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[13px] font-semibold text-fog-50">{t(c.name)}</p>
                    <span className="latin shrink-0 rounded bg-white/[0.08] px-1 text-[9px] font-semibold uppercase text-fog-400">bot</span>
                    <span className="ms-auto shrink-0 text-[10.5px] text-fog-500">{digits(c.time)}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className={cn("min-w-0 flex-1 truncate text-[12px]", isFa ? "" : "latin", hot ? "text-fog-200" : "text-fog-500")}>{t(c.preview)}</p>
                    {(c.unread || hot) && (
                      <motion.span
                        key={hot ? `hot-${step}` : "idle"}
                        initial={hot ? { scale: 0.4, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        className="latin grid h-[18px] min-w-[18px] shrink-0 place-items-center rounded-full bg-[#2aabee] px-1 text-[10px] font-bold text-white"
                      >
                        {digits(String((c.unread ?? 0) + (hot ? 1 : 0)))}
                      </motion.span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── AI Offline: a terminal that types itself ───────────────────────── */
type Line = { kind: "cmd" | "out" | "dim" | "ok"; text: string };
const TERMINAL: Line[] = [
  { kind: "cmd", text: "D:\\AI-Offline\\AI-Web.bat" },
  { kind: "out", text: "  AI Web Server is running.  Browser: http://127.0.0.1:4096" },
  { kind: "dim", text: "  Do NOT close this window while you use the AI." },
  { kind: "cmd", text: "ollama list" },
  { kind: "dim", text: "NAME                SIZE" },
  { kind: "out", text: "qwen3.6:35b-a3b     21 GB" },
  { kind: "out", text: "gemma4:e4b          6.1 GB" },
  { kind: "cmd", text: "code-opencode.bat D:\\project\\my-app" },
  { kind: "ok", text: "● ollama/qwen3.6:35b-a3b · context 64K · tools on · network: not needed" },
];

export function Terminal({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "0px", false);
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<{ line: number; chars: number }>({ line: reduce ? TERMINAL.length : 0, chars: 0 });
  const stateRef = useRef(shown);

  useEffect(() => {
    if (reduce || !inView) return;
    let timer = 0;
    const schedule = () => {
      const s = stateRef.current;
      const cur = TERMINAL[s.line];
      const delay = !cur ? 5200 : cur.kind === "cmd" ? (s.chars === 0 ? 650 : 34) : 140;
      timer = window.setTimeout(() => {
        const s2 = stateRef.current;
        const line = TERMINAL[s2.line];
        const next = !line
          ? { line: 0, chars: 0 }
          : line.kind === "cmd" && s2.chars < line.text.length
            ? { line: s2.line, chars: s2.chars + 1 }
            : { line: s2.line + 1, chars: 0 };
        stateRef.current = next;
        setShown(next);
        schedule();
      }, delay);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [inView, reduce]);

  return (
    <div ref={ref} dir="ltr" className={cn("latin w-full overflow-hidden rounded-2xl bg-[#060807] text-left shadow-[0_24px_48px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/10", className)}>
      <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ms-3 font-mono text-[11.5px] text-fog-400">AI Offline — Windows PowerShell</span>
        <span className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-0.5 font-mono text-[10.5px] text-emerald-300 ring-1 ring-emerald-400/25">
          <WifiOff className="h-3 w-3" /> offline
        </span>
      </div>
      <pre className="min-h-[300px] whitespace-pre-wrap break-all px-4 py-4 font-mono text-[12px] leading-[1.75] sm:text-[12.5px]">
        {TERMINAL.map((ln, i) => {
          if (i > shown.line) return null;
          const partial = i === shown.line;
          if (partial && ln.kind !== "cmd") return null;
          const text = partial ? ln.text.slice(0, shown.chars) : ln.text;
          return (
            <div key={i} className={ln.kind === "cmd" ? "text-fog-50" : ln.kind === "dim" ? "text-fog-500" : ln.kind === "ok" ? "text-emerald-300" : "text-[#9be8c6]"}>
              {ln.kind === "cmd" && <span className="text-emerald-400">PS C:\&gt; </span>}
              {text}
              {partial && <span className="ms-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[2px] bg-emerald-300 animate-caret" />}
            </div>
          );
        })}
        {shown.line >= TERMINAL.length && (
          <div className="text-fog-50">
            <span className="text-emerald-400">PS C:\&gt; </span>
            <span className="inline-block h-[1.05em] w-[0.55em] translate-y-[2px] bg-emerald-300 animate-caret" />
          </div>
        )}
      </pre>
    </div>
  );
}

export function OfflineMedia() {
  return (
    <div className="relative flex h-full w-full items-center p-4 sm:p-5 lg:p-6">
      <Glow className="h-[70%] w-[70%]" color="radial-gradient(closest-side, rgba(52,211,153,0.22), transparent)" />
      <Terminal className="relative" />
    </div>
  );
}

/* ───────────────────────── Ashpazino: three phones with real screens ───────────────────────── */
function Phone({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("device-phone", className)} style={style}>
      <div className="screen aspect-[9/16]">
        <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

export function AshpazinoMedia({ large = false }: { large?: boolean }) {
  const { t } = useLang();
  const w = large ? "w-[min(30%,240px)]" : "w-[min(33%,212px)]";
  return (
    <div className="group/phones relative flex h-full min-h-[360px] w-full items-center justify-center overflow-hidden">
      <Glow className="h-[85%] w-[75%]" color="radial-gradient(closest-side, rgba(249,115,22,0.34), rgba(250,204,21,0.1) 60%, transparent)" />
      <Phone
        src={media("ashpazino/screen-suggestions.webp")}
        alt={t({ fa: "پیشنهاد غذا", en: "Suggestions" })}
        className={cn("absolute z-10 transition-transform duration-700 ease-[var(--ease-out-expo)]", w)}
        style={{ transform: "translateX(-64%) translateY(22px) rotate(-7deg) scale(0.92)" }}
      />
      <Phone
        src={media("ashpazino/screen-pantry.webp")}
        alt={t({ fa: "مواد خانه", en: "Pantry" })}
        className={cn("relative z-20 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/phones:-translate-y-2", w)}
      />
      <Phone
        src={media("ashpazino/screen-cooking_mode.webp")}
        alt={t({ fa: "حالت آشپزی", en: "Cooking mode" })}
        className={cn("absolute z-10 transition-transform duration-700 ease-[var(--ease-out-expo)]", w)}
        style={{ transform: "translateX(64%) translateY(22px) rotate(7deg) scale(0.92)" }}
      />
      <img
        src={media("ashpazino/icon.webp")}
        alt=""
        aria-hidden
        className="absolute end-5 top-5 z-30 w-11 rounded-2xl shadow-[0_10px_30px_-5px_rgba(249,115,22,0.6)]"
      />
    </div>
  );
}

export function ProjectMedia({ id, large = false }: { id: string; large?: boolean }) {
  switch (id) {
    case "hellogap":
      return <HelloGapMedia large={large} />;
    case "jadoo":
      return <JadooMedia large={large} />;
    case "learnhub":
      return <LearnHubMedia large={large} />;
    case "ashpazino":
      return <AshpazinoMedia large={large} />;
    case "bale-chat":
      return <BaleChatMedia large={large} />;
    case "telegram-bots":
      return <BotsMedia large={large} />;
    default:
      return <OfflineMedia />;
  }
}
