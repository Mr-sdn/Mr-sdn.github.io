import { useEffect, useRef, type ComponentType } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Bot,
  Boxes,
  BriefcaseBusiness,
  Camera,
  ChefHat,
  Coins,
  Eye,
  FlaskConical,
  FolderOpen,
  Gauge,
  Globe,
  Hand,
  Layers,
  LifeBuoy,
  ListChecks,
  Lock,
  MessagesSquare,
  MousePointerClick,
  Music,
  ShieldCheck,
  Sparkles,
  Tag,
  Terminal as TerminalIcon,
  UserRound,
  Video,
  Volume2,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { useLang } from "../../i18n/lang";
import { projects, type FeatureIcon, type Project } from "../../data/projects";
import { ui } from "../../data/ui";
import { AnimatedValue, Chip } from "../ui/primitives";
import { AshpazinoMedia, HelloGapMedia, JadooMedia, Terminal } from "../work/media";
import { ConfigSnippet, ContextMenuMock, HelloGapDiagram, OfflineFlow, Pipeline } from "../work/diagrams";
import { useOverlays } from "./OverlayContext";
import { cn } from "../../lib/hooks";

const ICONS: Record<FeatureIcon, ComponentType<{ className?: string }>> = {
  zap: Zap,
  video: Video,
  messages: MessagesSquare,
  shield: ShieldCheck,
  coins: Coins,
  gauge: Gauge,
  hand: Hand,
  sparkles: Sparkles,
  music: Music,
  volume: Volume2,
  camera: Camera,
  layers: Layers,
  chef: ChefHat,
  list: ListChecks,
  eye: Eye,
  wifiOff: WifiOff,
  flask: FlaskConical,
  terminal: TerminalIcon,
  globe: Globe,
  mouse: MousePointerClick,
  lock: Lock,
  book: BookOpen,
  boxes: Boxes,
  user: UserRound,
  tag: Tag,
  bot: Bot,
  briefcase: BriefcaseBusiness,
  folder: FolderOpen,
  lifebuoy: LifeBuoy,
};

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-label text-fog-500">
      <span className="h-px w-8 bg-gradient-to-r from-amber/70 to-transparent rtl:bg-gradient-to-l" />
      {children}
    </h2>
  );
}

function CaseHero({ p }: { p: Project }) {
  const frame = "overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900";
  switch (p.id) {
    case "hellogap":
      return (
        <div className={cn(frame, "h-[440px] sm:h-[600px]")}>
          <HelloGapMedia large />
        </div>
      );
    case "jadoo":
      return <JadooMedia large />;
    case "ashpazino":
      return (
        <div className={cn(frame, "h-[460px] sm:h-[620px]")}>
          <AshpazinoMedia large />
        </div>
      );
    default:
      return (
        <div className="grid items-center gap-6 lg:grid-cols-[1.35fr_1fr]">
          <Terminal />
          <ContextMenuMock className="mx-auto w-full max-w-sm" />
        </div>
      );
  }
}

export function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t, digits, isFa } = useLang();
  const { openProject, openLightbox } = useOverlays();
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const p = project;
  const idx = projects.findIndex((x) => x.id === p.id);
  const next = projects[(idx + 1) % projects.length];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    closeRef.current?.focus({ preventScroll: true });
  }, [p.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("[data-lightbox]")) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const meta = [
    { k: ui.caseStudy.year, v: digits(p.year) },
    { k: ui.caseStudy.role, v: t(p.role) },
    { k: ui.caseStudy.platform, v: t(p.platform) },
  ];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[70] bg-ink-950"
    >
      <div ref={scrollRef} data-lenis-prevent className="h-full overflow-y-auto overscroll-contain">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]" style={{ background: `radial-gradient(60% 70% at 50% 0%, ${p.accent.a}22, transparent 70%)` }} />

        {/* top bar */}
        <div className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink-950/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] py-2 pe-4 ps-3 text-[13.5px] text-fog-200 ring-1 ring-white/10 transition-colors hover:text-fog-50"
            >
              <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
              {t(ui.caseStudy.back)}
            </button>
            <p className="latin hidden font-mono text-[12px] uppercase tracking-[0.16em] text-fog-500 sm:block">
              <span style={{ color: p.accent.a }}>{digits(p.index)}</span> / {t(p.name)}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t(ui.common.close)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] text-fog-200 ring-1 ring-white/10 transition-colors hover:text-fog-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <motion.article
          key={p.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-8"
        >
          {/* header */}
          <header className="pt-12 sm:pt-20">
            <p className="font-mono text-xs uppercase tracking-label" style={{ color: p.accent.a }}>
              {t(p.kicker)}
            </p>
            <h1 id="case-title" className="mt-4 font-display text-[clamp(3.2rem,11vw,8.5rem)] font-bold leading-display tracking-display text-fog-50">
              {t(p.name)}
            </h1>
            <p className="mt-5 max-w-3xl text-[clamp(1.15rem,2.2vw,1.6rem)] leading-snug-i18n text-fog-200">{t(p.tagline)}</p>
            <dl className="mt-10 grid gap-6 border-y border-white/[0.07] py-6 sm:grid-cols-4">
              {meta.map((m) => (
                <div key={m.k.en}>
                  <dt className="font-mono text-[11px] uppercase tracking-label text-fog-500">{t(m.k)}</dt>
                  <dd className="mt-2 text-[15px] text-fog-100">{m.v}</dd>
                </div>
              ))}
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-label text-fog-500">{t(ui.caseStudy.stack)}</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <Chip key={s} className="px-2 py-0.5 text-[11px]">
                      {s}
                    </Chip>
                  ))}
                </dd>
              </div>
            </dl>
          </header>

          {/* hero media */}
          <div className="mt-12">
            <CaseHero p={p} />
          </div>

          {/* overview + metrics */}
          <section className="mt-20 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <H>{t(ui.caseStudy.overview)}</H>
              <p className="text-[clamp(1.1rem,1.6vw,1.3rem)] leading-body text-fog-200">{t(p.summary)}</p>
            </div>
            <dl className="grid content-start gap-3">
              {p.metrics.map((m, i) => (
                <div key={i} className="flex items-baseline justify-between gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4">
                  <dt className="text-[14px] text-fog-400">{t(m.label)}</dt>
                  <dd>
                    <AnimatedValue value={m.value} className="font-display text-3xl font-bold text-fog-50" />
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* features */}
          <section className="mt-20">
            <H>{t(ui.caseStudy.features)}</H>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {p.features.map((f, i) => {
                const Icon = ICONS[f.icon];
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, root: scrollRef, margin: "0px 0px -10% 0px" }}
                    transition={{ delay: (i % 3) * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-3xl border border-white/[0.07] bg-ink-900/70 p-6"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-white/10" style={{ background: `${p.accent.a}1a`, color: p.accent.a }}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold text-fog-50">{t(f.title)}</h3>
                    <p className="mt-2 text-[14.5px] leading-body text-fog-400">{t(f.text)}</p>
                  </motion.li>
                );
              })}
            </ul>
          </section>

          {/* under the hood */}
          <section className="mt-20">
            <H>{t(ui.caseStudy.underTheHood)}</H>
            <div className="grid gap-5 lg:grid-cols-2">
              {p.details.map((d, i) => (
                <p key={i} className="text-[15.5px] leading-body text-fog-300">
                  {t(d)}
                </p>
              ))}
            </div>
            <div className="mt-10">
              {p.id === "hellogap" ? (
                <HelloGapDiagram />
              ) : p.id === "ai-offline" ? (
                <div className="grid gap-6">
                  <OfflineFlow />
                  <ConfigSnippet />
                </div>
              ) : (
                <Pipeline id={p.id} />
              )}
            </div>
          </section>

          {/* gallery */}
          {p.gallery.length > 0 && (
            <section className="mt-20">
              <H>{t(ui.caseStudy.gallery)}</H>
              <ul className={cn("grid gap-3", p.gallery[0].h > p.gallery[0].w ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2")}>
                {p.gallery.map((img, i) => (
                  <li key={img.src}>
                    <button
                      type="button"
                      onClick={() => openLightbox(p.gallery, i)}
                      className="group block w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900 text-start"
                    >
                      <span className="block overflow-hidden" style={{ aspectRatio: `${img.w} / ${img.h}` }}>
                        <img
                          src={img.small ?? img.src}
                          alt={t(img.alt)}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                        />
                      </span>
                      {img.caption && <span className="block px-4 py-3 text-[13px] text-fog-400 transition-colors group-hover:text-fog-200">{t(img.caption)}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* credits + links */}
          {(p.credits || p.links) && (
            <section className="mt-20 grid gap-6 sm:grid-cols-2">
              {p.credits && (
                <div>
                  <H>{t(ui.caseStudy.credits)}</H>
                  <p className="text-[15px] leading-body text-fog-300">{t(p.credits)}</p>
                </div>
              )}
              {p.links && (
                <div>
                  <H>{t(ui.caseStudy.links)}</H>
                  <ul className="flex flex-wrap gap-2">
                    {p.links.map((lnk) => (
                      <li key={lnk.url}>
                        <a
                          href={lnk.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[14px] text-fog-200 transition-colors hover:border-white/25 hover:text-fog-50"
                        >
                          {t(lnk.label)}
                          <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* next project */}
          <a
            href={`#/work/${next.id}`}
            onClick={(e) => {
              e.preventDefault();
              openProject(next.id);
            }}
            className="group relative mt-24 block overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900 p-8 sm:p-12"
          >
            <div aria-hidden className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(60% 120% at ${isFa ? "10%" : "90%"} 50%, ${next.accent.a}30, transparent 70%)` }} />
            <p className="relative font-mono text-xs uppercase tracking-label text-fog-500">{t(ui.caseStudy.next)}</p>
            <div className="relative mt-3 flex items-end justify-between gap-6">
              <div>
                <p className="font-display text-[clamp(2.4rem,7vw,5rem)] font-bold leading-display tracking-display text-fog-50">{t(next.name)}</p>
                <p className="mt-2 text-fog-400">{t(next.tagline)}</p>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-fog-50 text-ink-950 transition-transform duration-500 group-hover:rotate-45 rtl:group-hover:-rotate-45">
                <ArrowUpRight className="h-6 w-6 rtl:-scale-x-100" />
              </span>
            </div>
          </a>
        </motion.article>
      </div>
    </motion.div>
  );
}
