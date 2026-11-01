import { useLang } from "../i18n/lang";
import { ui } from "../data/ui";
import { alsoTools, capabilityGroups } from "../data/stack";
import { BrandIcon } from "./ui/icons";
import { GlowCard, Reveal, SectionTitle } from "./ui/primitives";

export function Stack() {
  const { t, digits } = useLang();
  return (
    <section id="stack" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle index="03" eyebrow={ui.stack.eyebrow} title={ui.stack.title} />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {capabilityGroups.map((g, i) => {
            const hero = g.tools.find((x) => x.icon);
            return (
              <Reveal key={g.key} delay={i * 0.07}>
                <GlowCard accent={g.accent} className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900/70 p-7 sm:p-9">
                  {hero?.icon && (
                    <BrandIcon
                      icon={hero.icon}
                      size={190}
                      color={g.accent}
                      className="pointer-events-none absolute -bottom-10 -end-8 opacity-[0.06] transition-all duration-700 group-hover:-rotate-6 group-hover:opacity-[0.12]"
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <span className="latin font-mono text-xs text-fog-500">{digits(`0${i + 1}`)}</span>
                    <span className="h-px flex-1 bg-white/[0.08]" />
                    <span className="h-2 w-2 rounded-full" style={{ background: g.accent, boxShadow: `0 0 14px 2px ${g.accent}88` }} />
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-bold tracking-display text-fog-50 sm:text-4xl">{t(g.title)}</h3>
                  <p className="mt-3 max-w-md text-[15px] leading-body text-fog-400">{t(g.text)}</p>
                  <ul className="relative mt-7 flex flex-wrap gap-2">
                    {g.tools.map((tool) => (
                      <li
                        key={tool.name}
                        className="latin inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13.5px] text-fog-200 transition-colors hover:border-white/20"
                      >
                        {tool.icon && <BrandIcon icon={tool.icon} size={15} color={tool.color} />}
                        {tool.name}
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-fog-400">
            <span className="font-mono text-xs uppercase tracking-label text-fog-500">{t(ui.stack.also)}</span>
            {alsoTools.map((tool) => (
              <span key={tool.name} className="latin inline-flex items-center gap-2 text-[14px] text-fog-300">
                {tool.icon && <BrandIcon icon={tool.icon} size={14} color={tool.color} />}
                {tool.name}
                <span className="text-fog-600">/</span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
