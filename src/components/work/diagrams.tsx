import { Fragment } from "react";
import { ArrowRight, Globe, FolderOpen, Sparkles } from "lucide-react";
import { useLang, type L } from "../../i18n/lang";
import type { ProjectId } from "../../data/projects";
import { cn } from "../../lib/hooks";

const l = (fa: string, en: string): L => ({ fa, en });

/* ───────── generic pipeline: a row of steps with arrows ───────── */
export const pipelines: Partial<Record<ProjectId, { title: L; steps: { k: string; v: L }[] }>> = {
  jadoo: {
    title: l("مسیر هر فریم", "The path of every frame"),
    steps: [
      { k: "Webcam", v: l("thread جدا", "own thread") },
      { k: "MediaPipe", v: l("۲۱ نقطه × ۲ دست", "21 points × 2 hands") },
      { k: "One-Euro", v: l("حذف لرزش", "jitter filter") },
      { k: "Gestures", v: l("مشت · نیشگون · V", "fist · pinch · V") },
      { k: "Mode", v: l("update · render · sound", "update · render · sound") },
      { k: "Numba + Synth", v: l("نور، درخشش، صدا", "light, bloom, audio") },
    ],
  },
  learnhub: {
    title: l("مسیر یک خرید", "The path of a purchase"),
    steps: [
      { k: "Cart", v: l("سبد خرید · کد تخفیف", "cart · coupon") },
      { k: "Order", v: l("سفارش و مبلغ نهایی", "order and final total") },
      { k: "Heleket", v: l("فاکتور رمزارز", "crypto invoice") },
      { k: "Webhook", v: l("بررسی امضا · لاگ", "signature check · log") },
      { k: "Enrollment", v: l("دسترسی به درس‌ها", "access to the lessons") },
      { k: "Notify", v: l("اعلان و ایمیل", "notification & email") },
    ],
  },
  "bale-chat": {
    title: l("از جستجو تا گفتگو", "From search to chat"),
    steps: [
      { k: "Profile", v: l("جنسیت · سن · استان · شهر", "gender · age · province · city") },
      { k: "Search pool", v: l("بررسی هر ۵ ثانیه", "checked every 5 s") },
      { k: "Match", v: l("فیلتر و کسر سکه", "filters & coin cost") },
      { k: "Relay", v: l("متن · عکس · ویس · فایل", "text · photo · voice · file") },
      { k: "After chat", v: l("گزارش یا چت دوباره", "report or chat again") },
    ],
  },
  "telegram-bots": {
    title: l("ربات‌ساز آپلودر", "The uploader bot builder"),
    steps: [
      { k: "/start", v: l("ساخت ربات جدید", "create a new bot") },
      { k: "Token", v: l("توکن از BotFather", "token from BotFather") },
      { k: "run_bot()", v: l("ربات همان لحظه روشن می‌شود", "the bot goes live at once") },
      { k: "MySQL", v: l("جدول جدا برای هر کاربر", "a table per user") },
      { k: "Upload", v: l("تکی یا گروهی", "single or batch") },
      { k: "Link", v: l("لینک یکتای هر فایل", "a unique link per file") },
    ],
  },
  ashpazino: {
    title: l("از قفسه تا قابلمه", "From shelf to pot"),
    steps: [
      { k: "Pantry", v: l("لمس مواد خانه", "tap what you have") },
      { k: "Matcher", v: l("۳۰۰ دستور JSON", "300 JSON recipes") },
      { k: "Suggestions", v: l("الان · یکی دو قلم کم", "now · 1–2 missing") },
      { k: "Recipe", v: l("قدم‌به‌قدم", "step by step") },
      { k: "Cooking mode", v: l("صفحه روشن می‌ماند", "screen stays on") },
      { k: "Shopping list", v: l("خرید ← مواد خانه", "bought → pantry") },
    ],
  },
};

export function Pipeline({ id }: { id: ProjectId }) {
  const { t } = useLang();
  const p = pipelines[id];
  if (!p) return null;
  return (
    <div>
      <p className="mb-4 font-mono text-[11.5px] uppercase tracking-label text-fog-500">{t(p.title)}</p>
      <ol className="flex flex-wrap items-stretch gap-2">
        {p.steps.map((s, i) => (
          <Fragment key={s.k}>
            <li className="min-w-[120px] flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
              <p className="latin font-mono text-[13px] text-fog-50">{s.k}</p>
              <p className="mt-1 text-[12.5px] leading-snug-i18n text-fog-400">{t(s.v)}</p>
            </li>
            {i < p.steps.length - 1 && (
              <li aria-hidden className="hidden items-center text-fog-600 sm:flex">
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </div>
  );
}

/* ───────── HelloGap architecture (SVG) ───────── */
type Box = { x: number; y: number; w: number; h: number; title: string; sub: L; color: string };

export function HelloGapDiagram() {
  const { t, isFa } = useLang();
  const boxes: Record<string, Box> = {
    a: { x: 30, y: 40, w: 210, h: 92, title: "Flutter app", sub: l("کاربر الف", "user A"), color: "#a855f7" },
    b: { x: 30, y: 388, w: 210, h: 92, title: "Flutter app", sub: l("کاربر ب", "user B"), color: "#fb923c" },
    srv: { x: 395, y: 176, w: 250, h: 168, title: "Node.js · Fastify", sub: l("Socket.IO · کلاستر PM2", "Socket.IO · PM2 cluster"), color: "#5ce1e6" },
    redis: { x: 760, y: 70, w: 210, h: 110, title: "Redis", sub: l("حضور · صف · کیف پول · مسدودی", "presence · queues · wallet · bans"), color: "#ff5b4a" },
    admin: { x: 760, y: 340, w: 210, h: 92, title: "Admin panel", sub: l("هشدار · آمار · گزارش‌ها", "alerts · stats · reports"), color: "#ffb547" },
    turn: { x: 395, y: 420, w: 250, h: 70, title: "coturn (TURN)", sub: l("رلهٔ پشتیبان", "fallback relay"), color: "#94a3b8" },
  };
  const label = (x: number, y: number, text: string, color = "#8b8ba1") => (
    <text x={x} y={y} textAnchor="middle" fontSize="13" fill={color} direction={isFa ? "rtl" : "ltr"} className="font-mono">
      {text}
    </text>
  );
  const node = (b: Box) => (
    <g>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="18" fill="#0d0d13" stroke={b.color} strokeOpacity="0.55" />
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="18" fill={b.color} fillOpacity="0.06" />
      <circle cx={b.x + 20} cy={b.y + 22} r="4" fill={b.color} />
      <text x={b.x + b.w / 2} y={b.y + b.h / 2 - 2} textAnchor="middle" fontSize="18" fontWeight="700" fill="#f6f6f8" className="font-display">
        {b.title}
      </text>
      <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 22} textAnchor="middle" fontSize="13" fill="#b2b2c3" direction={isFa ? "rtl" : "ltr"}>
        {t(b.sub)}
      </text>
    </g>
  );
  const { a, b, srv, redis, admin, turn } = boxes;
  return (
    <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-ink-900/60 p-4 sm:p-6" dir="ltr">
      <svg viewBox="0 0 1000 520" className="h-auto w-full min-w-[720px]" role="img" aria-label={t(l("نمودار معماری هلوگپ", "HelloGap architecture diagram"))}>
        <defs>
          {/* userSpaceOnUse: a bounding-box gradient never renders on a perfectly vertical line */}
          <linearGradient id="hg-p2p" gradientUnits="userSpaceOnUse" x1="0" y1={a.y + a.h} x2="0" y2={b.y}>
            <stop offset="0" stopColor="#a855f7" />
            <stop offset="1" stopColor="#fb923c" />
          </linearGradient>
          <linearGradient id="hg-p2p-box" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a855f7" />
            <stop offset="1" stopColor="#fb923c" />
          </linearGradient>
        </defs>
        {/* socket links */}
        {[a, b].map((u, i) => (
          <path
            key={i}
            d={`M ${u.x + u.w} ${u.y + u.h / 2} C ${u.x + u.w + 90} ${u.y + u.h / 2}, ${srv.x - 90} ${srv.y + srv.h / 2 + (i ? 30 : -30)}, ${srv.x} ${srv.y + srv.h / 2 + (i ? 30 : -30)}`}
            fill="none"
            stroke="#5ce1e6"
            strokeOpacity="0.7"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-dash"
          />
        ))}
        {label(318, 150, t(l("وب‌سوکت · TLS پین‌شده", "WebSocket · pinned TLS")), "#5ce1e6")}
        {label(318, 382, t(l("سیگنالینگ تماس", "call signaling")), "#5ce1e6")}
        {/* server ↔ redis */}
        <path d={`M ${srv.x + srv.w} ${srv.y + 50} C ${srv.x + srv.w + 60} ${srv.y + 50}, ${redis.x - 60} ${redis.y + redis.h / 2}, ${redis.x} ${redis.y + redis.h / 2}`} fill="none" stroke="#ff5b4a" strokeOpacity="0.7" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
        {label(705, 165, "pub/sub · adapter", "#ff8a7d")}
        {/* admin → server */}
        <path d={`M ${admin.x} ${admin.y + admin.h / 2} C ${admin.x - 60} ${admin.y + admin.h / 2}, ${srv.x + srv.w + 60} ${srv.y + srv.h - 40}, ${srv.x + srv.w} ${srv.y + srv.h - 40}`} fill="none" stroke="#ffb547" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
        {label(705, 352, "HTTPS", "#ffcf80")}
        {/* P2P video between the two apps */}
        <path d={`M ${a.x + 60} ${a.y + a.h} L ${b.x + 60} ${b.y}`} stroke="url(#hg-p2p)" strokeWidth="3.5" strokeLinecap="round" />
        <g transform={`translate(${a.x + 60} ${(a.y + a.h + b.y) / 2})`}>
          <rect x="-74" y="-17" width="148" height="34" rx="17" fill="#09090d" stroke="url(#hg-p2p-box)" />
          <text textAnchor="middle" y="5" fontSize="13" fontWeight="600" fill="#f6f6f8" className="font-mono">
            WebRTC · P2P
          </text>
        </g>
        {/* TURN fallback */}
        <path d={`M ${b.x + b.w} ${b.y + b.h - 20} C ${b.x + b.w + 70} ${b.y + b.h - 20}, ${turn.x - 70} ${turn.y + turn.h / 2}, ${turn.x} ${turn.y + turn.h / 2}`} fill="none" stroke="#94a3b8" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="2 6" />
        {label(318, 505, t(l("اگر P2P بسته باشد", "if P2P is blocked")), "#8b8ba1")}
        {Object.values(boxes).map((bx) => (
          <Fragment key={bx.title + bx.y}>{node(bx)}</Fragment>
        ))}
      </svg>
    </div>
  );
}

/* ───────── AI Offline: flow + Windows context menu ───────── */
export function OfflineFlow() {
  const { t } = useLang();
  const steps = [
    { k: l("راست‌کلیک / آیکون دسکتاپ", "Right-click / desktop icon"), v: "Explorer · AI-Web.bat" },
    { k: l("رابط و ایجنت‌ها", "Interfaces & agents"), v: "OpenCode web :4096 · TUI · Claude Code" },
    { k: l("سرور مدل محلی", "Local model server"), v: "Ollama · 127.0.0.1:11434" },
    { k: l("مدل‌ها روی دیسک", "Models on disk"), v: "qwen3.6:35b-a3b · gemma4:e4b" },
  ];
  return (
    <div>
      <ol className="grid gap-2 sm:grid-cols-4">
        {steps.map((s, i) => (
          <li key={i} className="relative rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] px-4 py-3">
            <p className="text-[13px] font-semibold text-fog-50">{t(s.k)}</p>
            <p className="latin mt-1 font-mono text-[11.5px] leading-relaxed text-emerald-200/80">{s.v}</p>
          </li>
        ))}
      </ol>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-400/[0.06] px-3 py-1.5 text-[12.5px] text-rose-200">
        <Globe className="h-3.5 w-3.5" />
        <span className="line-through decoration-rose-300/80">{t(l("اینترنت", "Internet"))}</span>
        <span className="text-fog-400">{t(l("— لازم نیست", "— not required"))}</span>
      </div>
    </div>
  );
}

export function ContextMenuMock({ className }: { className?: string }) {
  const { t } = useLang();
  // the two labels are exactly what install-shortcuts.ps1 registers
  const items = [
    { icon: <FolderOpen className="h-4 w-4" />, text: "Open", latin: true },
    { icon: <Sparkles className="h-4 w-4 text-emerald-300" />, text: "باز کردن ایجنت هوش مصنوعی اینجا (OpenCode)", hot: true },
    { icon: <Sparkles className="h-4 w-4 text-amber" />, text: "باز کردن Claude Code آفلاین اینجا" },
  ];
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-[#1c1c22]/95 p-1.5 shadow-[0_18px_36px_-16px_rgba(0,0,0,0.9)]", className)}>
      <p className="px-3 pb-1 pt-2 text-[11px] text-fog-500">{t(l("منوی راست‌کلیک ویندوز", "Windows right-click menu"))}</p>
      {items.map((it, i) => (
        <div
          key={i}
          dir={it.latin ? "ltr" : "rtl"}
          className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px]", it.hot ? "bg-white/[0.08] text-fog-50" : "text-fog-300")}
        >
          {it.icon}
          <span className={it.latin ? "latin" : "font-fa"}>{it.text}</span>
        </div>
      ))}
      <div className="mx-3 my-1 h-px bg-white/10" />
      <div dir="ltr" className="latin px-3 py-2 text-[13.5px] text-fog-500">Properties</div>
    </div>
  );
}

export function ConfigSnippet() {
  const k = (s: string) => <span className="text-[#9cdcfe]">{s}</span>;
  const v = (s: string) => <span className="text-[#ce9178]">{s}</span>;
  const b = (s: string) => <span className="text-[#569cd6]">{s}</span>;
  return (
    <pre dir="ltr" className="latin overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#08090b] p-5 text-left font-mono text-[12.5px] leading-[1.8] text-fog-300">
      <span className="text-fog-600">{"// opencode.json (excerpt)"}</span>
      {"\n{\n  "}
      {k('"model"')}: {v('"ollama/qwen3.6:35b-a3b"')},{"\n  "}
      {k('"small_model"')}: {v('"ollama/gemma4:e4b"')},{"\n  "}
      {k('"autoupdate"')}: {b("false")},{"\n  "}
      {k('"share"')}: {v('"disabled"')},{"\n  "}
      {k('"enabled_providers"')}: [{v('"ollama"')}],{"\n  "}
      {k('"provider"')}: {"{ "}
      {k('"ollama"')}: {"{ "}
      {k('"options"')}: {"{ "}
      {k('"baseURL"')}: {v('"http://127.0.0.1:11434/v1"')}
      {" } } }"}
      {"\n}"}
    </pre>
  );
}
