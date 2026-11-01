import type { CSSProperties } from "react";
import { marqueeRows, type Tool } from "../data/stack";
import { BrandIcon } from "./ui/icons";

function Row({ tools, reverse, duration }: { tools: Tool[]; reverse?: boolean; duration: number }) {
  const items = [...tools, ...tools];
  return (
    // the marquee always runs left-to-right in the DOM so the -50% loop is seamless in both languages
    <div dir="ltr" className="group relative flex overflow-hidden mask-fade-x">
      <ul
        className={`flex w-max shrink-0 items-center gap-3 py-2 group-hover:[animation-play-state:paused] ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {items.map((tool, i) => (
          <li
            key={`${tool.name}-${i}`}
            aria-hidden={i >= tools.length}
            className="latin flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-[14px] font-medium text-fog-300 transition-colors hover:border-white/20 hover:text-fog-50"
          >
            {tool.icon && <BrandIcon icon={tool.icon} size={16} color={tool.color} />}
            {tool.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-label="Tools" className="relative border-y border-white/[0.06] bg-ink-900/40 py-6">
      <div className="flex flex-col gap-3">
        <Row tools={marqueeRows[0]} duration={46} />
        <Row tools={marqueeRows[1]} duration={52} reverse />
      </div>
    </section>
  );
}
