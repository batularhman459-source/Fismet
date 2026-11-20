import type Lenis from "lenis";

// Gemeinsamer Zugriff auf das Smooth-Scrolling (Lenis), damit Ladebildschirm und Menü
// das Scrollen sperren können. Lenis scrollt sonst trotz `overflow: hidden` weiter.
let lenis: Lenis | null = null;
const locks = new Set<string>();

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  apply();
}

export function setScrollLocked(key: string, locked: boolean) {
  if (locked) locks.add(key);
  else locks.delete(key);
  apply();
}

function apply() {
  const locked = locks.size > 0;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}
