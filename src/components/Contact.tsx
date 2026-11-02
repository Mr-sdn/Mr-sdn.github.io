import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, Copy, Mail } from "lucide-react";
import { useLang } from "../i18n/lang";
import { ui } from "../data/ui";
import { liveSocials, profile } from "../data/profile";
import { Reveal } from "./ui/primitives";
import { SocialIcon } from "./ui/icons";
import { cn } from "../lib/hooks";

export function Contact() {
  const { t, isFa, digits } = useLang();
  const reduce = useReducedMotion();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [nudge, setNudge] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const s = text.trim();
    if (!s) {
      setNudge(true);
      inputRef.current?.focus();
      window.setTimeout(() => setNudge(false), 1600);
      return;
    }
    const url = `mailto:${profile.email}?subject=${encodeURIComponent(t(ui.contact.subject))}&body=${encodeURIComponent(s)}`;
    window.location.href = url;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const socials = liveSocials();

  return (
    <section id="contact" className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[35%] h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,181,71,0.12),transparent)]" />
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="mb-6 font-mono text-xs uppercase tracking-label text-fog-400">
            <span className="latin text-amber">({digits("04")})</span> — {t(ui.contact.eyebrow)}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-[clamp(2.3rem,6.6vw,5.6rem)] font-bold leading-display tracking-display text-fog-50">
            {t(ui.contact.title1)}
            <br />
            <span className={cn(isFa ? "font-light" : "font-serif font-normal italic", "text-gradient")}>{t(ui.contact.title2)}</span>
          </h2>
        </Reveal>

        {/* one line about the project → opens the visitor's email app with it */}
        <Reveal delay={0.12}>
          <form onSubmit={send} className="mx-auto mt-12 max-w-2xl">
            <motion.div
              animate={nudge && !reduce ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: 0.45 }}
              className="group relative flex items-center gap-3 rounded-full border border-white/10 bg-ink-850/80 p-2 shadow-[0_30px_80px_-30px_rgba(255,181,71,0.35)] backdrop-blur transition-colors focus-within:border-amber/50"
            >
              <span aria-hidden className="relative ms-1 grid h-11 w-11 shrink-0 place-items-center">
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,181,71,0.55),transparent_70%)] blur-md" />
                <span className="relative h-5 w-5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff6df,var(--color-amber)_55%,#e07b12)] shadow-[0_0_24px_6px_rgba(255,181,71,0.55)]" />
              </span>
              <label htmlFor="project-line" className="sr-only">
                {t(ui.contact.inputLabel)}
              </label>
              <input
                id="project-line"
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t(ui.contact.placeholder)}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-3 text-[15.5px] text-fog-50 placeholder:text-fog-500 focus:outline-none sm:text-base"
              />
              <button
                type="submit"
                aria-label={t(ui.contact.send)}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[linear-gradient(110deg,var(--color-amber-soft),var(--color-amber))] px-4 py-3 text-[14px] font-semibold text-ink-950 transition-transform hover:scale-[1.03] active:scale-95 sm:px-5"
              >
                <span className="hidden sm:inline">{t(ui.contact.send)}</span>
                <ArrowUp className="h-4 w-4" />
              </button>
            </motion.div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={nudge ? "n" : "h"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className={cn("mt-3 text-[13px]", nudge ? "text-amber" : "text-fog-500")}
              >
                {t(nudge ? ui.contact.empty : ui.contact.sendHint)}
              </motion.p>
            </AnimatePresence>
          </form>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-12 flex flex-col items-center gap-5">
            <p className="text-[13px] text-fog-500">{t(ui.contact.or)}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {socials
                .filter((s) => s.id === "telegram")
                .map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="latin inline-flex items-center gap-3 rounded-full border border-[#2AABEE]/40 bg-[#2AABEE]/10 px-5 py-3 font-mono text-[15px] text-fog-50 transition-colors hover:border-[#2AABEE]/70 hover:bg-[#2AABEE]/20"
                  >
                    <span className="text-[#2AABEE]">
                      <SocialIcon id={s.id} size={16} />
                    </span>
                    {s.handle ?? s.label}
                  </a>
                ))}
              <a
                href={`mailto:${profile.email}`}
                className="latin inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 font-mono text-[15px] text-fog-100 transition-colors hover:border-white/25 hover:bg-white/[0.07]"
              >
                <Mail className="h-4 w-4 text-amber" />
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-[13.5px] text-fog-300 transition-colors hover:border-white/25 hover:text-fog-50"
              >
                <Copy className="h-4 w-4" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={copied ? "c" : "n"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    {t(copied ? ui.contact.copied : ui.contact.copy)}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
            {socials.some((s) => s.id !== "telegram") && (
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {socials.filter((s) => s.id !== "telegram").map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="latin inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[14px] text-fog-300 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:text-fog-50"
                    >
                      <SocialIcon id={s.id} size={16} />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
