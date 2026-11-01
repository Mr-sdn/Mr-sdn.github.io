import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useLang, type L, type Text } from "../../i18n/lang";
import { cn } from "../../lib/hooks";

/* ───────── Magnetic: element leans toward the pointer ───────── */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });
  const onMove = (e: ReactPointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ x: sx, y: sy }} className={cn("inline-block", className)}>
      {children}
    </motion.div>
  );
}

/* ───────── Buttons (as links) ───────── */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  onClick,
  external,
  icon,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "soft";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  external?: boolean;
  icon?: ReactNode;
}) {
  const base =
    "group relative inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-[transform,background,box-shadow,color] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.97]";
  const styles = {
    primary:
      "bg-[linear-gradient(110deg,var(--color-amber-soft),var(--color-amber)_55%,#ff9a3d)] text-ink-950 shadow-[0_10px_40px_-10px_rgba(255,181,71,0.65),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_14px_50px_-8px_rgba(255,181,71,0.85),inset_0_1px_0_rgba(255,255,255,0.6)]",
    ghost: "glass text-fog-50 hover:bg-white/10",
    soft: "bg-white/[0.06] text-fog-50 ring-1 ring-white/10 hover:bg-white/[0.1]",
  }[variant];
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(base, styles, className)}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {children}
      {icon}
    </a>
  );
}

/* ───────── Section heading ───────── */
export function SectionTitle({
  index,
  eyebrow,
  title,
  className,
  align = "start",
}: {
  index: string;
  eyebrow: Text;
  title: [L, L];
  className?: string;
  align?: "start" | "center";
}) {
  const { t, isFa, digits } = useLang();
  return (
    <div className={cn(align === "center" ? "text-center" : "", className)}>
      <Reveal>
        <p className={cn("mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-label text-fog-400", align === "center" && "justify-center")}>
          <span className="latin text-amber">({digits(index)})</span>
          <span className="h-px w-10 bg-gradient-to-r from-amber/70 to-transparent rtl:bg-gradient-to-l" />
          <span>{t(eyebrow)}</span>
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-[clamp(2.6rem,7.4vw,6.4rem)] font-bold leading-display tracking-display text-fog-50">
          {t(title[0])}{" "}
          <span className={cn(isFa ? "font-light text-gradient" : "font-serif font-normal italic text-gradient")}>{t(title[1])}</span>
        </h2>
      </Reveal>
    </div>
  );
}

/* ───────── Reveal on scroll ───────── */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "p" | "li" | "span" | "section" | "article";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

/* ───────── Glow card: spotlight + border light under the pointer ───────── */
export function GlowCard({
  children,
  accent,
  className,
  style,
  as = "div",
}: {
  children: ReactNode;
  accent?: string;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const Comp = as;
  const onMove = (e: ReactPointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Comp
      ref={ref}
      onPointerMove={onMove}
      className={cn("glow-card", className)}
      style={{ ...(accent ? ({ "--accent": accent } as CSSProperties) : {}), ...style }}
    >
      {children}
    </Comp>
  );
}

/* ───────── Rotating words ───────── */
export function Rotator({ words, interval = 2600, className }: { words: L[]; interval?: number; className?: string }) {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval, reduce]);
  // the old word slides up and out, the new one slides in from below — clipped, so they never overlap
  return (
    <span className={cn("relative inline-flex overflow-hidden align-baseline", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          className="block whitespace-nowrap py-[0.14em] text-gradient-amber"
        >
          {t(words[i])}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ───────── Animated metric value ("300", "26k", "7,200", "21×2", "P2P") ───────── */
export function AnimatedValue({ value, className }: { value: string; className?: string }) {
  const { isFa, digits } = useLang();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const m = value.match(/^([\d,.]+)(.*)$/);
  const target = m ? parseFloat(m[1].replace(/,/g, "")) : NaN;
  const decimals = m && m[1].includes(".") ? m[1].split(".")[1].length : 0;
  const grouped = !!m && m[1].includes(",");
  const isNum = !!m && !Number.isNaN(target);
  const [shown, setShown] = useState(isNum && !reduce ? 0 : target);

  useEffect(() => {
    if (!isNum || reduce || !inView) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      setShown(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduce, isNum]);

  // values like "P2P" are names, not numbers: keep them exactly as written
  if (!m || Number.isNaN(target))
    return (
      <bdi ref={ref} dir="ltr" className={cn("latin", className)}>
        {value}
      </bdi>
    );
  const nf = new Intl.NumberFormat(isFa ? "fa-IR" : "en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
  return (
    <bdi ref={ref} dir="ltr" className={cn("latin tabular-nums", className)}>
      {nf.format(shown)}
      {digits(m[2])}
    </bdi>
  );
}

/* ───────── Lazy, muted, looping video that only plays while visible ───────── */
export function LazyVideo({
  src,
  poster,
  className,
  videoRef,
  onTime,
  rootMargin = "200px",
  label,
}: {
  src: string;
  poster: string;
  className?: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  onTime?: (t: number) => void;
  rootMargin?: string;
  label?: string;
}) {
  const local = useRef<HTMLVideoElement>(null);
  const ref = videoRef ?? local;
  const reduce = useReducedMotion();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          if (!reduce) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, reduce, rootMargin, load]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={load ? src : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      onTimeUpdate={onTime ? (e) => onTime(e.currentTarget.currentTime) : undefined}
    />
  );
}

/* ───────── Pill / chip ───────── */
export function Chip({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span
      style={style}
      className={cn(
        "latin inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11.5px] text-fog-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
