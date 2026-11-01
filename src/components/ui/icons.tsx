import type { SimpleIcon } from "simple-icons";
import { siGithub, siGmail, siInstagram, siTelegram } from "simple-icons";
import type { SocialId } from "../../data/profile";

const LINKEDIN =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

export function BrandIcon({ icon, size = 18, color, className }: { icon: SimpleIcon; size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={className} fill={color ?? "currentColor"}>
      <path d={icon.path} />
    </svg>
  );
}

export function SocialIcon({ id, size = 18 }: { id: SocialId; size?: number }) {
  if (id === "linkedin")
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="currentColor">
        <path d={LINKEDIN} />
      </svg>
    );
  const map: Record<Exclude<SocialId, "linkedin">, SimpleIcon> = {
    telegram: siTelegram,
    github: siGithub,
    instagram: siInstagram,
    email: siGmail,
  };
  return <BrandIcon icon={map[id]} size={size} />;
}

/** The SDN monogram (same mark as the favicon). */
export function Monogram({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="mono-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5ce1e6" />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="#0d0d13" />
      <rect x="1" y="1" width="62" height="62" rx="17" fill="none" stroke="url(#mono-g)" strokeOpacity=".5" strokeWidth="2" />
      <path
        d="M41.5 21.5c-1.6-2.7-4.9-4.3-9.4-4.3-6 0-9.9 3-9.9 7.4 0 4.2 3.2 6.1 8.6 7.2l2.8.6c3.4.7 4.8 1.6 4.8 3.3 0 2-2.2 3.3-5.6 3.3-3.6 0-6-1.4-7.1-3.9l-4.6 2.3c1.6 4 5.9 6.4 11.6 6.4 6.5 0 10.9-3.2 10.9-8.1 0-4.3-3-6.3-8.7-7.4l-2.8-.6c-3.1-.6-4.4-1.4-4.4-3 0-1.7 1.8-2.9 4.5-2.9 2.8 0 4.7 1.1 5.6 3.1z"
        fill="url(#mono-g)"
      />
      <circle cx="47" cy="45" r="3" fill="#ffb547" />
    </svg>
  );
}
