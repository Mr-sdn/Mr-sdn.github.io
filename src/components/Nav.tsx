import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { useLang, type Lang } from "../i18n/lang";
import { ui } from "../data/ui";
import { profile } from "../data/profile";
import { Monogram } from "./ui/icons";
import { cn, scrollToId, useScrollLock } from "../lib/hooks";

const LINKS = [
  { id: "work", label: ui.nav.work },
  { id: "about", label: ui.nav.about },
  { id: "stack", label: ui.nav.stack },
  { id: "contact", label: ui.nav.contact },
] as const;

function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const opts: { id: Lang; label: string }[] = [
    { id: "fa", label: "فا" },
    { id: "en", label: "EN" },
  ];
  return (
    <div role="group" aria-label="Language" className={cn("relative flex rounded-full bg-white/[0.06] p-0.5 ring-1 ring-white/10", className)}>
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setLang(o.id)}
          aria-pressed={lang === o.id}
          lang={o.id}
          className={cn(
            "relative z-10 h-8 min-w-9 rounded-full px-2.5 text-[12.5px] font-semibold transition-colors",
            lang === o.id ? "text-ink-950" : "text-fog-400 hover:text-fog-100",
          )}
        >
          {lang === o.id && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 -z-10 rounded-full bg-fog-50"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}
          <span className={o.id === "fa" ? "font-fa" : "latin font-sans"}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Nav({ hidden }: { hidden?: boolean }) {
  const { t, isFa } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("top");
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const ids = ["top", ...LINKS.map((l) => l.id)];
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToId(id), open ? 280 : 0);
  };

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-ice via-fog-50 to-amber rtl:origin-right"
      />

      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4"
      >
        <nav
          aria-label="Main"
          className={cn(
            "flex w-full max-w-[860px] items-center gap-1 rounded-full py-1.5 pe-1.5 ps-1.5 transition-[background,box-shadow,border-color] duration-500",
            scrolled
              ? "glass shadow-[0_20px_60px_-25px_rgba(0,0,0,0.9)]"
              : "border border-transparent bg-transparent",
          )}
        >
          <a
            href="#top"
            onClick={go("top")}
            className="flex items-center gap-2.5 rounded-full py-0.5 pe-3 ps-0.5 transition-colors hover:bg-white/5"
            aria-label={t(ui.nav.home)}
          >
            <Monogram size={36} />
            <span className="latin hidden font-display text-[15px] font-bold tracking-tight text-fog-50 sm:inline">
              {profile.brand}
            </span>
          </a>

          <ul className="mx-auto hidden items-center gap-0.5 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  aria-current={active === l.id ? "true" : undefined}
                  className={cn(
                    "relative block rounded-full px-4 py-2 text-[14px] font-medium transition-colors",
                    active === l.id ? "text-fog-50" : "text-fog-400 hover:text-fog-100",
                  )}
                >
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {t(l.label)}
                </a>
              </li>
            ))}
          </ul>

          <div className="ms-auto flex items-center gap-1.5 md:ms-0">
            <LangSwitch />
            <a
              href="#contact"
              onClick={go("contact")}
              className="hidden rounded-full bg-fog-50 px-4 py-2 text-[13.5px] font-semibold text-ink-950 transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
            >
              {t(ui.nav.cta)}
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={t(open ? ui.nav.close : ui.nav.menu)}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex h-full flex-col justify-center gap-2 px-8">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: isFa ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a href={`#${l.id}`} onClick={go(l.id)} className="flex items-baseline gap-4 py-2 font-display text-5xl font-bold text-fog-50">
                    <span className="latin font-mono text-sm font-normal text-amber">0{i + 1}</span>
                    {t(l.label)}
                  </a>
                </motion.li>
              ))}
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10">
                <a href={`mailto:${profile.email}`} className="latin font-mono text-sm text-fog-400">
                  {profile.email}
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
