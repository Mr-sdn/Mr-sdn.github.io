import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLang } from "../../i18n/lang";
import type { Img } from "../../data/projects";
import { ui } from "../../data/ui";

export function Lightbox({ images, index, onIndex, onClose }: { images: Img[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const { t, isFa } = useLang();
  const img = images[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const go = (d: number) => onIndex((index + d + images.length) % images.length);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // in Persian "next" is to the left
      if (e.key === "ArrowRight") go(isFa ? -1 : 1);
      if (e.key === "ArrowLeft") go(isFa ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <motion.div
      data-lightbox
      role="dialog"
      aria-modal="true"
      aria-label={t(img.alt)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-xl"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <span className="latin font-mono text-[12px] text-fog-400">
          {index + 1} / {images.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t(ui.common.close)}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-fog-50 ring-1 ring-white/15 hover:bg-white/15"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={img.src}
            src={img.src}
            alt={t(img.alt)}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label={t(ui.common.prev)}
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute start-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-fog-50 ring-1 ring-white/15 hover:bg-white/20 sm:start-6"
            >
              <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              aria-label={t(ui.common.next)}
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute end-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-fog-50 ring-1 ring-white/15 hover:bg-white/20 sm:end-6"
            >
              <ChevronRight className="h-5 w-5 rtl:-scale-x-100" />
            </button>
          </>
        )}
      </div>
      <p className="px-5 py-5 text-center text-[14px] text-fog-300" onClick={(e) => e.stopPropagation()}>
        {img.caption ? t(img.caption) : t(img.alt)}
      </p>
    </motion.div>
  );
}
