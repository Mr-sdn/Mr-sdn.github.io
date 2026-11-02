import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, MousePointer2 } from "lucide-react";
import { useLang } from "../../i18n/lang";
import { profile } from "../../data/profile";
import { projects } from "../../data/projects";
import { ui } from "../../data/ui";
import { ButtonLink, Magnetic, Rotator } from "../ui/primitives";
import { cn, prefersReducedMotion, scrollToId, useMediaQuery, useNow } from "../../lib/hooks";
import { ParticleEngine, type FontSpec } from "./particleEngine";

const LATIN: FontSpec = { family: "Bricolage Grotesque Variable", weight: 800, dir: "ltr", lineHeight: 0.9 };
const PERSIAN: FontSpec = { family: "Vazirmatn Variable", weight: 900, dir: "rtl", lineHeight: 1.1 };
/** The font follows the word's script, not the page language ("SDN" stays Latin in Persian too). */
const fontFor = (word: string) => (/^[\x20-\x7E]+$/.test(word) ? LATIN : PERSIAN);

export function Hero() {
  const { t, lang, isFa, digits, num } = useLang();
  const rootRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ParticleEngine | null>(null);
  const [webgl, setWebgl] = useState(true);
  const reduce = useReducedMotion();
  const touch = useMediaQuery("(pointer: coarse)");
  const now = useNow(1000);

  useEffect(() => {
    const canvas = canvasRef.current;
    const slot = slotRef.current;
    const root = rootRef.current;
    if (!canvas || !slot || !root) return;
    try {
      engineRef.current = new ParticleEngine(canvas, slot, root, { reduced: prefersReducedMotion() });
    } catch {
      setWebgl(false);
      return;
    }
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  // re-sent on every language switch: the same word re-forms with a little burst
  useEffect(() => {
    const word = t(profile.heroWord);
    engineRef.current?.setWord(word, fontFor(word));
  }, [lang, t]);

  // gentle parallax as the hero scrolls away
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const canvasLift = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const time = new Intl.DateTimeFormat(isFa ? "fa-IR" : "en-GB", {
    timeZone: profile.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  const intro = (d: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1, delay: d, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section ref={rootRef} id="top" className="relative isolate min-h-[100svh] overflow-hidden">
      {/* background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-70 mask-radial" />
        <div className="absolute -top-[20%] left-[8%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(closest-side,rgba(92,225,230,0.16),transparent)] blur-2xl animate-aurora" />
        <div className="absolute -bottom-[30%] right-[2%] h-[64vmax] w-[64vmax] rounded-full bg-[radial-gradient(closest-side,rgba(255,181,71,0.13),transparent)] blur-2xl animate-aurora [animation-delay:-9s]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <motion.canvas ref={canvasRef} aria-hidden style={{ y: canvasLift }} className="absolute inset-0 -z-[5] h-full w-full" />

      <motion.div
        style={{ opacity: fade, y: lift }}
        className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-5 pb-28 pt-28 text-center sm:px-8"
      >
        {/* availability (switch off in src/data/profile.ts) */}
        {profile.available && (
          <motion.div {...intro(0.1)} className="mb-6 sm:mb-8">
            <span className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pe-4 ps-3 text-[13px] text-fog-200">
              <span className="relative grid h-2.5 w-2.5 place-items-center">
                <span className="absolute h-2.5 w-2.5 rounded-full bg-emerald-400 text-emerald-400 animate-pulse-dot" />
              </span>
              {t(ui.hero.eyebrow)}
            </span>
          </motion.div>
        )}

        <h1 className="sr-only">{t(ui.hero.h1)}</h1>

        {/* the particles draw the word inside this slot (sized for a short word, and for short screens) */}
        <div ref={slotRef} aria-hidden className="relative h-[clamp(150px,min(42vw,36svh),330px)] w-full max-w-6xl">
          {!webgl && (
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-[clamp(3rem,11vw,9.5rem)] font-extrabold leading-none tracking-display text-gradient">
                {t(profile.heroWord).replace("|", "")}
              </span>
            </div>
          )}
        </div>

        <motion.p {...intro(0.35)} className="mt-6 font-display text-[clamp(1.35rem,3.1vw,2.35rem)] font-semibold leading-snug-i18n tracking-display text-fog-50">
          {t(ui.hero.leadPrefix)}{ui.hero.leadPrefix.en && !isFa ? " " : ""}
          <Rotator words={ui.hero.rotating} className="mx-1.5" />{" "}
          <span className="text-fog-300">{t(ui.hero.lead)}</span>
        </motion.p>

        <motion.p {...intro(0.45)} className="mx-auto mt-5 max-w-2xl text-[15.5px] leading-body text-fog-400 sm:text-base">
          {t(ui.hero.sub)}
        </motion.p>

        <motion.div {...intro(0.55)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <ButtonLink
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("work");
              }}
              icon={<ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />}
            >
              {t(ui.hero.viewWork)}
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink
              href="#contact"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
              }}
              icon={<ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />}
            >
              {t(ui.hero.contact)}
            </ButtonLink>
          </Magnetic>
        </motion.div>

        {webgl && !reduce && (
          <motion.p {...intro(1.2)} className="mt-8 inline-flex items-center gap-2 text-[12.5px] text-fog-500">
            <MousePointer2 className="h-3.5 w-3.5 rtl:-scale-x-100" />
            {t(touch ? ui.hero.hintTouch : ui.hero.hint)}
          </motion.p>
        )}
      </motion.div>

      {/* bottom bar */}
      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl items-end justify-between px-5 pb-7 font-mono text-[11.5px] uppercase tracking-label text-fog-500 sm:px-8"
      >
        <span className="hidden sm:inline">
          {num(projects.length)} {t(ui.hero.projects)}
        </span>
        <span className="flex flex-col items-center gap-2 max-sm:mx-auto">
          <span className="relative h-10 w-[22px] rounded-full border border-white/15">
            <span className={cn("absolute left-1/2 top-2 h-2 w-[3px] -translate-x-1/2 rounded-full bg-amber", !reduce && "animate-scroll-dot")} />
          </span>
          {t(ui.hero.scroll)}
        </span>
        <span className="hidden items-center gap-2 sm:inline-flex">
          {t(ui.hero.localTime)} ·
          <bdi dir="ltr" className="latin tabular-nums text-fog-300">
            {time}
          </bdi>
          <bdi dir="ltr" className="latin text-fog-600">
            {digits(profile.utcOffset)}
          </bdi>
        </span>
      </motion.div>
    </section>
  );
}
