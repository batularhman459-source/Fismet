import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import FeaturesWithPanel from "@/components/ui/features-with-panel";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { FISMET_LOADER_TUNING, FismetGlassReveal } from "@/components/ui/liquid-glass-logo-reveal";
import { PrismaHero } from "@/components/ui/prisma-hero";
import StackSpread from "@/components/ui/stack-spread";
import { Component as KineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";

const EASE = [0.76, 0, 0.24, 1] as const;
const LOGO_SRC = `${import.meta.env.BASE_URL}fismet-logo.png`;

export default function App() {
  const [loading, setLoading] = useState(true);

  // Ladebildschirm: so lange das Glas-Reveal läuft, danach Vorhang nach oben zum Hero
  useEffect(() => {
    // Die Animationen laufen bewusst auch bei „Animationen reduzieren“ (Windows/macOS)
    // Notbremse: spätestens nach 5 s ist der Ladebildschirm weg
    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);
    const t = window.setTimeout(() => setLoading(false), 5000);
    return () => {
      window.clearTimeout(t);
      root.style.overflow = "";
    };
  }, []);

  // Vorhang öffnet, sobald das Glas das Logo freigegeben hat (~1,9 s nach Animationsstart)
  const revealTimer = useRef<number | undefined>(undefined);
  const onRevealStart = useCallback(() => {
    if (revealTimer.current !== undefined) return;
    revealTimer.current = window.setTimeout(() => setLoading(false), (FISMET_LOADER_TUNING.present + 0.6) * 1000);
  }, []);
  useEffect(() => () => window.clearTimeout(revealTimer.current), []);

  useEffect(() => {
    if (!loading) document.documentElement.style.overflow = "";
  }, [loading]);

  return (
    <main className="bg-ink">
      <KineticNavigation
        hidden={loading}
        logoSrc={LOGO_SRC}
        logo="Fismet Webdesign"
        meta={
          <>
            <a href="mailto:hallo@fismet.de">hallo@fismet.de</a>
            <span>Pierre &amp; Abderrahman</span>
          </>
        }
      />

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 bg-ink"
            initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <FismetGlassReveal
              className="h-full w-full"
              logo={LOGO_SRC}
              originalColors
              logoScale={0.62}
              finalScale={0.9}
              onRevealStart={onRevealStart}
              respectReducedMotion={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        id="studio"
        initial={{ scale: 1.08, filter: "blur(12px)" }}
        animate={loading ? {} : { scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <PrismaHero ready={!loading} navItems={[]} />
      </motion.div>

      <StackSpread />

      <FeaturesWithPanel id="leistungen" />

      <div id="team" className="mt-8 md:mt-16">
        <HalftoneWordmarkFooter
          id="kontakt"
          wordmark="fismet"
          label="Fismet Webdesign"
          meta="© 2026 · Pierre & Abderrahman"
          palette={{ background: "#0b0b0a", ink: "#e1e0cc", warm: "#e9762b" }}
          backToTopLabel="Nach oben ↑"
          radius={115}
          drag={0.75}
          respectReducedMotion={false}
          columns={[
            {
              title: "Studio",
              links: [
                { label: "Leistungen", href: "#leistungen" },
                { label: "Projekte", href: "#projekte" },
                { label: "Team", href: "#team" },
              ],
            },
            {
              title: "Kontakt",
              links: [
                { label: "hallo@fismet.de", href: "mailto:hallo@fismet.de" },
                { label: "Instagram", href: "#" },
              ],
            },
            {
              title: "Rechtliches",
              links: [
                { label: "Impressum", href: "#" },
                { label: "Datenschutz", href: "#" },
              ],
            },
          ]}
        />
      </div>
    </main>
  );
}
