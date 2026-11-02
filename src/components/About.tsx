import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Check } from "lucide-react";
import { useLang } from "../i18n/lang";
import { ui } from "../data/ui";
import { liveSocials, profile } from "../data/profile";
import { GlowCard, Reveal, SectionTitle } from "./ui/primitives";
import { SocialIcon } from "./ui/icons";
import { cn, useNow } from "../lib/hooks";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  const blur = useTransform(progress, range, ["blur(3px)", "blur(0px)"]);
  return (
    <>
      <motion.span style={{ opacity, filter: blur }}>{children}</motion.span>{" "}
    </>
  );
}

function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.5"] });
  const words = text.split(" ");
  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={`${i}-${w}`} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Card({ children, className, accent }: { children: ReactNode; className?: string; accent?: string }) {
  return (
    <GlowCard accent={accent} className={cn("rounded-3xl border border-white/[0.08] bg-ink-900/70 p-6 sm:p-7", className)}>
      {children}
    </GlowCard>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[11.5px] uppercase tracking-label text-fog-500">{children}</p>;
}

function ClockCard({ className }: { className?: string }) {
  const { t, isFa, digits } = useLang();
  const now = useNow(1000);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: profile.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (k: string) => Number(parts.find((p) => p.type === k)?.value ?? 0);
  const h = get("hour");
  const m = get("minute");
  const s = get("second");
  const hm = new Intl.DateTimeFormat(isFa ? "fa-IR" : "en-GB", { timeZone: profile.timezone, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  const sec = digits(String(s).padStart(2, "0"));
  const hand = (deg: number, len: number, w: number, color: string) => (
    <line x1="50" y1="50" x2={50 + Math.sin((deg * Math.PI) / 180) * len} y2={50 - Math.cos((deg * Math.PI) / 180) * len} stroke={color} strokeWidth={w} strokeLinecap="round" />
  );
  return (
    <Card className={cn("flex items-center gap-6", className)} accent="#5ce1e6">
      <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0" aria-hidden>
        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="7"
            x2="50"
            y2={i % 3 === 0 ? 14 : 11}
            stroke={i % 3 === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}
            strokeWidth="1.5"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        {hand((h % 12) * 30 + m * 0.5, 24, 3, "#ebebf0")}
        {hand(m * 6 + s * 0.1, 34, 2, "#b2b2c3")}
        {hand(s * 6, 38, 1.2, "#ffb547")}
        <circle cx="50" cy="50" r="2.6" fill="#ffb547" />
      </svg>
      <div className="min-w-0">
        <Label>{t(ui.about.timeTitle)}</Label>
        <p dir="ltr" className="latin mt-2 text-start font-display text-5xl font-bold tabular-nums text-fog-50 rtl:text-end">
          {hm}
          <span className="ms-1 text-xl text-fog-500">{sec}</span>
        </p>
        <p className="mt-1 text-sm text-fog-400">
          {t(ui.about.timeNote)} · <span className="latin">{digits(profile.utcOffset)}</span>
        </p>
      </div>
    </Card>
  );
}

function ReachCard({ className }: { className?: string }) {
  const { t } = useLang();
  const telegram = liveSocials().find((s) => s.id === "telegram");
  return (
    <Card className={cn("relative overflow-hidden", className)} accent="#2AABEE">
      <span aria-hidden className="pointer-events-none absolute -bottom-8 -end-6 text-[#2AABEE] opacity-[0.12]">
        <SocialIcon id="telegram" size={150} />
      </span>
      <Label>
        <span className="me-2 inline-block h-2 w-2 rounded-full bg-emerald-400 text-emerald-400 animate-pulse-dot" />
        {t(ui.about.reachTitle)}
      </Label>
      {telegram ? (
        <a href={telegram.url} target="_blank" rel="noreferrer noopener" className="latin relative mt-4 block font-display text-[1.7rem] font-semibold text-fog-50 transition-colors hover:text-[#7fd0ff]">
          {telegram.handle ?? telegram.label}
        </a>
      ) : (
        <a href={`mailto:${profile.email}`} className="latin relative mt-4 block font-display text-xl font-semibold text-fog-50">
          {profile.email}
        </a>
      )}
      <p className="relative mt-2 text-sm text-fog-400">
        {t(ui.about.reachNote)} ·{" "}
        <a href={`mailto:${profile.email}`} className="latin text-fog-300 hover:text-fog-50">
          {profile.email}
        </a>
      </p>
    </Card>
  );
}

function PrinciplesCard({ className }: { className?: string }) {
  const { t } = useLang();
  return (
    <Card className={className} accent="#ffb547">
      <Label>{t(ui.about.principlesTitle)}</Label>
      <ul className="mt-4 space-y-3">
        {ui.about.principles.map((p, i) => (
          <li key={i} className="flex items-start gap-3 text-[15px] leading-snug-i18n text-fog-200">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber/15 text-amber ring-1 ring-amber/30">
              <Check className="h-3 w-3" />
            </span>
            {t(p)}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ProcessCard({ className }: { className?: string }) {
  const { t, digits } = useLang();
  const reduce = useReducedMotion();
  return (
    <Card className={className} accent="#5ce1e6">
      <Label>{t(ui.about.processTitle)}</Label>
      <ol className="relative mt-7 grid gap-6 sm:grid-cols-5 sm:gap-4">
        <div aria-hidden className="absolute inset-x-[10%] top-[18px] hidden h-px bg-white/10 sm:block">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-ice via-fog-50 to-amber rtl:origin-right"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        {ui.about.process.map((s, i) => (
          <motion.li
            key={i}
            className="relative flex items-start gap-4 sm:flex-col sm:items-center sm:text-center"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="latin relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink-800 font-mono text-[12px] text-amber ring-1 ring-white/15">
              {digits(`0${i + 1}`)}
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-fog-50">{t(s.k)}</p>
              <p className="mt-1 text-[13.5px] leading-snug-i18n text-fog-400">{t(s.v)}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Card>
  );
}

export function About() {
  const { t } = useLang();
  return (
    <section id="about" className="relative py-28 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(92,225,230,0.07),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle
          index="02"
          eyebrow={ui.about.eyebrow}
          title={[
            { fa: "کمی", en: "A little" },
            { fa: "دربارهٔ من", en: "about me" },
          ]}
        />
        <ScrollWords
          text={t(ui.about.statement)}
          className="mt-12 max-w-6xl font-display text-[clamp(1.55rem,3.4vw,3rem)] font-semibold leading-snug-i18n tracking-display text-fog-50 sm:mt-16"
        />
        <div className="mt-16 grid gap-4 md:grid-cols-6 sm:mt-24">
          <Reveal className="md:col-span-2">
            <ClockCard className="h-full" />
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.08}>
            <ReachCard className="h-full" />
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.16}>
            <PrinciplesCard className="h-full" />
          </Reveal>
          <Reveal className="md:col-span-6" delay={0.1}>
            <ProcessCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
