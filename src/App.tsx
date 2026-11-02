import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useLang } from "./i18n/lang";
import { projectById, type Img, type ProjectId } from "./data/projects";
import { useMediaQuery, useScrollLock, useSmoothScroll, useWorkRoute } from "./lib/hooks";
import { OverlayContext, type Overlays } from "./components/overlays/OverlayContext";
import { Nav } from "./components/Nav";
import { Hero } from "./components/hero/Hero";
import { Marquee } from "./components/Marquee";
import { Work } from "./components/work/Work";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
// overlays load on first use, keeping the first paint lighter
const CaseStudy = lazy(() => import("./components/overlays/CaseStudy").then((m) => ({ default: m.CaseStudy })));
const Lightbox = lazy(() => import("./components/overlays/Lightbox").then((m) => ({ default: m.Lightbox })));

function CursorGlow() {
  const fine = useMediaQuery("(pointer: fine)");
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 110, damping: 22, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 110, damping: 22, mass: 0.7 });
  useEffect(() => {
    if (!fine) return;
    const on = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, [fine, x, y]);
  if (!fine) return null;
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-0 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,236,200,0.05),transparent)]"
    />
  );
}

export default function App() {
  useSmoothScroll();
  const { t } = useLang();
  const route = useWorkRoute();
  const project = projectById(route.id);
  const [lightbox, setLightbox] = useState<{ images: Img[]; index: number } | null>(null);

  useScrollLock(!!project);
  useScrollLock(!!lightbox);

  const openRoute = route.open;
  const overlays = useMemo<Overlays>(
    () => ({
      openProject: (id: ProjectId) => openRoute(id),
      openLightbox: (images, index) => setLightbox({ images, index }),
    }),
    [openRoute],
  );

  return (
    <OverlayContext.Provider value={overlays}>
      <a
        href="#work"
        className="sr-only z-[100] rounded-full bg-fog-50 px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t({ fa: "رفتن به نمونه‌کارها", en: "Skip to work" })}
      </a>
      <CursorGlow />
      <Nav hidden={!!project} />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Work />
        <About />
        <Services />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <div className="grain" aria-hidden />

      <Suspense fallback={null}>
        <AnimatePresence>{project && <CaseStudy key="case" project={project} onClose={route.close} />}</AnimatePresence>
        <AnimatePresence>
          {lightbox && (
            <Lightbox
              key="lightbox"
              images={lightbox.images}
              index={lightbox.index}
              onIndex={(i) => setLightbox((l) => (l ? { ...l, index: i } : l))}
              onClose={() => setLightbox(null)}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </OverlayContext.Provider>
  );
}
