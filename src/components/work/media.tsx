import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { WifiOff } from "lucide-react";
import { useLang } from "../../i18n/lang";
import { JADOO_REEL_LENGTH, jadooModes, media } from "../../data/projects";
import { LazyVideo } from "../ui/primitives";
import { cn, useInView } from "../../lib/hooks";

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
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[80%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(168,85,247,0.45),rgba(251,146,60,0.18)_60%,transparent)] blur-3xl" />
      {posters.map((p, i) => {
        const side = i - 1;
        return (
          <div
            key={p.src}
            className={cn(
              "absolute aspect-[2/3] overflow-hidden rounded-[22px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15 transition-transform duration-700 ease-[var(--ease-out-expo)]",
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
        className="absolute bottom-4 left-1/2 z-30 w-16 -translate-x-1/2 drop-shadow-[0_0_24px_rgba(168,85,247,0.55)]"
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
          poster={media("jadoo/nebula-1600.webp")}
          onTime={setTime}
          className="h-full w-full object-cover"
          label="JADOO demo reel"
        />
        <span className="latin pointer-events-none absolute end-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fog-200 backdrop-blur">
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
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[85%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.38),rgba(250,204,21,0.12)_60%,transparent)] blur-3xl" />
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
    <div ref={ref} dir="ltr" className={cn("latin w-full overflow-hidden rounded-2xl bg-[#060807] text-left shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/10", className)}>
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
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(52,211,153,0.25),transparent)] blur-3xl" />
      <Terminal className="relative" />
    </div>
  );
}

export function ProjectMedia({ id, large = false }: { id: string; large?: boolean }) {
  switch (id) {
    case "hellogap":
      return <HelloGapMedia large={large} />;
    case "jadoo":
      return <JadooMedia large={large} />;
    case "ashpazino":
      return <AshpazinoMedia large={large} />;
    default:
      return <OfflineMedia />;
  }
}
