import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import FeaturesWithPanel from "@/components/ui/features-with-panel";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { FismetGlassReveal, glassRevealDuration } from "@/components/ui/liquid-glass-logo-reveal";
import { PrismaHero } from "@/components/ui/prisma-hero";
import StackSpread from "@/components/ui/stack-spread";
import { Component as KineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function App() {
  const [loading, setLoading] = useState(true);

  // Ladebildschirm: so lange das Glas-Reveal läuft, danach Vorhang nach oben zum Hero
  useEffect(() => {
    // Die Animationen laufen bewusst auch bei „Animationen reduzieren“ (Windows/macOS)
    const ms = (glassRevealDuration("dark") + 0.4) * 1000;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => {
      window.clearTimeout(t);
      root.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!loading) document.documentElement.style.overflow = "";
  }, [loading]);

  return (
    <main className="bg-ink">
      <KineticNavigation
        hidden={loading}
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
            transition={{ duration: 1, ease: EASE }}
          >
            <FismetGlassReveal className="h-full w-full" respectReducedMotion={false} />
            <p className="pointer-events-none absolute inset-x-0 bottom-8 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-primary/40">
              Fismet Webdesign
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        id="studio"
        initial={{ scale: 1.08, filter: "blur(12px)" }}
        animate={loading ? {} : { scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <PrismaHero ready={!loading} />
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
