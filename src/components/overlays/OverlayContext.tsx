import { createContext, useContext } from "react";
import type { Img, ProjectId } from "../../data/projects";

export type Overlays = {
  openProject: (id: ProjectId) => void;
  openFilm: () => void;
  openLightbox: (images: Img[], index: number) => void;
};

export const OverlayContext = createContext<Overlays | null>(null);

export function useOverlays() {
  const v = useContext(OverlayContext);
  if (!v) throw new Error("useOverlays must be used inside OverlayContext");
  return v;
}
