import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

// Scrolling is the browser's own. A JS smooth-scroll library (Lenis) used to drive it from the main thread,
// which added input delay and stuttered whenever the page was busy; native scrolling runs on the compositor.

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY - 20;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/** Lock page scroll while overlays are open (counted, so nested overlays work). */
let locks = 0;
export function lockScroll(locked: boolean) {
  locks = Math.max(0, locks + (locked ? 1 : -1));
  document.documentElement.classList.toggle("overlay-open", locks > 0);
}

/** True while the page is being scrolled (and for `idleMs` after), for pausing work that would compete with it. */
let lastScroll = -1e9;
if (typeof window !== "undefined") window.addEventListener("scroll", () => (lastScroll = performance.now()), { passive: true, capture: true });
export const isScrolling = (idleMs = 200) => performance.now() - lastScroll < idleMs;

/** Hold a scroll lock for as long as `active` is true. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [active]);
}

/** Case-study routing through the URL hash: #/work/<id> (shareable + back button closes it). */
export function useWorkRoute() {
  const read = () => {
    const m = window.location.hash.match(/^#\/work\/([\w-]+)/);
    return m ? m[1] : null;
  };
  const [id, setId] = useState<string | null>(read);
  const pushed = useRef(false);

  useEffect(() => {
    const on = () => setId(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const open = useCallback((next: string) => {
    if (read() === next) return;
    const wasOpen = read() !== null;
    if (wasOpen) {
      window.location.replace(`#/work/${next}`);
    } else {
      pushed.current = true;
      window.location.hash = `/work/${next}`;
    }
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      setId(null);
    }
  }, []);

  return { id, open, close };
}

export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px", once = false) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting && once) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
  return inView;
}

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
