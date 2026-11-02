import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "../../i18n/lang";
import { moreWork, projects, type Project } from "../../data/projects";
import { ui } from "../../data/ui";
import { AnimatedValue, Chip, GlowCard, Reveal, SectionTitle } from "../ui/primitives";
import { ProjectMedia } from "./media";
import { useOverlays } from "../overlays/OverlayContext";
import { cn, scrollToId, useMediaQuery } from "../../lib/hooks";

function ProjectCard({ p, total, stacked }: { p: Project; total: number; stacked: boolean }) {
  const { t, digits, isFa } = useLang();
  const { openProject } = useOverlays();
  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    openProject(p.id);
  };
  return (
    <GlowCard
      as="article"
      accent={p.accent.a}
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900",
        stacked ? "h-[min(calc(100svh-150px),660px)]" : "",
      )}
      style={{ boxShadow: "0 28px 56px -28px rgba(0,0,0,0.9)" } as CSSProperties}
    >
      {/* accent light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(70% 90% at ${isFa ? "22%" : "78%"} 45%, ${p.accent.a}24, transparent 70%), radial-gradient(50% 60% at ${isFa ? "5%" : "95%"} 100%, ${p.accent.b}1f, transparent 70%)`,
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className={cn("relative grid h-full", stacked ? "grid-cols-[minmax(0,1fr)_minmax(0,1.22fr)]" : "grid-cols-1")}>
        {/* media first on small screens */}
        <div className={cn("relative min-w-0", stacked ? "order-2" : "order-1 h-[340px] sm:h-[420px]")}>
          <ProjectMedia id={p.id} />
        </div>

        <div className={cn("relative flex min-w-0 flex-col p-6 sm:p-8 lg:p-10", stacked ? "order-1" : "order-2")}>
          <div className="flex items-center justify-between gap-4 font-mono text-[11.5px] uppercase tracking-label text-fog-500">
            <span className="latin">
              <span style={{ color: p.accent.a }}>{digits(p.index)}</span> / {digits(String(total).padStart(2, "0"))}
            </span>
            <span className="truncate text-end">{t(p.kicker)}</span>
          </div>

          <div className={cn(stacked ? "my-auto py-4" : "mt-8")}>
            <h3 className="font-display text-[clamp(2.6rem,5.2vw,4.6rem)] font-bold leading-display tracking-display text-fog-50">
              {t(p.name)}
            </h3>
            <p className="mt-4 max-w-xl text-[clamp(1.05rem,1.5vw,1.3rem)] leading-snug-i18n text-fog-200">{t(p.tagline)}</p>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-5">
            {p.metrics.map((m, i) => (
              <div key={i} className="min-w-0">
                <dt className="sr-only">{t(m.label)}</dt>
                <dd>
                  <AnimatedValue value={m.value} className="block font-display text-[clamp(1.5rem,2.4vw,2.1rem)] font-bold leading-none text-fog-50" />
                  <span className="mt-2 block text-[12.5px] leading-snug-i18n text-fog-400">{t(m.label)}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex flex-wrap gap-1.5 [@media(max-height:760px)]:hidden">
            {p.stack.slice(0, 6).map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={`#/work/${p.id}`}
              onClick={open}
              className="group/cta inline-flex items-center gap-2 rounded-full bg-fog-50 py-2.5 pe-4 ps-5 text-[14px] font-semibold text-ink-950 transition-transform hover:scale-[1.03] active:scale-95"
            >
              {t(ui.work.explore)}
              <span className="grid h-6 w-6 place-items-center rounded-full bg-ink-950 text-fog-50 transition-transform duration-300 group-hover/cta:rotate-45 rtl:group-hover/cta:-rotate-45">
                <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </GlowCard>
  );
}

function StackItem({
  i,
  n,
  progress,
  children,
}: {
  i: number;
  n: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const start = i / (n - 1);
  const next = Math.min(1, (i + 1) / (n - 1));
  const last = i === n - 1;
  const scale = useTransform(progress, [start, 1], [1, last ? 1 : 1 - (n - 1 - i) * 0.04]);
  const dim = useTransform(progress, [start, next], [0, last ? 0 : 0.55]);
  // each card is its own GPU layer: scaling and dimming then never repaint the card's content while scrolling
  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center px-5 pt-[var(--nav-h)] sm:px-8">
      <motion.div style={{ scale, top: i * 16 }} className="relative w-full max-w-7xl origin-top will-change-transform">
        {children}
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 rounded-[28px] bg-ink-950 will-change-[opacity]" />
      </motion.div>
    </div>
  );
}

export function Work() {
  const { t } = useLang();
  const desktop = useMediaQuery("(min-width: 1024px) and (min-height: 640px)");
  const reduce = useReducedMotion();
  const stacked = desktop && !reduce;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="work" className="relative pt-28 sm:pt-36">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <SectionTitle index="01" eyebrow={ui.work.eyebrow} title={ui.work.title} />
        <Reveal delay={0.1}>
          <p className="max-w-md text-[15.5px] leading-body text-fog-400 lg:ms-auto lg:mb-3">{t(ui.work.intro)}</p>
        </Reveal>
      </div>

      <div ref={ref} className={cn("relative", stacked ? "mt-6" : "mt-14 flex flex-col gap-6 px-5 pb-10 sm:px-8")}>
        {projects.map((p, i) =>
          stacked ? (
            <StackItem key={p.id} i={i} n={projects.length} progress={scrollYProgress}>
              <ProjectCard p={p} total={projects.length} stacked />
            </StackItem>
          ) : (
            <Reveal key={p.id} className="mx-auto w-full max-w-3xl">
              <ProjectCard p={p} total={projects.length} stacked={false} />
            </Reveal>
          ),
        )}
      </div>

      <MoreWork />
    </section>
  );
}

/** Short list under the cards: the featured projects are a sample, not everything. */
function MoreWork() {
  const { t, digits } = useLang();
  return (
    <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 sm:pt-28">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-white/[0.08] pb-6">
          <h3 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-display tracking-display text-fog-50">{t(ui.moreWork.title)}</h3>
          <p className="max-w-md text-[15px] leading-body text-fog-400">{t(ui.moreWork.intro)}</p>
        </div>
      </Reveal>
      <ul>
        {moreWork.map((m, i) => (
          <Reveal
            as="li"
            key={m.title.en}
            delay={(i % 3) * 0.05}
            y={14}
            className="grid gap-x-8 gap-y-2 border-b border-white/[0.06] py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(0,auto)] md:items-baseline"
          >
            <p className="font-display text-lg font-semibold text-fog-50 sm:text-xl">{t(m.title)}</p>
            <p className="text-[14.5px] leading-body text-fog-400">{t(m.text)}</p>
            <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
              {m.tags.map((tag) => (
                <Chip key={tag} className="px-2.5 py-0.5 text-[11px]">
                  {tag}
                </Chip>
              ))}
              <span className="latin ms-1 font-mono text-[11.5px] text-fog-500">{digits(m.year)}</span>
            </div>
          </Reveal>
        ))}
      </ul>
      <Reveal>
        <p className="mt-8 text-[15px] leading-body text-fog-300">
          {t(ui.moreWork.outro)}{" "}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("contact");
            }}
            className="inline-flex items-center gap-1 font-semibold text-amber hover:text-amber-soft"
          >
            {t(ui.moreWork.ask)}
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
          </a>
        </p>
      </Reveal>
    </div>
  );
}
