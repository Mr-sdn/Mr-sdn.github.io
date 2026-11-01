import { ArrowUp } from "lucide-react";
import { useLang } from "../i18n/lang";
import { ui } from "../data/ui";
import { profile } from "../data/profile";
import { scrollToId } from "../lib/hooks";

export function Footer() {
  const { t, digits } = useLang();
  const year = digits(String(new Date().getFullYear()));
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] pt-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-lg font-semibold text-fog-50">{t(profile.name)}</p>
          <p className="mt-1 text-[13.5px] text-fog-500">
            © {year} — {t(ui.footer.rights)} {t(ui.footer.built)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => scrollToId("top")}
          className="group inline-flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/[0.03] py-2 pe-2 ps-5 text-[14px] text-fog-300 transition-colors hover:text-fog-50 sm:self-auto"
        >
          {t(ui.nav.home)}
          <span className="grid h-9 w-9 place-items-center rounded-full bg-fog-50 text-ink-950 transition-transform duration-300 group-hover:-translate-y-0.5">
            <ArrowUp className="h-4 w-4" />
          </span>
        </button>
      </div>
      {/* the giant wordmark */}
      <div aria-hidden dir="ltr" className="pointer-events-none relative mt-10 select-none overflow-hidden">
        <p
          className="latin translate-y-[16%] text-center font-display text-[clamp(7rem,31vw,30rem)] font-extrabold leading-[0.8] tracking-[-0.06em]"
          style={{
            backgroundImage: "linear-gradient(180deg, rgba(246,246,248,0.16) 0%, rgba(246,246,248,0.04) 55%, rgba(246,246,248,0) 85%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {profile.brand}
        </p>
      </div>
    </footer>
  );
}
